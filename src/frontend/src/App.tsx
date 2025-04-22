import React, { useEffect, useState} from "react";

const app: React.FC = () => {
  const [videoFrame, setVideoFrame] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5333/video_feed");
    ws.onopen = () => {
      console.log("WebSocket connection opened");
    };
    ws.onmessage = (event) => {
      const img = new Image();
      img.src = URL.createObjectURL(event.data);
      setVideoFrame(img);
    };
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    }
    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    }
    return () => {
      ws.close();
    }
  }, []);

  return(
    <div>
      <h1>Video Feed</h1>
      {videoFrame && <img src={videoFrame.src} alt="Video Frame" />}
      <p>WebSocket connection status: {videoFrame ? "Connected" : "Disconnected"}</p>
    </div>
  );
}
export default app;