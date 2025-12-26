import cv2
import pytesseract
import numpy as np
from PIL import Image

def extract_meter_reading(image_bytes):
    image = Image.open(image_bytes).convert("L")
    image = np.array(image)
    _, image = cv2.threshold(image, 150, 255, cv2.THRESH_BINARY)
    text = pytesseract.image_to_string(image, config="--psm 6 digits")
    text = "".join(filter(str.isdigit, text))
    return text
