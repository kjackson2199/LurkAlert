from flask import Flask, Response
from flask_sock import Sock
import cv2
import camera
import controllers.camera_controller
import threading
import time
import controllers.camera_controller as camera_controller

app = Flask(__name__)
sock = Sock(app)

camera = None

def initialize_server():
    global sock
    sock = sock(app)

    camera_controller.init_camera()
    time.sleep(10)
    camera_controller.start_recording()
    time.sleep(120)
    camera_controller.stop_recording()

def main():
    try:
        initialize_server()

    except KeyboardInterrupt:
        shutdown_server()

    except SystemExit:
        shutdown_server()

    except RuntimeError as e:
        print(f"Runtime error: {e}")
        shutdown_server(1)

    except Exception as e:
        print(f"Error initializing server: {e}")
        shutdown_server(1)

@sock.route('/video_feed')
def view_camera_stream(ws):
    return "NOT IMPLEMENTED"
    # while True:
    #     feed = camera.capture_frame()
    #     if feed is None:
    #         break
    #     ws.send(feed)
    #     ws.sleep(0.1/camera.fps)

def shutdown_server(error=0):
    # camera.stop_recording()
    # camera.camera.release()
    # print("Server shut down.")
    exit(error)

import signal
signal.signal(signal.SIGINT, lambda s, f: shutdown_server())
signal.signal(signal.SIGTERM, lambda s, f: shutdown_server())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5333, threaded=True)