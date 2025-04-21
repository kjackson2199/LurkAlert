import time
import numpy as np
import os
import threading

from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FfmpegOutput

picam2 = None

recording_active = True
recording_thread = None

output_file_path = "/home/lurk/recordings"
if not os.path.exists(output_file_path):
    os.makedirs(output_file_path)

print(f"Output file path: {output_file_path}")

def init_camera():
    print("Initializing camera...")
    global picam2, recording_thread
    global recording_active

    picam2 = Picamera2()
    video_resolution = (2028, 1080)
    mode = picam2.sensor_modes[1]
    video_config = picam2.create_video_configuration(sensor={'output_size': mode['size'], 'bit_depth': mode['bit_depth']}, main={"format": 'RGB888', "size": video_resolution})
    picam2.configure(video_config)
    print("Starting camera...")
    picam2.start()
    time.sleep(10)
    recording_thread = threading.Thread(target=recording_task)
    print("Camera on standby...")

def start_recording():
    print("Starting recording...")
    global recording_active, recording_thread
    if recording_thread is not None and recording_thread.is_alive():
        print("Recording already in progress.")
        return
    recording_active = True
    recording_thread = threading.Thread(target=recording_task, daemon=True)
    recording_thread.start()

def recording_task():
    filename = os.path.join(output_file_path, f"recording_{time.strftime('%Y%m%d_%H%M%S')}.mp4")
    encoder = H264Encoder(10000000)
    output = FfmpegOutput(filename, audio=False)
    picam2.start_recording(encoder, output)
    recording_start_time = time.time()
    while recording_active:
        elapsed_time = int(time.time() - recording_start_time)
        print(f'Elapsed time: {elapsed_time // 60:02}:{elapsed_time % 60:02}', end='\r', flush=True)

def stop_recording():
    global recording_active
    
    print("Stopping recording...")
    picam2.stop_recording()

    recording_active = False
    if recording_thread is not None:
        recording_thread.join()
    print("Recording stopped.")

def deinit_camera():
    global picam2
    if picam2 is not None:
        picam2.stop()
        picam2.close()
        picam2 = None
        print("Camera deinitialized.")
