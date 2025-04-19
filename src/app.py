from flask import Flask, Response
import cv2
import camera

app = Flask(__name__)

def capture_frames():
    while True:
        frame_data = camera.get_frame()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_data + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(capture_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

def index():
    return '''
    <html>
        <head><title>Lurk Alert Cam</title></head>
        <body>
            <h1>Live Stream</h1>
            <img src="/video_feed" width="640" height="480">
        </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True)