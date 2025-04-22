import './feedViewer.css';
import React, {useEffect, useRef, useState} from "react";

const FeedViewer: React.FC = () => {
    const [videoFrame, setVideoFrame] = useState<HTMLImageElement | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [streamTimeout, setStreamTimeout] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const setupWebSocket = () => {
        const ws = new WebSocket("ws://100.100.111.72:5333/video_feed");
        wsRef.current = ws;
    
        ws.onopen = () => {
          console.log("WebSocket connection opened");
          setIsConnected(true);
          setReconnecting(false);
        };
    
        ws.onmessage = (event) => {
          const img = new Image();
          img.src = URL.createObjectURL(event.data);
          setVideoFrame(img);
          setStreamTimeout(false);
    
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            setStreamTimeout(true);
            setVideoFrame(null);
            console.warn("Video stream timeout");
          }, 5000);
        };
    
        ws.onclose = () => {
          console.log("WebSocket connection closed");
          setIsConnected(false);
          setReconnecting(true);
        };
    
        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
          setReconnecting(true);
        };
      };
    
      // Attempt reconnect loop
      useEffect(() => {
        if (!isConnected && reconnecting && !reconnectIntervalRef.current) {
          reconnectIntervalRef.current = setInterval(() => {
            console.log("Attempting to reconnect...");
            setupWebSocket();
          }, 3000); // try every 3 seconds
        }
    
        if (isConnected && reconnectIntervalRef.current) {
          clearInterval(reconnectIntervalRef.current);
          reconnectIntervalRef.current = null;
        }
      }, [isConnected, reconnecting]);
    
      useEffect(() => {
        setupWebSocket();
    
        return () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          if (reconnectIntervalRef.current) clearInterval(reconnectIntervalRef.current);
          wsRef.current?.close();
        };
      }, []);
    
      const handleManualReconnect = () => {
        console.log("Manually reconnecting...");
        setReconnecting(true);
        setupWebSocket();
      };
    
    return(
        <div className="videoFeedContainder">
            {videoFrame && !streamTimeout ? (
                <img className="video" src={videoFrame.src} alt="Video Frame" style={{ width: "640px", height: "360px", borderRadius: "10px", display: "flex" }} />
            ) : (
                <div className="video-placeholder" style={{ width: "640px", height: "360px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    Connecting to video feed...
                </div>
            )}
        </div>
    );
}
export default FeedViewer;