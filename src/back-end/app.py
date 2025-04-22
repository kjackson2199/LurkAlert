from flask import Flask, Response
from flask_sock import Sock
import threading
import time
import signal
import sys
import cv2

from controllers.camera import camera

app = Flask(__name__)
sock = Sock(app)

def initialize_server():
    pass

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
    print("Client connected to /video_feed")
    try:
        while True:
            if ws.closed:
                break

            frame = camera.capture_frame()
            ret, jpeg = cv2.imencode('.jpg', frame)
            if not ret:
                continue

            ws.send(jpeg.tobytes())
            time.sleep(1.0/20) # ~20 FPS
    except Exception as e:
        print(f"Error in video stream: {e}")
    finally:
        print("Client disconnected")

@app.route("/")
def index():
    return Response(open('index.html').read(), mimetype='text/html')

def shutdown_server(error=0):
    exit(error)

import signal
signal.signal(signal.SIGINT, lambda s, f: shutdown_server())
signal.signal(signal.SIGTERM, lambda s, f: shutdown_server())

if __name__ == '__main__':
    # main()
    app.run(host='0.0.0.0', port=5333, threaded=True)
    # from controllers.camera import camera
    # camera.start_recording()
    # time.sleep(30 * 60)
    # camera.stop_recording()
    # time.sleep(5)
    # camera.release()