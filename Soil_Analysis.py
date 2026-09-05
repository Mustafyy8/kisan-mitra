import streamlit as st
import numpy as np
from helpers.model_loader import load_soil_model, load_scaler


def main():
    st.title("🧪 Soil Type Analysis")

    soil_model = load_soil_model()
    scaler = load_scaler()

    pH = st.number_input("pH", 0.0, 14.0)
    EC = st.number_input("Electrical Conductivity", 0.0, 10.0)
    OC = st.number_input("Organic Carbon", 0.0, 3.0)
    N = st.number_input("Nitrogen", 0, 200)
    P = st.number_input("Phosphorus", 0, 200)
    K = st.number_input("Potassium", 0, 200)

    if st.button("Predict Soil Type"):
        values = np.array([[pH, EC, OC, N, P, K]])
        scaled = scaler.transform(values)
        result = soil_model.predict(scaled)[0]
        st.success(f"Soil Type: {result}")


if __name__ == "__main__":
    main()
