from picamera2 import Picamera2
import time

class Camera:
    def __init__(self):
        self.picam2 = Picamera2()
        self.picam2.configure(picam2.create_preview_configuration(main={"format": 'XRGB8888', "size": (640, 480)}))
        self.picam2.start()
    
    def start():
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