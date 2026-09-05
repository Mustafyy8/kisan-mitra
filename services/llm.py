import streamlit as st
import google.generativeai as genai
from services.weather import get_weather_data

GEMINI_API_KEY = "AIzaSyDlKvmZOnSVo2w2z1kTR74ftsxtWgm1yuw"
genai.configure(api_key=GEMINI_API_KEY)

# Cache the model initialization
@st.cache_resource(show_spinner=False)
def get_gemini_model():
    # Use gemini-flash-latest for fast, stable responses
    return genai.GenerativeModel('gemini-flash-latest')

def build_farm_context():
    """Extracts live telemetry, state, and weather to build a context string."""
    try:
        # 1. Fetch Weather silently (Uses cached data to avoid latency)
        loc = st.session_state.get("farm_location", "Delhi")
        weather = get_weather_data(loc)
        
        # 2. Gather State Variables safely
        crop = st.session_state.get("primary_crop", "Unknown")
        size = st.session_state.get("farm_size", "Unknown")
        moisture = st.session_state.get("soil_moisture", "Unknown")
        n = st.session_state.get("soil_N", "Unknown")
        p = st.session_state.get("soil_P", "Unknown")
        k = st.session_state.get("soil_K", "Unknown")
        ph = st.session_state.get("soil_ph", "Unknown")
        
        # Extract latest disease scan safely
        disease_info = "No recent scans."
        disease_state = st.session_state.get("disease_analysis", {})
        if isinstance(disease_state, dict) and "disease" in disease_state:
            disease_info = f"{disease_state.get('disease', 'Healthy')} ({disease_state.get('severity', 'None')} Severity)"
            
        # Build String
        context = f"""
Current Farm Context:
- Location: {loc}
- Weather: {weather.get('temp')}°C, {weather.get('condition')} ({weather.get('description')}), Humidity: {weather.get('humidity')}%
- Primary Crop: {crop} ({size} Acres)
- Live Soil Moisture: {moisture}%
- Soil N-P-K: {n}-{p}-{k}
- Soil pH: {ph}
- Latest Disease Scan: {disease_info}
"""
        return context
    except Exception as e:
        return f"\n[System Note: Context extraction failed gracefully - {str(e)}]\n"

def generate_agricultural_response(prompt, history=[]):
    """Generates agricultural advice using Gemini with chat history and LIVE CONTEXT injection."""
    try:
        model = get_gemini_model()
        
        # Format history for Gemini API
        formatted_history = []
        for msg in history:
            role = "user" if msg["role"] == "user" else "model"
            formatted_history.append({"role": role, "parts": [msg["content"]]})
            
        chat = model.start_chat(history=formatted_history)
        
        # Inject dynamic context
        farm_context = build_farm_context()
        
        system_prompt = f"""You are KISAN MITRA AI, an expert Agricultural Copilot deeply integrated into an Edge AI IoT platform. 
You MUST provide proactive, practical, and highly relevant farming advice based primarily on the Live Farm Context below. 
Rule 1: If incoming weather threatens an action (like spraying pesticide before rain), explicitly warn the user.
Rule 2: If soil nutrients/moisture are sub-optimal, explicitly recommend corrections.
Rule 3: Tailor your advice specifically to the Primary Crop if applicable.
Rule 4: Do not hallucinate data; use ONLY the Context provided below. If a metric is 'Unknown', ignore it.

{farm_context}

"""
        full_prompt = system_prompt + "User Question: " + prompt
        
        response = chat.send_message(full_prompt)
        return response.text
        
    except Exception as e:
        return f"⚠️ I'm currently unable to connect to the AI service. Please try again later. Error: {str(e)[:150]}"
