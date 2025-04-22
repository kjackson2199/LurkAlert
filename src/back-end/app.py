from flask import Flask, Response, request, jsonify
from flask_sock import Sock
from flask_cors import cross_origin

import threading
import time
import signal
import sys
import cv2
import requests

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

app.route("/record", methods=['POST'])
@cross_origin()
def record():
    response = {'method':'/record'}

    data = request.get_json()
    start = data.get('record')
    if start == "true":
        response['message'] = camera.start_recording()
    else:
        response['message'] = camera.stop_recording()
    
    return jsonify(response)

@sock.route('/video_feed')
def view_camera_stream(ws):
    print("Client connected to /video_feed")
    try:
        while True:
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