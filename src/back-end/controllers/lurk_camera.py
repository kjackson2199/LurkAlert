from picamera2 import Picamera2
import time

picam2 = Picamera2()
video_config = picam2.create_video_configuration()
picam2.configure(video_config)
picam2.start()

def capture_frame():
    frame = picam2.capture_array()
    if frame is None:
        return None
    return frame

def stop():
    picam2.close()
    print("Camera stopped.")