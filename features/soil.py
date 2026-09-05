import streamlit as st
from components.charts import create_npk_chart

def soil_health_ui():
    st.markdown("<h2 style='color: #4ade80;'>🧪 Soil Health Analyzer</h2>", unsafe_allow_html=True)
    st.write("Analyze your soil nutrients to get personalized fertilizer recommendations.")
    
    col1, col2 = st.columns([1, 2])
    
    with col1:
        st.markdown("#### Input Soil Metrics")
        n = st.slider("Nitrogen (N)", 0, 200, st.session_state.get("soil_N", 90))
        p = st.slider("Phosphorus (P)", 0, 200, st.session_state.get("soil_P", 50))
        k = st.slider("Potassium (K)", 0, 200, st.session_state.get("soil_K", 50))
        ph = st.number_input("Soil pH", 0.0, 14.0, st.session_state.get("soil_ph", 6.5), step=0.1)
        
        # Save to session state to keep consistency across tabs
        st.session_state.soil_N = n
        st.session_state.soil_P = p
        st.session_state.soil_K = k
        st.session_state.soil_ph = ph

    with col2:
        st.markdown("#### Nutrient Balance Radar")
        st.plotly_chart(create_npk_chart(n, p, k), use_container_width=True)
        
    st.markdown("---")
    st.markdown("### 📊 Health Insights")
    
    insights = []
    
    # N Analysis
    if n < 50:
        insights.append(("🚨 Nitrogen is Low", "Apply urea or nitrogen-rich fertilizers. Plants may show stunted growth and yellowing.", "critical"))
    elif n > 150:
        insights.append(("⚠️ Nitrogen is High", "Reduce nitrogen. Excess can lead to weak stems and delayed flowering.", "warning"))
    else:
        insights.append(("✅ Nitrogen is Optimal", "Good levels for vegetative growth.", "success"))
        
    # P Analysis
    if p < 30:
        insights.append(("🚨 Phosphorus is Low", "Apply DAP or rock phosphate. Roots may be underdeveloped.", "critical"))
    elif p > 100:
        insights.append(("⚠️ Phosphorus is High", "Can interfere with iron/zinc absorption.", "warning"))
    else:
        insights.append(("✅ Phosphorus is Optimal", "Ideal for root development and flowering.", "success"))
        
    # pH Analysis
    if ph < 5.5:
        insights.append(("🚨 Soil is Acidic", "Apply agricultural lime to raise pH.", "critical"))
    elif ph > 7.5:
        insights.append(("🚨 Soil is Alkaline", "Apply sulfur or organic matter to lower pH.", "critical"))
    else:
        insights.append(("✅ pH is Neutral", "Perfect for most crops.", "success"))
        
    # Render Insights
    for title, desc, severity in insights:
        color = "#ff6b6b" if severity == "critical" else "#ffd166" if severity == "warning" else "#4ade80"
        st.markdown(f"""
        <div class="premium-card" style="border-left: 4px solid {color};">
            <h4 style="margin:0; color:{color};">{title}</h4>
            <p style="margin:5px 0 0 0; color:#e6edf3;">{desc}</p>
        </div>
        """, unsafe_allow_html=True)
