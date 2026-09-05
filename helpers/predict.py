import numpy as np
from helpers.preprocess import preprocess_image

def predict_crop(model, values):
    values = np.array([values])
    return model.predict(values)[0]

def predict_soil(model, scaler, values):
    values = scaler.transform([values])
    return model.predict(values)[0]

def predict_disease(model, img):
    processed = preprocess_image(img)
    pred = model.predict(processed)
    return pred.argmax()
