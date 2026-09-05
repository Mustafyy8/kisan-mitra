import streamlit as st
import datetime

def crop_ui():

    st.markdown("<h2 style='color: #4ade80;'>🌱 AI Crop Recommendations</h2>", unsafe_allow_html=True)
    st.write("Adjust values based on your field conditions to receive optimal crop recommendations")
    st.write("")

    col1, col2, col3 = st.columns(3)
    
    with col1:
        N = st.number_input("Nitrogen (N)", min_value=0, max_value=200, value=90, step=5)
        temp = st.slider("Temperature (°C)", 0, 50, 25, step=1)
        rainfall = st.slider("Rainfall (mm)", 0, 500, 100, step=10)

    with col2:
        P = st.number_input("Phosphorus (P)", min_value=0, max_value=200, value=50, step=5)
        humidity = st.slider("Humidity (%)", 0, 100, 65, step=5)

    with col3:
        K = st.number_input("Potassium (K)", min_value=0, max_value=200, value=50, step=5)
        ph = st.slider("Soil pH", 0.0, 14.0, 6.5, step=0.1)

    st.write("")
    
    col_btn1, col_btn2, col_btn3 = st.columns([1, 2, 1])
    with col_btn2:
        analyze_clicked = st.button("🌾 Analyze Crop Data", use_container_width=True)

    if analyze_clicked:
        with st.spinner("Analyzing soil and climate data on Edge..."):
            recommendations = []
            if N > 80 and P > 40 and K > 40 and ph > 5.5 and ph < 7.0 and rainfall > 1000:
                recommendations.append("🌾 Rice")
            if N > 40 and P > 40 and K > 40 and ph > 5.0 and ph < 7.5 and temp > 15 and temp < 25:
                recommendations.append("🌱 Wheat")
            if N > 60 and P > 40 and K > 40 and ph > 5.5 and ph < 7.5 and temp > 20 and temp < 30:
                recommendations.append("🌽 Maize")
            if N > 50 and P > 30 and K > 30 and ph > 6.0 and ph < 8.0 and temp > 20 and temp < 35:
                recommendations.append("🧵 Cotton")
            if N > 100 and P > 50 and K > 50 and ph > 6.5 and ph < 7.5 and rainfall > 1500:
                recommendations.append("🍬 Sugarcane")
            if N > 20 and P > 20 and K > 20 and ph > 5.5 and ph < 7.0 and temp > 15 and temp < 25 and rainfall < 500:
                recommendations.append("🌿 Chickpea")
            if N > 30 and P > 20 and K > 20 and ph > 6.0 and ph < 7.5 and temp > 10 and temp < 25 and rainfall < 400:
                recommendations.append("🌼 Mustard")
    
        if recommendations:
            st.success("✅ Suitable Crops Found!")
            
            # Save to History
            if "prediction_history" not in st.session_state:
                st.session_state.prediction_history = []
            
            entry = {
                "time": datetime.datetime.now().strftime("%I:%M %p"),
                "disease": f"Crop Rec: {recommendations[0].split()[-1]}", # Get just the name
                "status": "Success"
            }
            st.session_state.prediction_history.insert(0, entry)
            if len(st.session_state.prediction_history) > 5:
                st.session_state.prediction_history.pop()
            
            # Simulated Economic Insights Data
            economics = {
                "🌾 Rice": {"water": "High (1200mm)", "yield": "3-5 tons/acre", "demand": "Very High", "profit": "Moderate"},
                "🌱 Wheat": {"water": "Medium (400mm)", "yield": "2-3 tons/acre", "demand": "High", "profit": "Moderate"},
                "🌽 Maize": {"water": "Medium (500mm)", "yield": "4-5 tons/acre", "demand": "High", "profit": "Good"},
                "🧵 Cotton": {"water": "Medium (700mm)", "yield": "1-2 tons/acre", "demand": "High", "profit": "Very High"},
                "🍬 Sugarcane": {"water": "Very High (1500mm)", "yield": "30-40 tons/acre", "demand": "High", "profit": "Very High"},
                "🌿 Chickpea": {"water": "Low (200mm)", "yield": "0.5-1 tons/acre", "demand": "Medium", "profit": "Good"},
                "🌼 Mustard": {"water": "Low (250mm)", "yield": "0.8-1.2 tons/acre", "demand": "Medium", "profit": "Good"}
            }

            for crop in recommendations:
                st.markdown(f"<h3 style='color: #4ade80;'>{crop}</h3>", unsafe_allow_html=True)
                
                if crop in economics:
                    data = economics[crop]
                    ec1, ec2, ec3, ec4 = st.columns(4)
                    ec1.metric("Water Need", data["water"])
                    ec2.metric("Expected Yield", data["yield"])
                    ec3.metric("Market Demand", data["demand"])
                    ec4.metric("Profitability", data["profit"])
                st.markdown("<hr style='border: 1px solid rgba(255,255,255,0.05);'>", unsafe_allow_html=True)
        else:
            st.warning("⚠️ No strong match found. Try adjusting inputs.")