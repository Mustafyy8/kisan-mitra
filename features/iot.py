import streamlit as st
import time
import pandas as pd
import numpy as np
import plotly.express as px
from components.ui import status_indicator

def iot_dashboard_ui():
    st.markdown("<h2 style='color: #4ade80;'>📡 Live IoT Edge Telemetry</h2>", unsafe_allow_html=True)
    st.write("Real-time telemetry from farm hardware (Raspberry Pi / Arduino).")
    
    # Last Sensor Sync Panel
    col_sync1, col_sync2 = st.columns([2, 1])
    with col_sync2:
        st.markdown("<div class='premium-card' style='padding: 10px;'>", unsafe_allow_html=True)
        status_indicator("KM-Gateway", "Online")
        status_indicator("Last Sync", "12s ago")
        status_indicator("Latency", "24ms")
        st.markdown("</div>", unsafe_allow_html=True)
        
    metrics_placeholder = st.empty()
    chart_placeholder = st.empty()
    
    if "iot_history" not in st.session_state:
        st.session_state.iot_history = pd.DataFrame({
            "Time": pd.date_range(end=pd.Timestamp.now(), periods=20, freq="1min"),
            "Moisture": np.random.normal(45, 2, 20),
            "Temp": np.random.normal(25, 0.5, 20)
        })
        
    run_sim = st.toggle("Start Live Sync", value=False)
    if run_sim:
        st.info("Simulating incoming sensor stream via UART/Serial...")
        
    def render_sensors(moisture, temp, battery):
        with metrics_placeholder.container():
            m1, m2, m3, m4 = st.columns(4)
            m1.metric("KM-MoistureNode-A1", f"{moisture:.1f} %", "Active", delta_color="normal")
            m2.metric("KM-SoilCore-T1", f"{temp:.1f} °C", "Stable", delta_color="off")
            m3.metric("KM-ClimateHub", "Online", "Connected", delta_color="normal")
            m4.metric("Node Battery", f"{battery}%", "-1% / hr", delta_color="inverse")
            
    def render_charts(df):
        with chart_placeholder.container():
            fig = px.line(df, x="Time", y=["Moisture", "Temp"], title="Edge Sensor Telemetry", template="plotly_dark")
            fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', height=300)
            st.plotly_chart(fig, use_container_width=True)

    latest_m = st.session_state.iot_history["Moisture"].iloc[-1]
    latest_t = st.session_state.iot_history["Temp"].iloc[-1]
    render_sensors(latest_m, latest_t, 87)
    render_charts(st.session_state.iot_history)
