import tensorflow as tf
import numpy as np
from PIL import Image
import cv2

models = [
    tf.keras.models.load_model("models/model1.h5"),
    tf.keras.models.load_model("models/model2.h5"),
    tf.keras.models.load_model("models/model3.h5"),
    tf.keras.models.load_model("models/model4.h5"),
    tf.keras.models.load_model("models/model5.h5"),
]

def preprocess(image_bytes):
    image = Image.open(image_bytes).resize((224, 224))
    image = np.array(image) / 255.0
    return np.expand_dims(image, axis=0)

def validate_image(image_bytes):
    image = preprocess(image_bytes)
    results = []

    for model in models:
        prediction = model.predict(image)[0][0]
        results.append(prediction)

    avg_score = sum(results) / len(results)
    return avg_score > 0.5
