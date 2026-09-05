import streamlit as st
import cv2
from PIL import Image
import tempfile
from roboflow import Roboflow
import os

# =====================================
# CONFIG
# =====================================
st.set_page_config(
    page_title="KISAN MITRA – AI Agriculture Assistant",
    page_icon="🌾",
    layout="centered"
)

ROBOFLOW_PROJECT = "my-first-project-gtp5u"
ROBOFLOW_VERSION = 4

@st.cache_resource
def load_model():
    rf = Roboflow(api_key="nJbPHIcnzVTPpjepcsVF")
    project = rf.workspace().project(ROBOFLOW_PROJECT)
    return project.version(ROBOFLOW_VERSION).model

model = load_model()

# =====================================
# SESSION STATE
# =====================================
if "camera_active" not in st.session_state:
    st.session_state.camera_active = False

if "capture_clicked" not in st.session_state:
    st.session_state.capture_clicked = False

if "result" not in st.session_state:
    st.session_state.result = None

# =====================================
# CREATE FOLDER
# =====================================
if not os.path.exists("captured"):
    os.makedirs("captured")

# =====================================
# CAMERA FUNCTION
# =====================================
def run_camera():

    cap = cv2.VideoCapture(0)
    frame_slot = st.empty()

    st.session_state.camera_active = True

    while st.session_state.camera_active:

        ret, frame = cap.read()
        if not ret:
            st.error("Camera error")
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_slot.image(frame_rgb, channels="RGB")

        # Capture triggered
        if st.session_state.capture_clicked:

            st.session_state.camera_active = False
            st.session_state.capture_clicked = False

            # Convert + resize
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frame_resized = cv2.resize(frame_rgb, (640, 640))

            # Save image
            save_path = os.path.join("captured", "capture.jpg")
            cv2.imwrite(save_path, cv2.cvtColor(frame_resized, cv2.COLOR_RGB2BGR))

            # Load image again
            image = Image.open(save_path)

            # Convert to RGB and flip vertically
            image = image.convert("RGB")
            # image = image.transpose(Image.FLIP_LEFT_RIGHT)

            # Display image
            st.image(image, caption="Captured Image",)

            # Model prediction
            result = model.predict(save_path).json()

            if "predictions" not in result or len(result["predictions"]) == 0:
                st.session_state.result = "❌ No disease detected"
            else:
                pred = result["predictions"][0]
                st.session_state.result = f"🦠 {pred['top']} ({pred['confidence']:.2%})"

            break

    cap.release()

# =====================================
# TITLE
# =====================================
st.title("🌾 KISAN MITRA – AI Agriculture Assistant")

tab1, tab2, tab3 = st.tabs([
    "🌱 Crop Recommendation",
    "🌿 Disease Detection",
    "🧪 Soil Analysis"
])

# =====================================
# 🌿 DISEASE TAB
# =====================================
with tab2:

    st.subheader("Choose Input Method")

    option = st.radio(
        "Select:",
        ["📁 Upload Image", "📹 Live Camera"]
    )

    # UPLOAD OPTION
    if option == "📁 Upload Image":

        file = st.file_uploader("Upload leaf image", type=["jpg","png"])

        if file:
            img = Image.open(file)
            st.image(img)

            if st.button("🦠 Detect Disease"):
                with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                    img.save(tmp.name)

                result = model.predict(tmp.name).json()

                if len(result["predictions"]) == 0:
                    st.error("❌ No disease detected")
                else:
                    pred = result["predictions"][0]
                    st.success(f"🦠 {pred['top']}")
                    st.write(f"Confidence: {pred['confidence']:.2%}")

    # CAMERA OPTION
    else:

        col1, col2 = st.columns(2)

        with col1:
            if st.button("▶ Start Camera"):
                st.session_state.camera_active = True
                st.session_state.capture_clicked = False
                st.rerun()

        with col2:
            if st.session_state.camera_active:
                if st.button("📸 Capture"):
                    st.session_state.capture_clicked = True
            else:
                st.button("📸 Capture", disabled=True)

        if st.session_state.camera_active:
            run_camera()

        if st.session_state.result:
            st.success(st.session_state.result)

# =====================================
# OTHER TABS
# =====================================
with tab1:
    st.warning("⚠️ Crop model not loaded yet")

with tab3:
    st.warning("⚠️ Soil model not loaded yet")