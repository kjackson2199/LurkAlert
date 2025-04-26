import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import VideoFileItem from "./videoFileItem";
import ControlButton from "./button";
import "./fileViewer.css";

interface VideoFile {
    key: string;
    fileName: string;
    videoLength: string;
    fileSize: number;
    fileDate: string;
}

export interface FileViewerRef {
    refreshFiles: () => void;
}

const FileViewer = forwardRef<FileViewerRef>((props, ref) => {
    const [files, setFiles] = React.useState<VideoFile[]>([]); // Adjust the type as needed
    const [loading, setLoading] = React.useState(true);

    useImperativeHandle(ref, () => ({
        refreshFiles: fetchFiles,
    }));

    const fetchFiles = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://100.100.111.72:5333/files");
            if (!response.ok) {
                throw new Error("Failed to fetch files");
            }
            const data = await response.json();
            console.log("Fetched data:", data);

            // Safe check for data.files
            if (Array.isArray(data.files)) {
                setFiles(data.files);
            } else {
                console.warn("Expected 'files' to be an array, got:", data.files);
                setFiles([]); // fallback to empty array
            }
        } catch (error) {
            console.error("Error fetching files:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div className="file-veiwer-container">
            <ControlButton buttonText="Refresh" onClick={fetchFiles} />
            <ul className="file-list">
                <li className="file-list-item">
                    <div className="file-name">File Name.mp4</div>
                    <div className="video-length">1:30</div>
                    <div className="file-date">2023-10-01</div>
                    <div className="file-size">100 MB</div>
                    <ControlButton buttonText="Download" onClick={() => console.log("Download clicked")} />
                    <ControlButton buttonText="Delete" onClick={() => console.log("Delete clicked")} />
                </li>
                <li className="file-list-item">
                    <div className="file-name">File Name.mp4</div>
                    <div className="video-length">1:30</div>
                    <div className="file-date">2023-10-01</div>
                    <div className="file-size">100 MB</div>
                    <ControlButton buttonText="Download" onClick={() => console.log("Download clicked")} />
                    <ControlButton buttonText="Delete" onClick={() => console.log("Delete clicked")} />
                </li>
            </ul>
        </div>
        // <div className="file-viewer">
        //     {/* <div>
        //         <h4>File Viewer</h4>
        //     </div> */}
        //     {/* <h4>File Viewer</h4> */}
        //     {loading ? (
        //         <p>Loading...</p>
        //     ) : files.length === 0 ? (
        //         <p>No files available</p>
        //     ) : (
        //         <ul className="file-list">
        //             {files.map((file) => (
        //                 <VideoFileItem
        //                 key={file.fileName}
        //                 fileName={file.fileName}
        //                 videoLength={file.videoLength}
        //                 fileSize={file.fileSize}
        //                 fileDate={file.fileDate}
        //                 onClick={() => console.log(`Clicked on ${file.fileName}`)}
        //                 />
        //             ))}
        //         </ul>
        //     )}
        // </div>
    );
});

export default FileViewer;