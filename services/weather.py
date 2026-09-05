import requests
import streamlit as st
import datetime

OPENWEATHER_API_KEY = "a25e375600adf1b6bad4c9446b08de84"

@st.cache_data(ttl=86400, show_spinner=False)
def get_ip_location():
    """Fetches the user's city automatically based on their IP address."""
    try:
        response = requests.get("http://ip-api.com/json/", timeout=3)
        data = response.json()
        if data.get("status") == "success":
            return data.get("city", "Delhi")
    except Exception:
        pass
    return "Delhi" # Fallback

@st.cache_data(ttl=1800, show_spinner=False)
def get_weather_data(city="Delhi"):
    """Fetches real-time weather data with caching and graceful fallback."""
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={OPENWEATHER_API_KEY}&units=metric"
    try:
        response = requests.get(url, timeout=5)
        response.raise_for_status()
        data = response.json()
        return {
            "temp": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "condition": data["weather"][0]["main"],
            "description": data["weather"][0]["description"].title(),
            "wind_speed": data["wind"]["speed"],
            "city": data["name"],
            "timestamp": datetime.datetime.now().strftime("%I:%M %p"),
            "status": "success"
        }
    except Exception as e:
        # Graceful fallback so the UI never breaks
        return {
            "temp": 32.0,
            "humidity": 60,
            "condition": "Sunny",
            "description": "Clear Sky (Fallback)",
            "wind_speed": 3.5,
            "city": city,
            "timestamp": datetime.datetime.now().strftime("%I:%M %p"),
            "status": "error"
        }

@st.cache_data(ttl=3600, show_spinner=False)
def generate_weather_alert(weather_data):
    """Generates simple farming alerts based on current weather."""
    temp = weather_data.get("temp", 25)
    humidity = weather_data.get("humidity", 50)
    cond = weather_data.get("condition", "").lower()

    alerts = []
    if "rain" in cond:
        alerts.append({"type": "warning", "msg": "Rain expected. Delay pesticide spraying."})
    if temp > 35:
        alerts.append({"type": "critical", "msg": "High temperature alert. Ensure adequate irrigation."})
    elif temp < 15:
        alerts.append({"type": "info", "msg": "Low temperature. Protect cold-sensitive crops."})
    if humidity > 80:
        alerts.append({"type": "warning", "msg": "High humidity detected. Watch for fungal diseases."})
        
    if not alerts:
        alerts.append({"type": "success", "msg": "Weather conditions are optimal for general farming."})
        
    return alerts
