import React from "react";
import ControlButton from "./button";

const CameraControl: React.FC = () => {
    const [isRecording, setIsRecording] = React.useState(false);
    const [isTakingPhoto, setIsTakingPhoto] = React.useState(false);

    const handleRecordClick = async () => {
        try{
            const recordCommand: string = isRecording ? "stop" : "start";
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

            setIsRecording(!isRecording);
            
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return(
        <div>
            <ControlButton buttonText={isRecording ? ("Stop"):("Start")} useImage={false} imageUri="" onClick={handleRecordClick} />
        </div>
    );
};

export default CameraControl;