import streamlit as st
from PIL import Image
import tempfile
from roboflow import Roboflow

from helpers.model_loader import *
from helpers.predict import *

# =====================================
# STREAMLIT PAGE CONFIG
# =====================================
st.set_page_config(
    page_title="KISAN MITRA – AI Agriculture Assistant",
    page_icon="🌾",
    layout="centered"
)

# =====================================
# ROBOFLOW CONFIG (LOCAL TESTING)
# =====================================
ROBOFLOW_PROJECT = "my-first-project-gtp5u"
ROBOFLOW_VERSION = 4

@st.cache_resource
def load_roboflow_model():
    rf = Roboflow(api_key="nJbPHIcnzVTPpjepcsVF")  # local testing only
    project = rf.workspace().project(ROBOFLOW_PROJECT)
    model = project.version(ROBOFLOW_VERSION).model
    return model

# =====================================
# APP TITLE
# =====================================
st.title("🌾 KISAN MITRA – AI Agriculture Assistant")

st.write("")

# =====================================
# 🌱 CROP RECOMMENDATION
# =====================================
st.header("🌱 Crop Recommendation")

crop_model = load_crop_model()

N = st.number_input("Nitrogen (N)", 0, 200)
P = st.number_input("Phosphorus (P)", 0, 200)
K = st.number_input("Potassium (K)", 0, 200)
temp = st.number_input("Temperature (°C)", 0, 50)
humidity = st.number_input("Humidity (%)", 0, 100)
ph = st.number_input("Soil pH", 0.0, 14.0)
rainfall = st.number_input("Rainfall (mm)", 0.0, 500.0)

if st.button("Predict Crop"):
    values = [N, P, K, temp, humidity, ph, rainfall]
    result = predict_crop(crop_model, values)
    st.success(f"🌾 Recommended Crop: **{result}**")

st.markdown("---")

# =====================================
# 🌿 DISEASE DETECTION
# =====================================
st.header("🌿 Disease Detection")

model = load_roboflow_model()

uploaded_file = st.file_uploader(
    "Upload a leaf image",
    type=["jpg", "jpeg", "png"]
)

if uploaded_file:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Leaf Image", use_column_width=True)

    if st.button("Detect Disease"):
        with st.spinner("Analyzing leaf image... 🌱"):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                image.save(tmp.name)
                image_path = tmp.name

            result = model.predict(image_path).json()
            prediction = result["predictions"][0]

            top_class = prediction["top"]
            confidence = prediction["confidence"]

        st.success("✅ Disease Detection Complete")
        st.write(f"🦠 Disease: **{top_class}**")
        st.write(f"📊 Confidence: **{confidence:.2%}**")

st.markdown("---")

# =====================================
# 🧪 SOIL ANALYSIS
# =====================================
st.header("🧪 Soil Type Prediction")

soil_model = load_soil_model()
scaler = load_scaler()

pH = st.number_input("Soil pH", 0.0, 14.0)
EC = st.number_input("Electrical Conductivity (EC)", 0.0, 10.0)
OC = st.number_input("Organic Carbon (OC)", 0.0, 3.0)
N_soil = st.number_input("Nitrogen (N)", 0, 200)
P_soil = st.number_input("Phosphorus (P)", 0, 200)
K_soil = st.number_input("Potassium (K)", 0, 200)

if st.button("Predict Soil Type"):
    values = [pH, EC, OC, N_soil, P_soil, K_soil]
    result = predict_soil(soil_model, scaler, values)
    st.success(f"🧪 Soil Type: **{result}**")
