from controllers.camera import start_recording, stop_recording, release, capture_frame
import cv2
import time
import numpy as np
import os

detect_motion_active = False

def motion_detect_task():
    while detect_motion_active:
        frame = capture_frame()
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        image = cv2.GaussianBlur(frame, (21, 21), 0)

        