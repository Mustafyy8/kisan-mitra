"""Train the local crop recommender from the checked-in crop dataset."""
from pathlib import Path
import csv

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parent
features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
with (ROOT / "Data" / "crop_recommendation.csv").open(newline="") as stream:
    rows = list(csv.DictReader(stream))
x = np.array([[float(row[key]) for key in features] for row in rows], dtype=float)
y = np.array([row["label"] for row in rows])
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42, stratify=y)
model = RandomForestClassifier(n_estimators=400, min_samples_leaf=1, random_state=42, n_jobs=-1, class_weight="balanced")
model.fit(x_train, y_train)
score = model.score(x_test, y_test)
(ROOT / "models").mkdir(exist_ok=True)
joblib.dump(model, ROOT / "models" / "crop_recommendation.joblib")
print(f"Saved crop model. Held-out accuracy: {score:.2%}")
