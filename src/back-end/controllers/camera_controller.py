import cv2
import numpy as np
import os
import time
import lurk_camera as cam

class CameraController:
    def __init__(self, cameraNumber:int, fps=20.0, stop_recording_time_buffer=30):
        self.fourcc = cv2.VideoWriter.fourcc(*'mp4v')
        self.fps = fps
        self.camera = cam.Camera()
        self.output_file_path = os.getenv("RECORDING_FILE_PATH")
        print(f"Recording file path: {self.output_file_path}")
        if not self.output_file_path or not os.path.isdir(self.output_file_path):
            raise ValueError("Invalid or missing RECORDING_FILE_PATH environment variable.")
        
        self.motion_detected = False
        self.recording_start_time = 0
        self.no_motion_start_time = 0
        self.stop_recording_time_buffer = stop_recording_time_buffer # How many seconds to wait before stopping the recording once motion is no longer detected

        self.fgfb = cv2.createBackgroundSubtractorMOG2(detectShadows=True)

        self.camera.start()
    
    def capture_frame(self):
        frame = self.camera.read()
        
        ret, buffer = cv2.imencode('.jpg', frame)
        if not ret:
            return 
        
        if self.motion_detected:
            if not hasattr(self, 'video_writer'):
                self.start_recording()
            self.video_writer.write(frame)
            self.recording_start_time = time.time()
        
        return buffer.tobytes()
    
    def start_recording(self):
        if hasattr(self, 'video_writer'):
            return
        width = int(self.camera.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(self.camera.get(cv2.CAP_PROP_FRAME_HEIGHT))
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = os.path.join(self.output_file_path, f"recording_{timestamp}.mp4")
        self.video_writer = cv2.VideoWriter(filename, self.fourcc, self.fps, (width, height))
        if not self.video_writer.isOpened():
            raise RuntimeError("Failed to open video writer. Recording stopped.")
    
    def stop_recording(self):
        if hasattr(self, 'video_writer'):
            self.video_writer.release()
            del self.video_writer
        else:
            return
        
    def detect_motion(self):
        success, frame = self.camera.read()
        if not success:
            return None
        
        fgmask = self.fgfb.apply(frame)
        
        # Optional: Apply some morphological operations to clean up the mask
        kernel = np.ones((5, 5), np.uint8)
        fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, kernel)
        fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_CLOSE, kernel)
        
        return fgmask
    
    def test_recording(self):
        recording_time = 60  # seconds
        start_time = time.time()
        while time.time() - start_time < recording_time:
            print("Recording...")
            frame = self.camera.read()
            if frame is None:
                break
            
            if not hasattr(self, 'video_writer'):
                self.start_recording()
            
            self.video_writer.write(frame)
        
        print("Stopping recording...")
        self.stop_recording()
    
    def camera_motion_detect_task(self):
        try:
            while True:
                fgmask = self.detect_motion()
                if fgmask is None:
                    self.no_motion_start_time = time.time()
                    if self.recording_start_time and (time.time() - self.recording_start_time) > self.stop_recording_time_buffer:
                        self.stop_recording()
                        self.motion_detected = False
                        self.recording_start_time = 0
                    time.sleep(0.1)
                    continue
                
                self.motion_detected = True
                self.no_motion_start_time = 0
                self.start_recording()
                time.sleep(1.0/self.fps)
        
        except Exception as e:
            print(f"Error in camera motion detection: {e}")
            self.stop_recording()
            self.camera.release()
        except KeyboardInterrupt:
            print("Keyboard interrupt detected. Stopping camera motion detection.")
            self.stop_recording()
            self.camera.release()
        except SystemExit:
            print("System exit detected. Stopping camera motion detection.")
            self.stop_recording()
            self.camera.release()
        except RuntimeError as e:
            print(f"Runtime error: {e}")
            self.stop_recording()
            self.camera.release()
        finally:
            self.stop_recording()
            self.camera.release()
            print("Camera motion detection stopped.")
