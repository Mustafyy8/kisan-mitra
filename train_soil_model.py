import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib

df = pd.read_csv("data/soil_properties.csv")

X = df.drop("soil_type", axis=1)
y = df["soil_type"]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2)

model = SVC(kernel='rbf')
model.fit(X_train, y_train)

joblib.dump(model, "models/soil_model.pkl")
joblib.dump(scaler, "models/scaler.pkl")

print("Soil model and scaler saved!")
