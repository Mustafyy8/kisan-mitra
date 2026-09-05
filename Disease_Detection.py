import streamlit as st
from PIL import Image
from helpers.model_loader import load_disease_model
from helpers.preprocess import preprocess_image


def main():
    st.title("🌿 Plant Disease Detection")

    model = load_disease_model()

    upload_file = st.file_uploader("Upload a leaf image", type=["jpg", "jpeg", "png"])

    if upload_file:
        img = Image.open(upload_file)
        st.image(img, caption="Uploaded image", use_column_width=True)

        if st.button("Detect Disease"):
            processed = preprocess_image(img)
            pred = model.predict(processed)
            class_id = pred.argmax()
            st.success(f"Disease Detected: Class ID {class_id}")


if __name__ == "__main__":
    main()
