import streamlit as st
from roboflow import Roboflow
import tempfile
from PIL import Image

# -------------------------------
# CONFIG
# -------------------------------
API_KEY = "nJbPHIcnzVTPpjepcsVF"
PROJECT_NAME = "my-first-project-gtp5u"
MODEL_VERSION = 3

# -------------------------------
# PAGE SETUP
# -------------------------------
st.set_page_config(
    page_title="Plant Disease Detection",
    page_icon="🌱",
    layout="wide"

    
)

st.title("🌱 Plant Disease Detection using AI")
st.write("Upload a plant leaf image to detect the disease using a Roboflow model.")

# -------------------------------
# LOAD ROBOFLOW MODEL
# -------------------------------
@st.cache_resource
def load_model():
    rf = Roboflow(api_key=API_KEY)
    project = rf.workspace().project(PROJECT_NAME)
    model = project.version(MODEL_VERSION).model
    return model

model = load_model()

# -------------------------------
# IMAGE UPLOAD
# -------------------------------
uploaded_file = st.file_uploader(
    "Upload an image",
    type=["jpg", "jpeg", "png"]
)

if uploaded_file is not None:
    # Display image
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", width=200)

    # Save image temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
        image.save(tmp.name)
        temp_image_path = tmp.name

    # Predict button
    if st.button("🔍 Predict Disease"):
        with st.spinner("Running inference..."):
            result = model.predict(temp_image_path).json()

        # -------------------------------
        # DISPLAY RESULTS
        # -------------------------------
        if "predictions" in result and len(result["predictions"]) > 0:
            prediction = result["predictions"][0]

            top_class = prediction["top"]
            confidence = prediction["confidence"]

            st.success("✅ Prediction Complete")
            st.markdown(f"### 🦠 **Predicted Class:** `{top_class}`")
            st.markdown(f"### 📊 **Confidence:** `{confidence:.2f}`")

            # Optional debug output
            with st.expander("🔧 Show Full JSON Output"):
                st.json(result)

        else:
            st.error("No predictions found. Try another image.")
