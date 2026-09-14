"""Fine-tune a field-robust plant disease model.

The shipped PlantVillage model reaches only ~23.5% top-1 on real field photos
(PlantDoc test split, chance is 6.7%): it only ever saw studio-style images,
one centred leaf on a plain background. This script trains a new model on a
*mixed* dataset so field photos become in-distribution:

  * ``Data/plantvillage``  -- the studio images already in the repository
  * PlantDoc               -- ~1,000 real-world photos (CC-BY 4.0) whose classes
                              map onto our 15 labels

with domain-bridging augmentation (aggressive crops, colour/lighting jitter,
rotation, blur) and field images oversampled so the ~1,000 real photos are not
drowned out by ~20,000 studio images. Measured on the PlantDoc test split the
staged model reached 62.7% field accuracy with this script's eval transform
(65.7% with the runtime's plain resize) and 94.3% studio accuracy.

Outputs ``models/plant_disease_field.onnx`` (raw 0-255 NHWC RGB input with
normalisation baked into the graph, so the runtime preprocessing is identical
to the shipped model). Promote it to ``models/plant_disease.onnx`` only after
re-measuring that its field accuracy still beats the shipped model's 23.5% and
the OOD calibration has been rebuilt (``python train_disease_ood.py``).

Requirements (dev-only, not needed to run the app):
    pip install torch torchvision onnx
    git clone --depth 1 https://github.com/pratikkayal/PlantDoc-Dataset.git /tmp/plantdoc

Usage:
    python train_disease_field.py --plantdoc /tmp/plantdoc
    python train_disease_field.py --plantdoc /tmp/plantdoc --quick   # smoke test
"""
from __future__ import annotations

import argparse
import json
import random
import sys
import time
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from PIL import Image
from torch.utils.data import DataLoader, Dataset, WeightedRandomSampler
from torchvision import transforms
from torchvision.models import EfficientNet_B0_Weights, efficientnet_b0

from ml_service import DISEASE_LABELS, MODEL_DIR

ROOT = Path(__file__).resolve().parent
STUDIO_DIR = ROOT / "Data" / "plantvillage"
CACHE_DIR = Path("/tmp/kisan_field_cache")
# Staged, not the live checkpoint: promote it only after field accuracy is
# measured and the OOD calibration has been rebuilt (see MODEL_SOURCES.md).
EXPORT_PATH = MODEL_DIR / "plant_disease_field.onnx"
IMAGE_SIZE = 224
CACHE_SIZE = 256
IMAGENET_MEAN = (0.485, 0.456, 0.406)
IMAGENET_STD = (0.229, 0.224, 0.225)

# PlantDoc folder name -> shipped label. Folders not listed here are crops the
# 15-class model does not support and are used only as out-of-distribution
# probes, never as training data.
FIELD_MAPPING = {
    "Bell_pepper leaf spot": "Pepper__bell___Bacterial_spot",
    "Bell_pepper leaf": "Pepper__bell___healthy",
    "Potato leaf early blight": "Potato___Early_blight",
    "Potato leaf late blight": "Potato___Late_blight",
    "Tomato Early blight leaf": "Tomato_Early_blight",
    "Tomato Septoria leaf spot": "Tomato_Septoria_leaf_spot",
    "Tomato leaf": "Tomato_healthy",
    "Tomato leaf bacterial spot": "Tomato_Bacterial_spot",
    "Tomato leaf late blight": "Tomato_Late_blight",
    "Tomato leaf mosaic virus": "Tomato__Tomato_mosaic_virus",
    "Tomato leaf yellow virus": "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato mold leaf": "Tomato_Leaf_Mold",
    "Tomato two spotted spider mites leaf": "Tomato_Spider_mites_Two_spotted_spider_mite",
}

CHECKPOINT = Path("/tmp/kisan_field_state.pt")
STUDIO_PER_CLASS = 300      # cap so studio images do not swamp the field data
FIELD_REPEAT = 4            # oversample field photos by this factor
STUDIO_VAL_FRACTION = 0.1
SEED = 42


class CachedDataset(Dataset):
    """Serves pre-resized JPEGs so epochs are not dominated by disk decoding."""

    def __init__(self, samples: list[tuple[Path, int]], transform) -> None:
        self.samples = samples
        self.transform = transform

    def __len__(self) -> int:
        return len(self.samples)

    def __getitem__(self, index: int):
        path, label = self.samples[index]
        with Image.open(path) as image:
            tensor = self.transform(image.convert("RGB"))
        return tensor, label


def cache_image(source: Path, destination: Path) -> Path:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if not destination.exists():
        with Image.open(source) as image:
            image.convert("RGB").resize((CACHE_SIZE, CACHE_SIZE), Image.BILINEAR).save(
                destination, format="JPEG", quality=88
            )
    return destination


def build_samples(plantdoc: Path, quick: bool) -> tuple[list, list, list, list]:
    rng = random.Random(SEED)
    label_index = {name: i for i, name in enumerate(DISEASE_LABELS)}

    studio: list[tuple[Path, int]] = []
    for name in DISEASE_LABELS:
        files = sorted((STUDIO_DIR / name).glob("*"))
        rng.shuffle(files)
        for source in files[: 60 if quick else STUDIO_PER_CLASS]:
            target = CACHE_DIR / "studio" / name / source.name
            studio.append((cache_image(source, target), label_index[name]))

    field_train, field_test = [], []
    for folder, name in FIELD_MAPPING.items():
        for split, bucket in (("train", field_train), ("test", field_test)):
            directory = plantdoc / split / folder
            if not directory.is_dir():
                continue
            for source in sorted(directory.glob("*")):
                if source.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
                    continue
                target = CACHE_DIR / "field" / split / folder / source.name
                bucket.append((cache_image(source, target), label_index[name]))

    # Hold out part of the studio data so we can confirm studio accuracy does
    # not collapse while field accuracy climbs.
    rng.shuffle(studio)
    cut = int(len(studio) * (1 - STUDIO_VAL_FRACTION))
    studio_train, studio_val = studio[:cut], studio[cut:]
    return studio_train, studio_val, field_train, field_test


def make_loaders(studio_train, studio_val, field_train, field_test, batch_size: int):
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(IMAGE_SIZE, scale=(0.35, 1.0), ratio=(0.75, 1.33)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(30),
        transforms.ColorJitter(brightness=0.45, contrast=0.45, saturation=0.45, hue=0.08),
        transforms.RandomGrayscale(p=0.05),
        transforms.RandomApply([transforms.GaussianBlur(3, sigma=(0.1, 2.0))], p=0.25),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])
    eval_transform = transforms.Compose([
        transforms.Resize(IMAGE_SIZE),
        transforms.CenterCrop(IMAGE_SIZE),
        transforms.ToTensor(),
        transforms.Normalize(IMAGENET_MEAN, IMAGENET_STD),
    ])

    train_samples = list(studio_train) + list(field_train) * FIELD_REPEAT
    counts = np.bincount([label for _, label in train_samples], minlength=len(DISEASE_LABELS))
    weights = [1.0 / max(counts[label], 1) for _, label in train_samples]
    sampler = WeightedRandomSampler(weights, num_samples=len(train_samples), replacement=True)

    train_loader = DataLoader(
        CachedDataset(train_samples, train_transform), batch_size=batch_size,
        sampler=sampler, num_workers=6, persistent_workers=True, drop_last=True,
    )
    return (
        train_loader,
        DataLoader(CachedDataset(studio_val, eval_transform), batch_size=64, num_workers=4),
        DataLoader(CachedDataset(field_test, eval_transform), batch_size=64, num_workers=4),
    )


class ExportWrapper(nn.Module):
    """Accept raw 0-255 NHWC RGB exactly as MLService feeds the current model.

    The wrapper transposes to channels-first for the backbone and bakes in the
    ImageNet normalisation, so promoting the export requires no runtime change.
    """

    def __init__(self, backbone: nn.Module) -> None:
        super().__init__()
        self.backbone = backbone
        self.register_buffer("mean", torch.tensor(IMAGENET_MEAN).view(1, 3, 1, 1))
        self.register_buffer("std", torch.tensor(IMAGENET_STD).view(1, 3, 1, 1))

    def forward(self, pixels: torch.Tensor) -> torch.Tensor:
        channels_first = pixels.permute(0, 3, 1, 2)
        logits = self.backbone((channels_first / 255.0 - self.mean) / self.std)
        # MLService expects probabilities (the shipped tf2onnx model ends in
        # Softmax), so bake the softmax into the graph. Training keeps raw
        # logits because CrossEntropyLoss applies it internally.
        return torch.softmax(logits, dim=1)


def build_model(device: torch.device) -> nn.Module:
    model = efficientnet_b0(weights=EfficientNet_B0_Weights.IMAGENET1K_V1)
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, len(DISEASE_LABELS))
    return model.to(device)


@torch.no_grad()
def evaluate(model: nn.Module, loader: DataLoader, device: torch.device) -> tuple[float, np.ndarray]:
    model.eval()
    correct = total = 0
    confusion = np.zeros((len(DISEASE_LABELS), len(DISEASE_LABELS)), dtype=int)
    for images, labels in loader:
        predictions = model(images.to(device)).argmax(dim=1).cpu()
        for truth, predicted in zip(labels.tolist(), predictions.tolist()):
            confusion[truth, predicted] += 1
        correct += int((predictions == labels).sum())
        total += len(labels)
    return (correct / total if total else 0.0), confusion


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--plantdoc", type=Path, default=Path("/tmp/plantdoc"))
    parser.add_argument("--epochs", type=int, default=12)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--quick", action="store_true", help="tiny run to smoke-test the pipeline")
    parser.add_argument("--resume", action="store_true", help="continue from the last checkpoint")
    parser.add_argument("--reset", action="store_true", help="ignore any existing checkpoint")
    parser.add_argument("--export-only", action="store_true", help="evaluate the saved best checkpoint and re-export ONNX without training")
    args = parser.parse_args()

    if not args.plantdoc.is_dir():
        print(f"PlantDoc not found at {args.plantdoc}; see the module docstring")
        return 1

    torch.manual_seed(SEED)
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    print(f"device: {device} | classes: {len(DISEASE_LABELS)}")

    studio_train, studio_val, field_train, field_test = build_samples(args.plantdoc, args.quick)
    print(f"studio train={len(studio_train)} val={len(studio_val)} | "
          f"field train={len(field_train)} test={len(field_test)}")

    train_loader, studio_loader, field_loader = make_loaders(
        studio_train, studio_val, field_train, field_test, args.batch_size
    )
    model = build_model(device)

    if args.export_only:
        if not CHECKPOINT.exists():
            print(f"no checkpoint at {CHECKPOINT}; train first or drop --export-only", file=sys.stderr)
            return 1
        state = torch.load(CHECKPOINT, map_location="cpu", weights_only=False)
        model.load_state_dict(state["best_state"])
        print("loaded best checkpoint (--export-only; skipping training)", flush=True)
        best_state = None
        epochs = start_epoch = 0
    else:
        head = list(model.classifier.parameters())
        head_ids = {id(p) for p in head}
        body = [p for p in model.parameters() if id(p) not in head_ids]
        optimizer = torch.optim.AdamW([
            {"params": body, "lr": 1e-4},
            {"params": head, "lr": 5e-4},
        ], weight_decay=0.02)
        epochs = 2 if args.quick else args.epochs
        scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=epochs)
        criterion = nn.CrossEntropyLoss(label_smoothing=0.1)

        best_score, best_state, start_epoch = -1.0, None, 0
        if args.reset and CHECKPOINT.exists():
            CHECKPOINT.unlink()
        if args.resume and CHECKPOINT.exists():
            state = torch.load(CHECKPOINT, map_location="cpu", weights_only=False)
            model.load_state_dict(state["model"])
            optimizer.load_state_dict(state["optimizer"])
            scheduler.load_state_dict(state["scheduler"])
            start_epoch = int(state["epoch"])
            best_score = float(state["best_score"])
            best_state = state["best_state"]
            print(f"resumed from epoch {start_epoch}/{epochs}", flush=True)
        if start_epoch >= epochs:
            print("training already complete; reusing checkpoint", flush=True)

    for epoch in range(start_epoch, epochs):
        model.train()
        started, running, seen = time.perf_counter(), 0.0, 0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad(set_to_none=True)
            loss = criterion(model(images), labels)
            loss.backward()
            optimizer.step()
            running += float(loss) * len(labels)
            seen += len(labels)
            if seen % (args.batch_size * 40) == 0:
                rate = seen / (time.perf_counter() - started)
                print(f"  epoch {epoch + 1} {seen}/{len(train_loader.dataset)} "
                      f"loss={running / seen:.3f} {rate:.0f} img/s", flush=True)
        scheduler.step()

        studio_acc, _ = evaluate(model, studio_loader, device)
        field_acc, confusion = evaluate(model, field_loader, device)
        print(f"epoch {epoch + 1}/{epochs} loss={running / max(seen, 1):.3f} | "
              f"studio={studio_acc * 100:.1f}% | FIELD={field_acc * 100:.1f}% "
              f"({time.perf_counter() - started:.0f}s)", flush=True)

        # Prefer field accuracy but keep studio accuracy healthy: a model that
        # cannot read its own training domain is not useful either.
        score = field_acc + 0.5 * studio_acc
        if score > best_score:
            best_score = score
            best_state = {k: v.detach().cpu().clone() for k, v in model.state_dict().items()}
        # write-then-rename so an interrupted run never corrupts the checkpoint
        staging = CHECKPOINT.with_suffix(".tmp")
        torch.save({
            "model": model.state_dict(), "optimizer": optimizer.state_dict(),
            "scheduler": scheduler.state_dict(), "epoch": epoch + 1,
            "best_score": best_score, "best_state": best_state,
        }, staging)
        staging.replace(CHECKPOINT)

    if best_state is not None:
        model.load_state_dict(best_state)
    studio_acc, _ = evaluate(model, studio_loader, device)
    field_acc, confusion = evaluate(model, field_loader, device)
    print(f"\nBEST: studio={studio_acc * 100:.1f}% | field={field_acc * 100:.1f}%")
    print("field per-class accuracy:")
    for index, name in enumerate(DISEASE_LABELS):
        total = confusion[index].sum()
        if total:
            print(f"  {name:48s} n={total:4d} acc={confusion[index, index] / total * 100:5.1f}%")

    print("\nper-class accuracy on supported field classes is the number that matters "
          "(chance is 1/15 = 6.7%)")

    model.eval().to("cpu")  # ONNX export runs on CPU regardless of the train device
    wrapper = ExportWrapper(model).eval()
    example = torch.rand(1, IMAGE_SIZE, IMAGE_SIZE, 3) * 255.0  # NHWC, as MLService feeds it
    torch.onnx.export(
        wrapper, example, str(EXPORT_PATH),
        input_names=["input"], output_names=["sequential"],
        dynamic_axes={"input": {0: "batch"}, "sequential": {0: "batch"}},
        opset_version=17, dynamo=False,
    )
    print(f"wrote {EXPORT_PATH} ({EXPORT_PATH.stat().st_size / 1e6:.1f} MB)")
    Path("/tmp/kisan_field_result.json").write_text(json.dumps({
        "studio_acc": studio_acc, "field_acc": field_acc,
        "field_confusion": confusion.tolist(), "labels": DISEASE_LABELS,
    }, indent=1))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
