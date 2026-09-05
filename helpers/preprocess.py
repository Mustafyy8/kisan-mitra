import numpy as np
from PIL import Image

def preprocess_image(img):
    img = img.resize((224, 224))
    img = np.array(img) / 255.0
    return np.expand_dims(img, axis=0)
