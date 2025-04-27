import React, { useEffect } from "react";
import ControlButton from "./button";
import "./cameraControls.css";

const CameraControl: React.FC = () => {
    const [isRecording, setIsRecording] = React.useState(false);
    const [isTakingPhoto, setIsTakingPhoto] = React.useState(false);
    const [cameraState, setCameraState] = React.useState<string>("unknown");

    useEffect(() => {
        handleCheckCameraStatus();
        const interval = setInterval(() => {
            handleCheckCameraStatus();
        }, 5000); // Check every 5 seconds
        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleRecordClick = async () => {
        try{
            const recordCommand: string = isRecording || cameraState === "recording" ? "stop" : "start";
            const response = await fetch("http://100.100.111.72:5333/record", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ record: recordCommand }),
            });

            if (!response.ok) {
                throw new Error("Failed to start recording");
            }

            await handleCheckCameraStatus();
            setIsRecording(!isRecording);
            
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleCheckCameraStatus = async () => {
        try{
            const url = `http://100.100.111.72:5333/camera_state`;
            const data = await fetch(url);
            const jsonData = await data.json();
            setCameraState(jsonData.state);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return(
        <div className="control-panel">
            {cameraState === "stopping" || cameraState === "starting" ? null 
            : cameraState === "idle" || !isRecording ? (
                <ControlButton buttonText="Start Recording" useImage={false} imageUri="" onClick={handleRecordClick} />
            ) : cameraState === "recording" || isRecording ? (
                <ControlButton buttonText="Stop Recording" useImage={false} imageUri="" onClick={handleRecordClick} />
            ) : (
                <p>Camera state unknown</p>
            )}
        </div>
    );
};

export default CameraControl;