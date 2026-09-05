import streamlit as st
import os

# =====================================
# CONFIG MUST BE THE FIRST STREAMLIT CALL
# =====================================
st.set_page_config(
    page_title="KISAN MITRA",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load custom CSS
def load_css(file_name):
    with open(file_name) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)

load_css("styles/style.css")

# =====================================
# HEAVY RESOURCES (LAZY LOADED / CACHED)
# =====================================
@st.cache_resource(show_spinner="Loading Vision Models...")
def load_vision_model():
    from roboflow import Roboflow
    rf = Roboflow(api_key="nJbPHIcnzVTPpjepcsVF")
    project = rf.workspace().project("my-first-project-gtp5u")
    return project.version(4).model

# =====================================
# INIT DIRS & STATE
# =====================================
if not os.path.exists("captured"):
    os.makedirs("captured")
    
# Initialize global session variables to prevent KeyErrors
if "farm_location" not in st.session_state: 
    from services.weather import get_ip_location
    st.session_state.farm_location = get_ip_location()
if "soil_moisture" not in st.session_state: st.session_state.soil_moisture = 45.0
if "soil_ph" not in st.session_state: st.session_state.soil_ph = 6.5
if "disease_risk" not in st.session_state: st.session_state.disease_risk = 15

# =====================================
# SIDEBAR NAVIGATION
# =====================================
st.sidebar.markdown("<h2 style='color: #4ade80;'>🌾 KISAN MITRA</h2>", unsafe_allow_html=True)
st.sidebar.markdown("<p style='color: #8b949e; font-size: 0.9em; margin-top:-10px;'>Intelligent Farming OS</p>", unsafe_allow_html=True)
st.sidebar.markdown("---")

menu = st.sidebar.radio(
    "Navigation",
    [
        "🏠 Dashboard", 
        "🌱 Crop AI", 
        "🌿 Disease AI", 
        "🧪 Soil Analyzer", 
        "🤖 AI Copilot", 
        "📡 Live IoT", 
        "👤 Farm Profile"
    ],
    label_visibility="collapsed"
)

st.sidebar.markdown("---")
if st.sidebar.button("Logout"):
    st.sidebar.success("Logged out successfully.")

# Edge AI Badges
st.sidebar.markdown("""
<div style="text-align: center; margin-top: 15px;">
    <span style="display: inline-block; background: rgba(74, 222, 128, 0.2); color: #4ade80; padding: 2px 8px; border-radius: 12px; font-size: 0.75em; border: 1px solid rgba(74, 222, 128, 0.4); margin: 2px;">⚡ Edge AI Ready</span>
    <span style="display: inline-block; background: rgba(0, 150, 255, 0.2); color: #4dabf7; padding: 2px 8px; border-radius: 12px; font-size: 0.75em; border: 1px solid rgba(0, 150, 255, 0.4); margin: 2px;">🍓 RPi Optimized</span>
</div>
""", unsafe_allow_html=True)

st.sidebar.markdown("<p style='text-align: center; color: rgba(255,255,255,0.3); font-size: 0.8em; margin-top: 10px;'>v2.0 SaaS Release</p>", unsafe_allow_html=True)

# =====================================
# LAZY ROUTING
# =====================================
# We import features lazily so we don't load everything into memory at once
if menu == "🏠 Dashboard":
    from features.dashboard import dashboard_ui
    dashboard_ui()
    
elif menu == "🌱 Crop AI":
    from features.crop import crop_ui
    crop_ui()
    
elif menu == "🌿 Disease AI":
    from features.disease import disease_ui
    # We load the vision model only when Disease AI is clicked or if it's already cached
    model = load_vision_model()
    disease_ui(model)
    
elif menu == "🧪 Soil Analyzer":
    from features.soil import soil_health_ui
    soil_health_ui()
    
elif menu == "🤖 AI Copilot":
    from features.chatbot import chatbot_ui
    chatbot_ui()
    
elif menu == "📡 Live IoT":
    from features.iot import iot_dashboard_ui
    iot_dashboard_ui()
    
elif menu == "👤 Farm Profile":
    from features.profile import profile_ui
    profile_ui()
