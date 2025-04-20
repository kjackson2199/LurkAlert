from picamera2 import Picamera2

class Camera:
    def __init__(self):
        self.picam2 = Picamera2()
        self.picam2.configure(self.picam2.create_preview_configuration())
        self.picam2.start()
    
    def read(self):
        frame = self.picam2.capture_array()
        return frame

    def capture_image(self, filename):
        self.picam2.capture_file(filename)

    def close(self):
        self.picam2.close()