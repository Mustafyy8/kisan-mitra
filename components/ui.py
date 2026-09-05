import streamlit as st

def card(title, content, icon=""):
    """Displays a premium glassmorphic card."""
    st.markdown(f"""
    <div class="premium-card">
        <h4 style='margin-top:0; color: #e6edf3;'>{icon} {title}</h4>
        <div style='color: #8b949e;'>{content}</div>
    </div>
    """, unsafe_allow_html=True)

def metric_card(title, value, subtitle="", icon="", color="#4ade80"):
    """Displays a mini metric card."""
    st.markdown(f"""
    <div class="premium-card" style="text-align: center;">
        <p style="color: #8b949e; margin: 0; font-size: 0.9rem;">{icon} {title}</p>
        <h2 style="color: {color}; margin: 5px 0;">{value}</h2>
        <p style="color: rgba(255,255,255,0.4); margin: 0; font-size: 0.75rem;">{subtitle}</p>
    </div>
    """, unsafe_allow_html=True)

def badge(text, type="info"):
    """Returns HTML for a badge."""
    return f'<span class="badge badge-{type}">{text}</span>'

def alert_banner(msg, type="info"):
    """Displays an alert banner using Streamlit's native st.error/warning but stylized via CSS."""
    if type == "critical":
        st.error(f"🚨 **CRITICAL:** {msg}")
    elif type == "warning":
        st.warning(f"⚠️ **WARNING:** {msg}")
    elif type == "success":
        st.success(f"✅ **SUCCESS:** {msg}")
    else:
        st.info(f"ℹ️ **INFO:** {msg}")

def status_indicator(label, status):
    """Displays a compact enterprise-style system status indicator."""
    color = "#4ade80" if status.lower() in ["online", "active", "stable", "ready"] else "#ff6b6b"
    st.markdown(f"""
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 5px;">
        <span style="color: #e6edf3; font-size: 0.9rem;">{label}</span>
        <span style="color: {color}; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px;">
            <div style="width: 8px; height: 8px; background: {color}; border-radius: 50%; box-shadow: 0 0 8px {color};"></div>
            {status.upper()}
        </span>
    </div>
    """, unsafe_allow_html=True)
