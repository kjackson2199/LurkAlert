import React from "react";
import "./videoFileItem.css";

interface VideoFileItemProps {
    fileName: string;
    videoLength?: string;
    fileSize: number;
    fileDate: string;
    onClick: () => void;
}

const VideoFileItem: React.FC<VideoFileItemProps> = ({ fileName, videoLength, fileSize, fileDate, onClick }) => {
    return (
        <li className="video-file-item" onClick={onClick}>
            <label><input type="checkbox" /></label>
            <div className="video-file-name">{fileName}</div>
            <div className="video-file-length">{videoLength}</div>
            <div className="video-file-date">{new Date(fileDate).toLocaleString()}</div>
            <div className="video-file-size">{fileSize} MB</div>
        </li>
    );
}
export default VideoFileItem;