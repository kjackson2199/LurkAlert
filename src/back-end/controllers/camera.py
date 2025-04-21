import sys
import time
import threading
import os

from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FfmpegOutput

class CameraManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CameraManager, cls).__new__(cls)
            cls._instance._init_camera()
        return cls._instance

    def _init_camera(self):
        self.picam2 = Picamera2()
        video_res = (2028, 1080)
        mode = self.picam2.sensor_modes[1]
        video_config = self.picam2.create_video_configuration(
            sensor={'output_size': mode['size'], 'bit_depth': mode['bit_depth']},
            main={"format": 'RGB888', "size": video_res}
        )
        self.picam2.configure(video_config)
        print("Starting camera...")
        self.picam2.start()
        time.sleep(2)
        self.recording = False
        self.output_file_path = "/home/lurk/recordings"

    def start_recording(self):
        if self.recording:
            print("Already recording.")
            return
        print("Starting camera recording...")
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(self.output_file_path, f"recording_{timestamp}.mp4")
        encoder = H264Encoder(10000000)
        output = FfmpegOutput(filename, audio=False)
        self.picam2.start_recording(encoder, output)
        print("Recording...", end='\r', flush=True)
        self.recording = True

        self._start_time = time.time()
        self._elapsed_time_thread = threading.Thread(
            target=self._recording_time_elapsed_task, daemon=True
        )
        self._elapsed_time_thread.start()

    def stop_recording(self):
        if not self.recording:
            return
        sys.stdout.write('\033[2K\r')
        sys.stdout.write(f"Stopping the recording...\n")
        sys.stdout.flush()

        self.recording = False
        self.picam2.stop_recording()
        sys.stdout.write('\033[2K\r')
        sys.stdout.write(f"Recording stopped.\n")
        sys.stdout.flush()

    def _recording_time_elapsed_task(self):
        while self.recording:
            elapsed_time = int(time.time() - self._start_time)
            print(f'Recording...Elapsed Time: {elapsed_time // 60:02}:{elapsed_time % 60:02}', end='\r', flush=True)
            time.sleep(0.1)

    def capture_frame(self):
        return self.picam2.capture_array()

    def release(self):
        if self.picam2:
            self.picam2.stop()

# Global singleton instance for convenience (optional)
camera = CameraManager()
