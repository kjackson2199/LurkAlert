import React from "react";
import "./videoFileItem.css";

interface VideoFileItemProps {
    fileName: string;
    videoLength?: string;
    fileSize: number;
    fileDate: string;
    onClick: () => void;
}

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

    return (
        <li className="video-file-item" onClick={onClick}>
            <label><input type="checkbox" /></label>
            <div className="video-file-name">{fileName}</div>
            <div className="video-file-length">{videoLength}</div>
            <div className="video-file-date">{new Date(fileDate).toLocaleString()}</div>
            <div className="video-file-size">{fileSize} MB</div>
            <div>
                <button className="download-button" onClick={handleDownload}>Download</button>
            </div>
        </li>
    );
}
export default VideoFileItem;