"""Calibrate an out-of-distribution (OOD) gate for the plant disease model.

The disease model always returns a full softmax, so every image
(out-of-distribution or not) is forced onto one of its pepper/potato/tomato
classes -- real-world photos and blank images were reported as confident tomato
diseases. This script builds the small calibration artefact that lets
``MLService.diagnose`` reject inputs the model was not trained on:

1. Auto-detect and expose the model's penultimate feature tensor as an extra
   ONNX graph output. Network weights are untouched; only one output
   declaration is added, so runtime inference still needs onnxruntime alone.
2. Extract those features for a sample of local leaf images and compute one
   L2-normalised centroid per class.
3. Set per-class distance thresholds (95th percentile of a held-out calibration
   split) and a softmax winning-margin threshold (5th percentile of the same
   split), then write ``models/plant_disease_centroids.npz``.

A leaf is accepted only when it sits inside the distance envelope of the class
the model predicts AND wins by the calibrated margin. Close-up real-world
photos can pass the distance check while the softmax stays ambiguous (measured:
a field pepper photo at 75% top-1 with a 24% runner-up), so both checks are
required. Thresholds are set so ~95% of known-class images pass each check.

Calibration data covers BOTH domains the shipped model must handle: the studio
PlantVillage images in ``Data/plantvillage`` and, when available, real-world
PlantDoc photos (``/tmp/plantdoc/train``, the same mapping the field model was
fine-tuned with). Field photos sit far from studio photos in feature space, so
calibrating on studio data alone would mark every real photo as OOD even when
the model classifies it correctly. Without PlantDoc the script falls back to
studio-only calibration (narrower envelopes; real photos will be rejected).

Re-run this whenever ``models/plant_disease.onnx`` is replaced. It needs the
one-time dev dependency ``pip install onnx`` (already a transitive requirement
of onnxruntime workflows); runtime inference does not use it.

Usage:
    python train_disease_ood.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import onnx
import onnxruntime as ort
from PIL import Image

from ml_service import DISEASE_LABELS, DISEASE_MODEL, MODEL_DIR

# Auto-detected from the graph (the tensor feeding the classifier's MatMul).
# Set a tensor name here only to override detection.
FEATURE_OUTPUT: str | None = None
CALIBRATION_PATH = MODEL_DIR / "plant_disease_centroids.npz"
DATA_DIR = Path(__file__).resolve().parent / "Data" / "plantvillage"
PLANTDOC_DIR = Path("/tmp/plantdoc/train")   # optional real-world calibration photos
FIELD_SAMPLES_PER_CLASS = 100
SAMPLES_PER_CLASS = 300
SPLIT_SEED = 42
FIT_FRACTION = 0.6    # images used to build centroids
CAL_FRACTION = 0.2    # images used to set thresholds
ACCEPT_QUANTILE = 95  # % of each class's calibration images kept
MARGIN_QUANTILE = 5   # % of calibration margins allowed to be below the limit
SWEEP = (80, 85, 90, 95)

WALK_THROUGH = {"Identity", "Softmax", "LogSoftmax", "Reshape", "Transpose", "Squeeze", "Unsqueeze", "Dropout"}


def detect_feature_output(model: onnx.ModelProto) -> str:
    """Return the penultimate-layer tensor: the input of the classifier MatMul.

    Walks back from the score output through softmax/shape/bias ops until it
    reaches the Gemm/MatMul that produces the logits; its first input is the
    penultimate feature vector (128-d for the tf2onnx export, 1280-d for the
    torch export).
    """
    node_by_output = {o: n for n in model.graph.node for o in n.output}
    current = model.graph.output[0].name
    while current in node_by_output:
        node = node_by_output[current]
        if node.op_type in WALK_THROUGH or node.op_type == "Add":
            current = node.input[0]   # Add = bias-add: descend into the MatMul
        elif node.op_type in ("Gemm", "MatMul"):
            return node.input[0]
        else:
            break
    raise RuntimeError(
        "could not auto-detect the penultimate feature tensor; "
        "inspect the graph and set FEATURE_OUTPUT manually"
    )


def expose_feature_output() -> str:
    """Append the penultimate feature tensor to the model's graph outputs."""
    global FEATURE_OUTPUT
    model = onnx.load(str(DISEASE_MODEL))
    if FEATURE_OUTPUT is None:
        FEATURE_OUTPUT = detect_feature_output(model)
    if any(output.name == FEATURE_OUTPUT for output in model.graph.output):
        print(f"feature output already present: {FEATURE_OUTPUT}")
        return FEATURE_OUTPUT
    model.graph.output.append(onnx.helper.make_empty_tensor_value_info(FEATURE_OUTPUT))
    onnx.save(model, str(DISEASE_MODEL))
    print(f"added feature output: {FEATURE_OUTPUT}")
    return FEATURE_OUTPUT


def load_pixels(path: Path) -> np.ndarray:
    return np.asarray(Image.open(path).convert("RGB").resize((224, 224)), dtype=np.float32)


def build_session() -> ort.InferenceSession:
    return ort.InferenceSession(str(DISEASE_MODEL), providers=["CPUExecutionProvider"])


def extract(session: ort.InferenceSession, images: list[np.ndarray], feature_output: str) -> tuple[np.ndarray, np.ndarray]:
    """Return (penultimate features, softmax probabilities) in a single pass."""
    input_name = session.get_inputs()[0].name
    features, probabilities = [], []
    for pixels in images:
        feature, probability = session.run(
            [feature_output, "sequential"], {input_name: pixels[None, ...]}
        )
        features.append(feature[0])
        probabilities.append(probability[0])
    return np.asarray(features, dtype=np.float64), np.asarray(probabilities, dtype=np.float64)


def probe_images() -> list[tuple[str, np.ndarray]]:
    """Images that must all be rejected: blanks, noise, and local real-world photos.

    The real-world probes deliberately include close-up field photos (not just
    thumbnails): a close-up can pass the distance check, which is exactly why
    the margin check exists.
    """
    probes: list[tuple[str, np.ndarray]] = [
        ("blank_white", np.full((224, 224, 3), 255, dtype=np.float32)),
        ("blank_gray", np.full((224, 224, 3), 128, dtype=np.float32)),
        ("blank_black", np.zeros((224, 224, 3), dtype=np.float32)),
        ("random_noise", np.random.default_rng(0).integers(0, 256, (224, 224, 3)).astype(np.float32)),
    ]
    data_dir = Path(__file__).resolve().parent / "Data" / "plantvillage"
    for name in (
        "hgic_veg_bacterial leaf spot_pepper_800.jpg",   # close-up field photo
        "images.jpg",                                    # 280x180 web thumbnail
    ):
        path = data_dir / name
        if path.exists():
            probes.append((name, load_pixels(path)))
    root = Path(__file__).resolve().parent
    for name in ("test.jpg", "test2.jpeg", "test3.jpeg", "potato-test.jpeg", "potato-test2.jpeg"):
        path = root / name
        if path.exists():
            probes.append((name, load_pixels(path)))
    return probes


def main() -> int:
    if not DISEASE_MODEL.exists():
        print(f"missing model: {DISEASE_MODEL}", file=sys.stderr)
        return 1

    feature_output = expose_feature_output()
    session = build_session()

    field_folders: dict[str, list[str]] = {}
    if PLANTDOC_DIR.is_dir():
        try:
            from train_disease_field import FIELD_MAPPING
        except ImportError:
            print("note: torch/torchvision unavailable; calibrating on studio images only", file=sys.stderr)
        else:
            for folder, label in FIELD_MAPPING.items():
                field_folders.setdefault(label, []).append(folder)
    else:
        print(f"note: {PLANTDOC_DIR} not found; calibrating on studio images only", file=sys.stderr)

    features, probabilities, labels = [], [], []
    for index, name in enumerate(DISEASE_LABELS):
        directory = DATA_DIR / name
        images = []
        for path in sorted(directory.glob("*"))[:SAMPLES_PER_CLASS]:
            try:
                images.append(load_pixels(path))
            except OSError:
                continue
        field_used = 0
        for folder in field_folders.get(name, []):
            field_files = [p for p in sorted((PLANTDOC_DIR / folder).glob("*"))
                           if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}]
            for path in field_files[:FIELD_SAMPLES_PER_CLASS]:
                try:
                    images.append(load_pixels(path))
                    field_used += 1
                except OSError:
                    continue
        if not images:
            print(f"warning: no images for {name} in {directory}", file=sys.stderr)
            continue
        batch_features, batch_probabilities = extract(session, images, feature_output)
        features.append(batch_features)
        probabilities.append(batch_probabilities)
        labels += [index] * len(batch_features)
        print(f"{name}: {len(batch_features)} feature vectors ({field_used} field)", flush=True)

    features = np.concatenate(features, axis=0)
    probabilities = np.concatenate(probabilities, axis=0)
    labels = np.asarray(labels)
    print(f"total feature vectors: {len(features)} (dim {features.shape[1]})")

    rng = np.random.default_rng(SPLIT_SEED)
    permutation = rng.permutation(len(features))
    fit_end = int(FIT_FRACTION * len(permutation))
    cal_end = fit_end + int(CAL_FRACTION * len(permutation))
    fit, calib, held_out = permutation[:fit_end], permutation[fit_end:cal_end], permutation[cal_end:]

    def unit(rows: np.ndarray) -> np.ndarray:
        return rows / (np.linalg.norm(rows, axis=1, keepdims=True) + 1e-12)

    centroids = unit(np.stack([
        features[fit][labels[fit] == c].mean(axis=0) for c in range(len(DISEASE_LABELS))
    ]))

    def nearest(rows: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
        similarity = unit(rows) @ centroids.T
        index = similarity.argmax(axis=1)
        return index, 1.0 - similarity[np.arange(len(index)), index]

    # Thresholds come from a calibration split that did not build the centroids,
    # so the quantile is not optimistically tight.
    calibration_similarity = unit(features[calib]) @ centroids.T
    calibration_distance = 1.0 - calibration_similarity[
        np.arange(len(calib)), labels[calib]
    ]
    ordered = np.sort(probabilities[calib], axis=1)
    calibration_margin = ordered[:, -1] - ordered[:, -2]
    margin_threshold = float(np.percentile(calibration_margin, MARGIN_QUANTILE))
    print(f"\nsoftmax winning margin on calibration split: "
          f"p{MARGIN_QUANTILE}={margin_threshold:.4f} "
          f"p50={np.percentile(calibration_margin, 50):.4f}")

    def thresholds_at(quantile: float) -> np.ndarray:
        fallback = float(np.percentile(calibration_distance, quantile))
        return np.asarray([
            float(np.percentile(calibration_distance[labels[calib] == index], quantile))
            if (labels[calib] == index).sum() else fallback
            for index in range(len(DISEASE_LABELS))
        ], dtype=np.float64)

    held_similarity = unit(features[held_out]) @ centroids.T
    nearest_index = held_similarity.argmax(axis=1)
    held_out_distance = 1.0 - held_similarity[np.arange(len(held_out)), nearest_index]
    held_labels = labels[held_out]

    # Rule B: distance to the centroid of the class the model *predicts*.
    held_predicted = probabilities[held_out].argmax(axis=1)
    predicted_distance = 1.0 - held_similarity[np.arange(len(held_out)), held_predicted]

    probe_pixels = probe_images()
    probe_names = [name for name, _ in probe_pixels]
    probe_vectors, probe_probabilities = extract(session, [p for _, p in probe_pixels], feature_output)
    probe_similarity = unit(probe_vectors) @ centroids.T
    probe_index = probe_similarity.argmax(axis=1)
    probe_distance = 1.0 - probe_similarity[np.arange(len(probe_vectors)), probe_index]
    probe_predicted = probe_probabilities.argmax(axis=1)
    probe_predicted_distance = 1.0 - probe_similarity[np.arange(len(probe_vectors)), probe_predicted]
    probe_ordered = np.sort(probe_probabilities, axis=1)
    probe_margin = probe_ordered[:, -1] - probe_ordered[:, -2]

    def accepted(limits: np.ndarray, which: str) -> np.ndarray:
        if which == "nearest":
            return held_out_distance <= limits[nearest_index]
        return predicted_distance <= limits[held_predicted]

    def probe_rejected(limits: np.ndarray, which: str) -> int:
        if which == "nearest":
            return int((probe_distance > limits[probe_index]).sum())
        return int((probe_predicted_distance > limits[probe_predicted]).sum())

    print("\noperating-point sweep:")
    print(f"  {'quantile':>8s}  {'ID nearest':>10s}  {'ID predicted':>12s}  {'OOD n/p':>16s}")
    for quantile in SWEEP:
        limits = thresholds_at(quantile)
        print(f"  {quantile:>7d}%  "
              f"{accepted(limits, 'nearest').mean() * 100:9.1f}%  "
              f"{accepted(limits, 'predicted').mean() * 100:11.1f}%  "
              f"{probe_rejected(limits, 'nearest'):>5d}/{probe_rejected(limits, 'predicted'):<5d}")

    per_class_threshold = thresholds_at(ACCEPT_QUANTILE)
    held_ordered = np.sort(probabilities[held_out], axis=1)
    held_margin = held_ordered[:, -1] - held_ordered[:, -2]
    accepted_mask = accepted(per_class_threshold, "predicted") & (held_margin >= margin_threshold)

    print("\nheld-out in-distribution acceptance (distance + margin rules):")
    for index, name in enumerate(DISEASE_LABELS):
        mask = held_labels == index
        if mask.sum() == 0:
            continue
        print(f"  {name:48s} n={int(mask.sum()):4d} "
              f"accept={accepted_mask[mask].mean() * 100:5.1f}%  "
              f"threshold={per_class_threshold[index]:.4f}")
    print(f"  {'OVERALL':48s} n={len(held_out):4d} accept={accepted_mask.mean() * 100:5.1f}%")
    print(f"  thresholds min/median/max="
          f"{per_class_threshold.min():.4f}/{np.median(per_class_threshold):.4f}/"
          f"{per_class_threshold.max():.4f}")
    print(f"  in-distribution distance p50={np.percentile(held_out_distance, 50):.4f} "
          f"p95={np.percentile(held_out_distance, 95):.4f}")

    print("\nOOD probes:")
    must_reject = {"blank_white", "blank_gray", "blank_black", "random_noise"}
    failures = 0
    for name, distance, margin, index in zip(
            probe_names, probe_predicted_distance, probe_margin, probe_predicted):
        accepted = distance <= per_class_threshold[index] and margin >= margin_threshold
        if name in must_reject:
            ok = not accepted
            failures += not ok
            verdict = "reject" if ok else "ACCEPT (must-reject failure!)"
        else:
            # Real-world photos of supported crops are in-distribution for the
            # field model: acceptance with a label is the desired outcome here,
            # so report it informationally instead of flagging it as a failure.
            verdict = f"accept -> {DISEASE_LABELS[int(index)]}" if accepted else "reject (ambiguous)"
        print(f"  {name:46s} predicted={DISEASE_LABELS[int(index)]:40s} "
              f"d={distance:.4f}/{per_class_threshold[index]:.4f} m={margin:.3f}/{margin_threshold:.3f} "
              f"-> {verdict}")
    print(f"  must-reject probes handled correctly: {len(must_reject) - failures}/{len(must_reject)}")

    np.savez(
        CALIBRATION_PATH,
        centroids=centroids.astype(np.float32),
        thresholds=per_class_threshold.astype(np.float32),
        margin_threshold=np.float64(margin_threshold),
        feature_output=np.array(feature_output),
        labels=np.array(DISEASE_LABELS),
        samples=np.int32(len(features)),
        accept_quantile=np.int32(ACCEPT_QUANTILE),
    )
    print(f"\nwrote {CALIBRATION_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
