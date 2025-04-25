import { clear } from 'console';
import './feedViewer.css';
import React, {useEffect, useRef, useState} from "react";

const FeedViewer: React.FC = () => {
    const [videoFrame, setVideoFrame] = useState<HTMLImageElement | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [streamTimeout, setStreamTimeout] = useState(false);
    const [reconnecting, setReconnecting] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [cameraState, setCameraState] = useState<string>("unknown");

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

      const fetchCameraState = async () => {
        try {
          const response = await fetch("http://100.100.111.72:5333/camera_state");
          const data = await response.json();
          setCameraState(data.state);
        } catch (error) {
          console.error("Error fetching camera state:", error);
          setCameraState("error");
        }
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

      useEffect(() => {
        fetchCameraState();
        const interval = setInterval(fetchCameraState, 2000);

        return () => clearInterval(interval);
      }, []);
    
    return(
        <div className="videoFeedContainder">
          {cameraState === "recording" ? (
            <div className="recording-indicator">
              Recording...
            </div>
          ) : cameraState === "stopping" ? (
            <div className="recording-indicator">
              Stopping...
            </div>
          ) : (
              videoFrame && !streamTimeout ? (
                  <img className="video" src={videoFrame.src} alt="Video Frame" style={{ borderRadius: "10px", display: "flex" }} />
              ) : (
                  <div className="video-placeholder" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      Connecting to video feed...
                  </div>
              )
          )}
        </div>
    );
}
export default FeedViewer;