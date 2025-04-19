import cv2
import numpy as np

camera = cv2.VideoCapture(0)
fgfb = cv2.createBackgroundSubtractorMOG2(detectShadows=True)

if not camera.isOpened():
    raise RuntimeError("Could not open the camera.")

def get_frame():
    success, frame = camera.read()
    if not success:
        return None
    
    ret, buffer = cv2.imencode('.jpg', frame)
    if not ret:
        return None
    
    return buffer.tobytes()