import joblib
import tensorflow as tf

def load_crop_model():
    return joblib.load("models/crop_model.pkl")

def load_soil_model():
    return joblib.load("models/soil_model.pkl")

def load_scaler():
    return joblib.load("models/scaler.pkl")

def load_disease_model():
    return tf.keras.models.load_model("models/plant_disease_model.h5")
