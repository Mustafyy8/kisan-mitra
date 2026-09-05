import streamlit as st
from services.weather import get_weather_data, generate_weather_alert
from components.ui import metric_card, alert_banner, status_indicator
from components.charts import create_gauge_chart
import random

def calculate_farm_health():
    """Calculates a 0-100 score based on mock data and risk."""
    base = 100
    risk = st.session_state.get("disease_risk", 15)
    moisture = st.session_state.get("soil_moisture", 45.0)
    
    # Deduct points for high risk or poor moisture
    if risk > 20: base -= (risk - 20)
    if moisture < 30: base -= 15
    elif moisture > 80: base -= 10
        
    return max(0, min(100, int(base)))

def dashboard_ui():
    st.markdown("<h2 style='color: #4ade80;'>🌾 Smart Farm Dashboard</h2>", unsafe_allow_html=True)
    
    # Calculate Health Score
    health_score = calculate_farm_health()
    health_color = "#4ade80" if health_score >= 80 else "#ffd166" if health_score >= 60 else "#ff6b6b"
    
    # Top Section: Farm Health & System Status
    col_health, col_sys = st.columns([1, 1])
    
    with col_health:
        st.markdown("### 🏥 Farm Health Score")
        st.plotly_chart(create_gauge_chart(health_score, "Overall Health", 100, health_color), use_container_width=True)
        
        # Proactive Recommendation
        action = "Maintain current care routines."
        if health_score < 70: action = "Increase irrigation and monitor for pests."
        if st.session_state.get("disease_risk", 15) > 30: action = "Apply preventive fungicide immediately."
        
        st.info(f"**💡 Recommended Action Today:** {action}")
        
    with col_sys:
        st.markdown("### ⚙️ System Status Panel")
        st.markdown("<div class='premium-card' style='padding: 10px;'>", unsafe_allow_html=True)
        status_indicator("AI Vision Systems", "Online")
        status_indicator("Weather API", "Connected")
        status_indicator("KM-Gateway Node", "Active")
        status_indicator("Edge Processing", "Stable")
        status_indicator("Local Database", "Ready")
        st.markdown("</div>", unsafe_allow_html=True)

    # Weather Section
    weather = get_weather_data(st.session_state.get("farm_location", "Delhi"))
    alerts = generate_weather_alert(weather)
    
    st.markdown("---")
    st.markdown("### 🌤️ Live Weather & Active Alerts")
    
    # Render Alerts
    for alert in alerts:
        alert_banner(alert["msg"], type=alert["type"])
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        metric_card("Temperature", f"{weather['temp']}°C", weather["condition"], "🌡️", "#ff6b6b")
    with col2:
        metric_card("Humidity", f"{weather['humidity']}%", "Air Moisture", "💧", "#4dabf7")
    with col3:
        metric_card("Wind Speed", f"{weather['wind_speed']} m/s", "Breeze", "💨", "#ffd166")
    with col4:
        metric_card("Location", weather["city"], f"Updated: {weather['timestamp']}", "📍", "#4ade80")
