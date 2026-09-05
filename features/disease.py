import streamlit as st
import cv2
from PIL import Image
import tempfile
import os
import datetime
from components.ui import metric_card, alert_banner, badge

DISEASE_CURES = {
    "Pepper__bell__Bacterial_spot": "Use copper-based bactericides. Remove infected leaves.",
    "Potato__Early_blight": "Apply fungicides like mancozeb. Maintain crop rotation.",
    "Potato__Late_blight": "Use fungicides like chlorothalonil. Avoid excess moisture.",
    "Tomato__Target_Spot": "Apply fungicides and remove affected leaves. Improve air circulation.",
    "Tomato__Tomato_mosaic_virus": "Remove infected plants immediately. Use virus-resistant seeds.",
    "Tomato__Tomato_YellowLeaf__Curl_Virus": "Control whiteflies using insecticides.",
    "Tomato_Bacterial_spot": "Use copper sprays. Avoid wetting leaves and practice crop rotation.",
    "Tomato_Early_blight": "Apply fungicides and remove infected leaves. Ensure proper spacing.",
    "Tomato_Late_blight": "Use preventive fungicides. Avoid high humidity conditions.",
    "Tomato_Leaf_Mold": "Improve ventilation and apply fungicides.",
    "Tomato_Septoria_leaf_spot": "Remove infected leaves and apply fungicides like chlorothalonil.",
    "Tomato_Spider_mites_Two_spotted_spider_mite": "Use neem oil or miticides. Wash plants."
}

def analyze_prediction(pred_data):
    disease = pred_data["top"]
    confidence = pred_data["confidence"]
    
    if "healthy" in disease.lower():
        return {
            "status": "Healthy",
            "severity": "None",
            "confidence": confidence,
            "disease": "Healthy Plant",
            "action": "Maintain current care routines.",
            "cure": "N/A"
        }
    
    severity = "Severe" if confidence > 0.8 else "Moderate" if confidence > 0.5 else "Mild"
    
    return {
        "status": "Infected",
        "disease": disease.replace("_", " ").title(),
        "severity": severity,
        "confidence": confidence,
        "cure": DISEASE_CURES.get(disease, "Consult local agricultural extension for treatment."),
    }

def add_to_history(analysis):
    if "prediction_history" not in st.session_state:
        st.session_state.prediction_history = []
    
    entry = {
        "time": datetime.datetime.now().strftime("%I:%M %p"),
        "disease": analysis.get("disease", "Healthy"),
        "status": analysis["status"]
    }
    st.session_state.prediction_history.insert(0, entry)
    if len(st.session_state.prediction_history) > 5:
        st.session_state.prediction_history.pop()

def render_results(analysis):
    st.markdown("### 🔬 Analysis Results")
    
    if analysis["status"] == "Healthy":
        alert_banner("Plant appears healthy! No diseases detected.", type="success")
        return
        
    sev_color = "critical" if analysis["severity"] == "Severe" else "warning"
    st.markdown(f"**Detected:** {analysis['disease']} {badge(analysis['severity'], sev_color)}", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        metric_card("Confidence", f"{analysis['confidence']:.1%}", "AI Certainty", "🤖", "#4dabf7")
    with col2:
        metric_card("Severity", analysis['severity'], "Estimated Impact", "⚠️", "#ff6b6b" if sev_color=="critical" else "#ffd166")
    with col3:
        metric_card("Status", analysis["status"], "Plant Health", "🥀", "#ff6b6b")

    st.markdown("### 💊 Treatment Plan")
    st.info(f"**Recommended Action:** {analysis['cure']}")
    st.markdown("---")

def render_history():
    st.markdown("### 📜 Recent Scans")
    if "prediction_history" in st.session_state and st.session_state.prediction_history:
        for item in st.session_state.prediction_history:
            color = "#4ade80" if item["status"] == "Healthy" else "#ff6b6b"
            st.markdown(f"<div style='border-left: 3px solid {color}; padding-left: 10px; margin-bottom: 5px;'><small style='color: #8b949e;'>{item['time']}</small><br><b>{item['disease']}</b></div>", unsafe_allow_html=True)
    else:
        st.write("No recent scans.")

def run_camera(model):
    cap = cv2.VideoCapture(0)
    frame_slot = st.empty()

    if "camera_active" not in st.session_state:
        st.session_state.camera_active = False

    while st.session_state.camera_active:
        ret, frame = cap.read()
        if not ret:
            st.error("Camera error")
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame_slot.image(frame_rgb, channels="RGB", use_container_width=True)

        if st.session_state.get("capture_clicked", False):
            st.session_state.camera_active = False
            st.session_state.capture_clicked = False

            frame_resized = cv2.resize(frame_rgb, (416, 416)) # Optimized for RPi memory
            if not os.path.exists("captured"):
                os.makedirs("captured")
                
            save_path = os.path.join("captured", "capture.jpg")
            # Compress image to save bandwidth/processing
            cv2.imwrite(save_path, cv2.cvtColor(frame_resized, cv2.COLOR_RGB2BGR), [int(cv2.IMWRITE_JPEG_QUALITY), 75])

            with st.spinner("Initializing Edge Vision Models..."):
                result = model.predict(save_path).json()
                if "predictions" in result and len(result["predictions"]) > 0:
                    analysis = analyze_prediction(result["predictions"][0])
                else:
                    analysis = {"status": "Healthy", "severity": "None", "confidence": 0, "cure": "N/A", "action": "N/A"}
                
                st.session_state.disease_analysis = analysis
                add_to_history(analysis)
            break

    cap.release()

def disease_ui(model):
    st.markdown("<h2 style='color: #4ade80;'>🌿 Edge AI Disease Detection</h2>", unsafe_allow_html=True)
    st.write("Upload a leaf image or use your camera to detect diseases.")

    option = st.radio("Choose Input Method:", ["📁 Upload Image", "📹 Live Camera"], horizontal=True)
    st.write("")

    if option == "📁 Upload Image":
        file = st.file_uploader("Drop a leaf image here", type=["jpg", "png"])
        if file:
            img = Image.open(file).convert("RGB")
            img.thumbnail((600, 600)) # RPi Optimization
            
            col_img1, col_img2 = st.columns([1, 2])
            with col_img1:
                st.image(img, use_container_width=True)
                if st.button("🦠 Process Leaf Scan", use_container_width=True):
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                        img.save(tmp.name, format="JPEG", quality=75)
                    
                    with st.spinner("Processing Leaf Scan on Edge..."):
                        result = model.predict(tmp.name).json()
                        if len(result.get("predictions", [])) > 0:
                            analysis = analyze_prediction(result["predictions"][0])
                        else:
                            analysis = {"status": "Healthy", "severity": "None", "confidence": 0, "cure": "N/A", "action": "N/A"}
                        
                        st.session_state.disease_analysis = analysis
                        add_to_history(analysis)
                    
                    os.unlink(tmp.name)

            with col_img2:
                if "disease_analysis" in st.session_state:
                    render_results(st.session_state.disease_analysis)
                    render_history()

    else:
        col_cam, col_res = st.columns([1, 1])
        with col_cam:
            c1, c2 = st.columns(2)
            with c1:
                if st.button("▶ Start Camera", use_container_width=True):
                    st.session_state.camera_active = True
                    st.session_state.capture_clicked = False
                    st.rerun()
            with c2:
                if st.session_state.get("camera_active", False):
                    if st.button("📸 Capture", use_container_width=True):
                        st.session_state.capture_clicked = True
                else:
                    st.button("📸 Capture", disabled=True, use_container_width=True)
                    
            if st.session_state.get("camera_active", False):
                run_camera(model)
                
        with col_res:
            if "disease_analysis" in st.session_state and not st.session_state.get("camera_active", False):
                render_results(st.session_state.disease_analysis)
                render_history()