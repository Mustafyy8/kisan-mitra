"""Local, offline machine-learning inference for KISAN MITRA."""
from __future__ import annotations

import time
from io import BytesIO
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import onnxruntime as ort
from PIL import Image, UnidentifiedImageError

ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / "models"
DISEASE_MODEL = MODEL_DIR / "plant_disease.onnx"
CROP_MODEL = MODEL_DIR / "crop_recommendation.joblib"
SOIL_MODEL = MODEL_DIR / "soil_fertility.joblib"

# Verified against the class-directory ordering of the PlantVillage subset used
# by the downloaded 15-class EfficientNetV2 ONNX model.
DISEASE_LABELS = [
    "Pepper__bell___Bacterial_spot", "Pepper__bell___healthy", "Potato___Early_blight",
    "Potato___Late_blight", "Potato___healthy", "Tomato_Bacterial_spot",
    "Tomato_Early_blight", "Tomato_Late_blight", "Tomato_Leaf_Mold",
    "Tomato_Septoria_leaf_spot", "Tomato_Spider_mites_Two_spotted_spider_mite",
    "Tomato__Target_Spot", "Tomato__Tomato_YellowLeaf__Curl_Virus",
    "Tomato__Tomato_mosaic_virus", "Tomato_healthy",
]

TREATMENTS = {
    "Bacterial_spot": "Remove affected leaves, avoid overhead watering, and consult local guidance on copper treatment.",
    "Early_blight": "Remove lower infected leaves, improve airflow, and follow local fungicide guidance.",
    "Late_blight": "Isolate affected plants and consult local extension guidance promptly; late blight spreads quickly.",
    "Leaf_Mold": "Improve ventilation, reduce leaf wetness, and remove heavily infected material.",
    "Septoria_leaf_spot": "Remove infected leaves, keep foliage dry, and clean tools between plants.",
    "Spider_mites": "Inspect leaf undersides, isolate hotspots, and follow local integrated pest-management advice.",
    "Target_Spot": "Remove infected leaves and improve spacing and airflow before applying any treatment.",
    "YellowLeaf__Curl_Virus": "Remove severely affected plants and manage whiteflies with local agricultural guidance.",
    "mosaic_virus": "Remove infected plants, disinfect tools, and avoid handling tobacco before touching crops.",
}


class MLService:
    def __init__(self) -> None:
        self._disease_session: ort.InferenceSession | None = None
        self._crop_model: Any = None
        self._soil_model: Any = None

    def disease_ready(self) -> bool:
        return DISEASE_MODEL.exists()

    def crop_ready(self) -> bool:
        return CROP_MODEL.exists()

    def soil_ready(self) -> bool:
        return SOIL_MODEL.exists()

    def model_status(self) -> dict[str, dict[str, Any]]:
        """Report whether each model artefact is present, for the health endpoint."""
        return {
            "disease": {"ready": self.disease_ready(), "file": DISEASE_MODEL.name},
            "crop": {"ready": self.crop_ready(), "file": CROP_MODEL.name},
            "soil": {"ready": self.soil_ready(), "file": SOIL_MODEL.name},
        }

    def _disease(self) -> ort.InferenceSession:
        if self._disease_session is None:
            self._disease_session = ort.InferenceSession(str(DISEASE_MODEL), providers=["CPUExecutionProvider"])
        return self._disease_session

    def _crop(self) -> Any:
        if self._crop_model is None:
            self._crop_model = joblib.load(CROP_MODEL)
        return self._crop_model

    def _soil(self) -> Any:
        if self._soil_model is None:
            self._soil_model = joblib.load(SOIL_MODEL)
        return self._soil_model

    def diagnose(self, image_bytes: bytes) -> dict[str, Any]:
        if not self.disease_ready():
            raise RuntimeError("Disease model is not installed")
        try:
            image = Image.open(BytesIO(image_bytes)).convert("RGB").resize((224, 224))
        except (UnidentifiedImageError, OSError) as error:
            raise ValueError("Upload a valid JPG, PNG, or WEBP leaf image") from error
        pixels = np.asarray(image, dtype=np.float32)[None, ...]  # Model expects 0-255 RGB pixels.
        session = self._disease()
        start = time.perf_counter()
        scores = session.run(None, {session.get_inputs()[0].name: pixels})[0][0]
        inference_ms = round((time.perf_counter() - start) * 1000, 1)
        index = int(np.argmax(scores))
        label = DISEASE_LABELS[index]
        confidence = float(scores[index])
        healthy = "healthy" in label.lower()
        disease = label.replace("___", " - ").replace("__", " ").replace("_", " ")
        treatment = "No disease detected. Continue routine scouting and use clean tools." if healthy else next(
            (advice for fragment, advice in TREATMENTS.items() if fragment.lower() in label.lower()),
            "Isolate the affected plant and consult a local agricultural extension officer for treatment advice.",
        )
        top = np.argsort(scores)[-3:][::-1]
        return {
            "label": label, "disease": disease,
            "healthy": healthy, "confidence": round(confidence * 100, 2),
            "treatment": treatment, "inference_ms": inference_ms,
            "top_predictions": [{"label": DISEASE_LABELS[int(i)], "confidence": round(float(scores[int(i)]) * 100, 2)} for i in top],
        }

    def recommend_crops(self, features: dict[str, float]) -> list[dict[str, Any]]:
        if not self.crop_ready():
            return []
        model = self._crop()
        vector = np.array([[features[key] for key in ("n", "p", "k", "temperature", "humidity", "ph", "rainfall")]], dtype=float)
        probabilities = model.predict_proba(vector)[0]
        top = np.argsort(probabilities)[-3:][::-1]
        return [{"crop": str(model.classes_[int(i)]).title(), "confidence": round(float(probabilities[int(i)]) * 100, 1)} for i in top]

    def assess_soil_fertility(self, features: dict[str, float]) -> dict[str, Any]:
        """Classify fertility from the six sensor/lab measurements the app collects."""
        if not self.soil_ready():
            return {"status": "unavailable", "fertility": None, "confidence": None}
        model = self._soil()
        vector = np.array([[features[key] for key in ("n", "p", "k", "ph", "ec", "organic_carbon")]], dtype=float)
        probabilities = model.predict_proba(vector)[0]
        index = int(np.argmax(probabilities))
        labels = {0: "Less fertile", 1: "Fertile", 2: "Highly fertile"}
        label = int(model.classes_[index])
        return {"status": "ready", "fertility": labels[label], "confidence": round(float(probabilities[index]) * 100, 1)}
