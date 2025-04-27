import React from "react";
import "./videoFileItem.css";
import ControlButton from "./button";

interface VideoFileItemProps {
    fileName: string;
    videoLength?: string;
    fileSize: number;
    fileDate: string;
    onClick: () => void;
}

const VideoFileItem: React.FC<VideoFileItemProps> = ({ fileName, videoLength, fileSize, fileDate, onClick }) => {
    const handleDownload = () => {
        const confirmation = window.confirm(`Are you sure you want to download ${fileName}?`);
        if (!confirmation) return;

        const url = `http://100.100.111.72:5333/download/${encodeURIComponent(fileName)}`;
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async () => {
        try{
            const confirmation = window.confirm(`Are you sure you want to delete ${fileName}?`);
            if (!confirmation) return;
    
            const url = `http://100.100.111.72:5333/delete/${encodeURIComponent(fileName)}`;
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete file");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <li className="file-list-item">
            <div className="file-name">{fileName}</div>
            <div className="video-length">{videoLength}</div>
            <div className="file-date">{new Date(fileDate).toLocaleString()}</div>
            <div className="file-size">{fileSize}</div>
            <ControlButton buttonText="Download" onClick={handleDownload} />
            <ControlButton buttonText="Delete" onClick={handleDelete} />
        </li>
        // <li className="video-file-item" onClick={onClick}>
        //     {/* <label><input type="checkbox" /></label> */}
        //     <div className="video-file-name">{fileName}</div>
        //     <div className="video-file-length">{videoLength}</div>
        //     <div className="video-file-date">{new Date(fileDate).toLocaleString()}</div>
        //     <div className="video-file-size">{fileSize} MB</div>
        //     <button className="download-button" onClick={handleDownload}>Download</button>
        //     <button className="delete-button" onClick={handleDelete}>Delete</button>
        // </li>
    );
}
export default VideoFileItem;