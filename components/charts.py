import plotly.graph_objects as go
import streamlit as st

@st.cache_data(show_spinner=False)
def create_npk_chart(n, p, k):
    """Creates a beautiful radar chart for NPK values."""
    fig = go.Figure()
    fig.add_trace(go.Scatterpolar(
        r=[n, p, k, n], # Close the loop
        theta=['Nitrogen (N)', 'Phosphorus (P)', 'Potassium (K)', 'Nitrogen (N)'],
        fill='toself',
        fillcolor='rgba(74, 222, 128, 0.4)',
        line=dict(color='#4ade80', width=2),
        name='Soil Nutrients'
    ))

    fig.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 200], gridcolor='rgba(255,255,255,0.1)', tickfont=dict(color='#8b949e')),
            angularaxis=dict(gridcolor='rgba(255,255,255,0.1)', tickfont=dict(color='#e6edf3'))
        ),
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=20, r=20, t=20, b=20),
        height=250
    )
    return fig

@st.cache_data(show_spinner=False)
def create_gauge_chart(value, title, max_val, color):
    """Creates a circular gauge chart."""
    fig = go.Figure(go.Indicator(
        mode = "gauge+number",
        value = value,
        title = {'text': title, 'font': {'color': '#e6edf3', 'size': 14}},
        gauge = {
            'axis': {'range': [None, max_val], 'tickwidth': 1, 'tickcolor': "white"},
            'bar': {'color': color},
            'bgcolor': "rgba(255,255,255,0.05)",
            'borderwidth': 0,
        },
        number = {'font': {'color': color, 'size': 24}}
    ))
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        margin=dict(l=10, r=10, t=40, b=10),
        height=180
    )
    return fig
