from flask import Flask, Response, request, jsonify, send_from_directory
from flask_sock import Sock
from flask_cors import cross_origin, CORS

import threading
import time
import signal
import sys
import cv2
import requests

from controllers.camera import camera
from controllers.camera_command_processor import CameraCommandProcessor
camera_thread = CameraCommandProcessor(camera)

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
sock = Sock(app)
CORS(app, supports_credentials=True)

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

@app.route("/record", methods=['POST', 'OPTIONS'])
@cross_origin(origins="*")
def record():
    response = {'method':'/record'}

    data = request.get_json()
    start = data.get('record')
    print(f"Recieved JSON: {data}")
    if start == "start":
        camera_thread.send_command('start')
        response['message'] = "Requested start recording"
    else:
        camera_thread.send_command('stop')
        response['message'] = "Requested stop recording"
    
    return jsonify(response)

@sock.route('/video_feed')
def view_camera_stream(ws):
    print("Client connected to /video_feed")
    try:
        while True:
            frame = camera.capture_frame()
            if frame is None:
                time.sleep(0.1)
                continue
            
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
    return send_from_directory(app.static_folder, "index.html")

def shutdown_server(error=0):
    print("Shutting down camera...")
    camera.stop_recording()
    camera.release()
    print("Exiting server...")
    exit(error)

import signal
signal.signal(signal.SIGINT, lambda s, f: shutdown_server())
signal.signal(signal.SIGTERM, lambda s, f: shutdown_server())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5333, threaded=True)
    # camera.start_recording()
    # time.sleep(20)
    # camera.stop_recording()
    # camera.release()