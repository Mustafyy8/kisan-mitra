# Local model provenance

## Plant disease classification

`models/plant_disease.onnx` is an EfficientNetV2B0 classifier over the 15
pepper/potato/tomato classes of PlantVillage, **fine-tuned on real-world field
photos** (see "Measured real-world accuracy" below). Provenance:

- Base weights and label order: the 15-class PlantVillage EfficientNetV2 model
  from [AyseSude/plantvillage-efficientnetv2](https://huggingface.co/AyseSude/plantvillage-efficientnetv2),
  downloaded 2026-09-09 (97% reported validation accuracy on PlantVillage).
- Field fine-tune: `train_disease_field.py` (EfficientNetV2B0, ImageNet
  init) trained on PlantVillage + [PlantDoc](https://github.com/pratikkayal/PlantDoc-Dataset)
  (CC-BY 4.0, ~1,000 real photos mapped to 15 labels) with domain-bridging
  augmentation; exported 2026-09-11 as a 16 MB ONNX that takes raw 0-255 NHWC
  RGB with ImageNet normalisation and softmax baked into the graph. The
  original PlantVillage-only export remains in git history.

The label order in `ml_service.py` matches the class-directory ordering of the
PlantVillage subset and was used consistently through fine-tuning. Measured
accuracy: **94.3% on held-out studio (PlantVillage-style) images** and
**65.7% top-1 on real field photos** (PlantDoc test split), versus 23.5% for
the PlantVillage-only model on the same field benchmark.

### Out-of-distribution (OOD) rejection

The model is a closed-set classifier: it always emits a full softmax over its
15 classes, so it used to report a confident tomato disease for any input. Two
measured examples on the unmodified model: a blank white 224 x 224 image was
labelled `Tomato_Late_blight` at 99.0% confidence, and a real-world leaf photo
scored 85.7% on a tomato class. Dataset composition explains the direction of
the failures: 16,012 of the 20,639 local PlantVillage images (77.6%) are tomato.

`train_disease_ood.py` builds `models/plant_disease_centroids.npz` (12 KB),
which `MLService.diagnose` uses to reject inputs the model was not trained on:

1. A size floor: icon-sized uploads (smallest dimension < 64 px) are refused
   (HTTP 422) -- measured: a 32 x 32 downscale of a known leaf scored 99.97%
   for the wrong class because the upscale creates a smooth blob that slips
   past the other checks. Small but genuine photos (down to ~64 px) still
   diagnose correctly, so the floor blocks only icons, not small photos;
   image quality beyond that is left to the content checks below.
2. A blank/near-uniform content check (`pixels.std() < 8`).
3. A feature-space check: the image must fall inside the distance envelope of
   the class the model actually predicts, measured on the penultimate layer
   (auto-detected as the tensor feeding the classifier MatMul; 1280-d for the
   promoted torch export). Softmax confidence alone cannot do this -- random
   non-plant photos scored between 42% and 100% -- but penultimate-feature
   distance separates most probes.
4. A softmax winning-margin check: a photo can sit inside a class envelope yet
   be ambiguous. The gate also requires top1 - top2 >= the calibrated margin
   (5th percentile of the calibration split).

Calibration provenance: per class, up to 300 studio images from
`Data/plantvillage` plus up to 100 real field photos from
`/tmp/plantdoc/train` (the same mapping the field model was fine-tuned with;
without PlantDoc the script falls back to studio-only envelopes, which reject
every real photo). Split 60% to build class centroids / 20% to set thresholds
(per-class distance at the 95th percentile; margin at the 5th percentile) /
20% held out for evaluation (`numpy.random.default_rng(42)`).
Measured results: **91.4% of held-out in-distribution images pass both
checks**, blanks (white/gray/black) and deterministic noise are always
rejected, and real supported-crop photos are accepted with a diagnosis
(PlantDoc test: 68% accepted, 72% of those correct). Cosine distance beat a
Mahalanobis distance (0.993 vs 0.988 AUC in testing), so the artefact stores
class centroids plus per-class thresholds rather than a covariance matrix.
`MLService` still works without the calibration file, but it then loses the
feature-space and calibrated-margin checks (the size, blank, and
fallback-margin checks remain), so `/api/health` reports an `ood` flag for the
disease model.

To keep the model weights verifiable, the ONNX file itself is only modified by
appending that one extra graph output; every weight tensor is unchanged.
Regenerating the calibration requires the one-time dev dependency
`pip install onnx`; runtime inference still uses only `onnxruntime`.

### Measured real-world accuracy

The original PlantVillage-only model was at **23.5% top-1 (24/102)** on field
photos from the [PlantDoc dataset](https://github.com/pratikkayal/PlantDoc-Dataset)
-- above the 6.7% chance level but wrong ~3 times out of 4, confidently. That
is the documented PlantVillage-to-field domain gap and the reason the OOD gate
and the field fine-tune exist. The promoted field-fine-tuned model on the same
102-image PlantDoc test split, measured end-to-end through `MLService.diagnose`
(gate included):

| Metric | PlantVillage-only (previous) | Field-fine-tuned (promoted) |
| --- | --- | --- |
| Raw top-1 accuracy (gate ignored) | 24/102 = 23.5% | 67/102 = 65.7% |
| Scans accepted by the gate | 19/102 = 18.6% | 69/102 = 68% |
| Correct among accepted | 7/19 = 36.8% | 50/69 = 72% |
| End-to-end: correct diagnoses / all field photos | 7/102 = 6.9% | 50/102 = 49% |
| Studio (PlantVillage-style) accuracy | 97.3% | 94.3% |

The fine-tune triples field accuracy at a ~3-point studio cost. Roughly a
third of real photos are still honestly flagged "Not recognized" rather than
guessed at, and PlantDoc's own labels are noisy, so treat the exact figures as
approximate. Remaining real-world errors are dominated by Early/Late blight
and leaf-spot confusions that look alike; adding more field photos from the
actual farm being served is the next lever.

**No PlantVillage-trained model is a drop-in fix for this.** Any model in the
table below was trained on the same dataset family and inherits the same gap.
Improving real-world accuracy requires training or fine-tuning on field
imagery, ideally combined with local photos from the farm being served.

### Choosing a different disease model

The 15-class model above covers pepper, potato, and tomato only. These are the
options that were verified from their current model cards; none was substituted
into this repository, because each changes crop coverage and needs the
calibration and label list rebuilt.

| Model | Classes | Size / input | Format | License | Trade-off |
| --- | --- | --- | --- | --- | --- |
| Current: field-fine-tuned EfficientNetV2B0 (base: [`AyseSude/plantvillage-efficientnetv2`](https://huggingface.co/AyseSude/plantvillage-efficientnetv2)) | 15 (pepper, potato, tomato) | ~16 MB, 224 x 224 | ONNX (in repo) | see model cards | Field-robust (65.7% on PlantDoc vs 23.5% for the studio-only base); 94.3% studio accuracy; PlantDoc is CC-BY 4.0 |
| [`wambugu71/crop_leaf_diseases_vit`](https://huggingface.co/wambugu71/crop_leaf_diseases_vit) | 14 (corn, potato, rice, wheat) | 5.5 M params, 224 x 224 | ONNX f32 + safetensors | Apache-2.0 | Smallest and fastest; **no tomato or pepper**; trained partly on uncontrolled/field images |
| [`Daksh159/plant-disease-mobilenetv2`](https://huggingface.co/Daksh159/plant-disease-mobilenetv2) | 38 (adds apple, corn, grape, citrus, ...) | MobileNetV2, 224 x 224 | PyTorch `.pth` only | not stated | Superset crop coverage but still PlantVillage studio images; needs an ONNX export |
| [`prof-freakenstein/plantnet-disease-detection`](https://huggingface.co/prof-freakenstein/plantnet-disease-detection) | 38 | 236 M params, 384 x 384 | ONNX / PyTorch | gated access | Highest reported accuracy, but far too heavy for a Raspberry Pi 4 and requires accepting access conditions |

All of these share the same fundamental limitation: they are closed-set
classifiers trained on a fixed crop list, so they still need the OOD gate and
still cannot be trusted on crops outside their classes. For genuinely robust
field photos, the durable fix is fine-tuning on field imagery (for example the
[PlantDoc dataset](https://github.com/pratikkayal/PlantDoc-Dataset), 2,598
real-world images across 13 species) rather than swapping in another
PlantVillage-trained model.

**Swap procedure** (do all four steps, then run the test suite):

1. Place the new ONNX file at `models/plant_disease.onnx`.
2. Update `DISEASE_LABELS` in `ml_service.py` to the new class order and
   confirm it against the source dataset directory order.
3. Update `FEATURE_OUTPUT` in `train_disease_ood.py` to the new model's
   penultimate tensor name (inspect it with `onnx.load(...).graph`), and update
   the preprocessing in `MLService.diagnose` if the new model expects
   ImageNet-normalised input instead of raw 0-255 pixels.
4. Re-run `python train_disease_ood.py` to rebuild centroids and thresholds,
   and check that held-out acceptance is still near 95% and OOD probes are
   rejected before shipping.

## Crop recommendation

`Data/crop_recommendation.csv` comes from the MIT-licensed
[PAIshanMadusha/crop-recommendation-model](https://github.com/PAIshanMadusha/crop-recommendation-model)
dataset. `train_crop_model.py` trains the checked-in Random Forest locally from
that dataset and writes `models/crop_recommendation.joblib`. The current model
was trained with a fixed split (`random_state=42`, stratified 80/20); it reached
99.32% held-out accuracy. It should be treated as a decision-support signal,
not a replacement for local agronomy advice.

## Soil fertility classification

`Data/soil_fertility.csv` was downloaded from the public
[AgriWiseGP/ML---Soil-Quality](https://github.com/AgriWiseGP/ML---Soil-Quality)
repository on 2026-09-09. The source repository describes fertility classes and
the N, P, K, pH, EC, and organic-carbon inputs but does not state a software or
data license; it is retained for development/evaluation only. Replace it with
authorized, locally representative soil-laboratory data before distributing or
making operational fertilizer decisions.

`train_soil_model.py` trains the 400-tree Random Forest from six inputs and
writes `models/soil_fertility.joblib`. The fixed stratified 80/20 split with
`random_state=42` achieved 94.19% held-out accuracy. This score does not prove
performance for a new farm, sensor calibration, or regional soil chemistry.
