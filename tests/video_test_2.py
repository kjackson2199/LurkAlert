import time
import cv2
import numpy as np
import os

from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FfmpegOutput

picam2 = Picamera2()
video_resolution = (2028,1080)
mode = picam2.sensor_modes[1]
video_config = picam2.create_video_configuration(sensor={'output_size': mode['size'], 'bit_depth': mode['bit_depth']}, main={"format": 'RGB888', "size": video_resolution})
# video_config = picam2.create_video_configuration(main={"format": 'RGB888', "size": video_resolution})
picam2.configure(video_config)
print("Starting camera...")
picam2.start()
time.sleep(6)


fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fps = 30

output_file_path = "/home/lurk/recordings"

# record test
recording_start_time = time.time()
recording_time = 120  # seconds
timestamp = time.strftime("%Y%m%d_%H%M%S")
filename = os.path.join(output_file_path, f"recording_{timestamp}.mp4")
# frame = picam2.capture_array()
# video_writer = cv2.VideoWriter(filename, fourcc, fps, video_resolution)

# if not video_writer.isOpened():
#     raise RuntimeError("Failed to open video writer. Recording stopped.")

print("Recording...")
encoder = H264Encoder(10000000)
output = FfmpegOutput(filename, audio=False)
picam2.start_recording(encoder, output)

while time.time() - recording_start_time < recording_time:
    elapsed_time = int(time.time() - recording_start_time)
    print(f'Elapsed time: {elapsed_time // 60:02}:{elapsed_time % 60:02}', end='\r', flush=True)
    # frame = picam2.capture_array()
    # if frame is None:
    #     break

    # cv2.imwrite(os.path.join(output_file_path, f"frame_{elapsed_time}.jpg"), frame)
    
    # video_writer.write(frame)
    time.sleep(1.0/fps)

print("Stopping recording...")
# video_writer.release()
# del video_writer

picam2.stop_recording()
picam2.stop()