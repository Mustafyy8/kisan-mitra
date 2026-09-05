import streamlit as st
import numpy as np
from helpers.model_loader import load_crop_model


def main():
    st.title("🌱 Crop Recommendation System")

    crop_model = load_crop_model()

    N = st.number_input("Nitrogen (N)", 0, 200)
    P = st.number_input("Phosphorus (P)", 0, 200)
    K = st.number_input("Potassium (K)", 0, 200)
    temp = st.number_input("Temperature (°C)", 0, 50)
    humidity = st.number_input("Humidity (%)", 0, 100)
    ph = st.number_input("Soil pH", 0.0, 14.0)
    rainfall = st.number_input("Rainfall (mm)", 0.0, 500.0)

    if st.button("Predict Crop"):
        values = np.array([[N, P, K, temp, humidity, ph, rainfall]])
        result = crop_model.predict(values)[0]
        st.success(f"Recommended Crop: {result}")


if __name__ == "__main__":
    main()
