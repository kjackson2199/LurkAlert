import threading
import queue
# from controllers.camera import camera

class CameraCommandProcessor:
    def __init__(self, camera):
        self.camera = camera
        self.command_queue = queue.Queue()
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()
    
    def _run(self):
        while True:
            command = self.command_queue.get()
            if command == "start":
                self.camera.start_recording()
            elif command == "stop":
                self.camera.stop_recording()
            self.command_queue.task_done()
    
    def send_command(self, command):
        self.command_queue.put(command)