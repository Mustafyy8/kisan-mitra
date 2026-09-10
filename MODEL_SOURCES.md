# Local model provenance

## Plant disease classification

`models/plant_disease.onnx` is the 15-class PlantVillage EfficientNetV2 model
from [AyseSude/plantvillage-efficientnetv2](https://huggingface.co/AyseSude/plantvillage-efficientnetv2), downloaded on 2026-09-09. It uses 224 x 224 RGB
images and runs through ONNX Runtime entirely on-device. The model's documented
training split is PlantVillage 70/15/15, with reported 97% validation accuracy.
The label order in `ml_service.py` was validated against every one of this
repository's matching PlantVillage class directories before use.

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
