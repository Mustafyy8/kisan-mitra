from roboflow import Roboflow

API_KEY = "nJbPHIcnzVTPpjepcsVF"
IMAGE_PATH = r"Data\plantvillage\Tomato__Tomato_YellowLeaf__Curl_Virus\0a0fe942-bb9e-4384-8466-779017d00bcf___UF.GRC_YLCV_Lab 02192.JPG"

rf = Roboflow(api_key=API_KEY)
project = rf.workspace().project("my-first-project-gtp5u")
model = project.version(3).model

result = model.predict(IMAGE_PATH).json()

# Print full response (debug)
print(result)
prediction = result["predictions"][0]

top_class = prediction["top"]
confidence = prediction["confidence"]

print(f"Predicted Class: {top_class}")
print(f"Confidence: {confidence:.2f}")
