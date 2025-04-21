import time
import numpy as np
import os
import threading


from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FfmpegOutput

picam2 = Picamera2()
video_res = (2028,1080)
mode = picam2.sensor_modes[1]
video_config = picam2.create_video_configuration(
    sensor={'output_size': mode['size'], 'bit_depth': mode['bit_depth']},
    main={"format": 'RGB888', "size": video_res}
)

picam2.configure(video_config)
print("Starting camera...")

picam2.start()
time.sleep(2)

output_file_path = "/home/lurk/recordings"
recording = False

def start_recording():
    print("Starting camera recording...")
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(output_file_path, f"recording{timestamp}.mp4")
    encoder = H264Encoder(10000000)
    output = FfmpegOutput(filename, audio=False)
    picam2.start_recording(encoder, output)
    print("Recording...", end='\r', flush=False)
    global recording
    recording = True

    elapsed_time_thread = threading.Thread(target=recording_time_elapsed_task, args=(time.time(),))
    elapsed_time_thread.daemon = True
    elapsed_time_thread.start()

def stop_recording():
    print("Stopping the recording...", end='\r', flush=True)

    global recording
    recording = False
    picam2.stop_recording()
    picam2.stop()
    print("Recording stopped.")

def recording_time_elapsed_task(start_time):
    while recording:
        elapsed_time = int(time.time() - start_time)
        print(f'Recording...Elapsed Time: {elapsed_time // 60:02}:{elapsed_time % 60:02}', end='\r', flush=True)
        time.sleep(0.1)

start_recording()
time.sleep(30)
stop_recording()
picam2.stop()