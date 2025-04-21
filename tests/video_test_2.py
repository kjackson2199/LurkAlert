import time
import cv2
import numpy as np
import os

from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FfmpegOutput

picam2 = Picamera2()
video_config = picam2.create_video_configuration()
picam2.configure(video_config)

# encoder = H264Encoder(10000000)
# output = FfmpegOutput('test.mp4', audio=False)

fourcc = cv2.VideoWriter.fourcc(*'mp4v')
fps = 30

output_file_path = "/home/lurk/recordings"

# record test
recording_start_time = time.time()
recording_time = 60  # seconds

while time.time() - recording_start_time < recording_time:
    print("Recording...")
    frame = picam2.capture_array()
    if frame is None:
        break
    
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(output_file_path, f"recording_{timestamp}.mp4")
    
    video_writer = cv2.VideoWriter(filename, fourcc, fps, (frame.shape[1], frame.shape[0]))
    
    if not video_writer.isOpened():
        raise RuntimeError("Failed to open video writer. Recording stopped.")
    
    video_writer.write(frame)

print("Stopping recording...")
video_writer.release()
del video_writer

picam2.stop()