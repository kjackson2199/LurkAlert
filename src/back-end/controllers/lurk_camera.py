from picamera2 import Picamera2
import time

class Camera:
    def __init__(self):
        self.picam2 = Picamera2()
        print("Setting video configuration...")
        self.video_config = self.picam2.create_video_configuration()
        self.picam2.configure(self.video_config)
    
    def start(self):
        print("Starting camera...")
        self.picam2.start()
        time.sleep(5)
        print("Camera started.")
    
    def read(self):
        frame = self.picam2.capture_array()
        return frame

    def capture_image(self, filename):
        self.picam2.capture_file(filename)

    def stop(self):
        self.picam2.stip()