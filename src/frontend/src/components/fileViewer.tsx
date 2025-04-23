import React, { useEffect } from "react";
import VideoFileItem from "./videoFileItem";

const FileViewer: React.FC = () => {
    const [files, setFiles] = React.useState<any[]>([]); // Adjust the type as needed
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://100.100.111.72:5333/files");
                if (!response.ok) {
                    throw new Error("Failed to fetch files");
                }
                const data = await response.json();
                setFiles(data.files); // Adjust based on the actual response structure
                setLoading(false);
            } catch (error) {
                console.error("Error fetching files:", error);
                setLoading(false);
            }
        }
        fetchFiles();
    }, []);

    return (
        <div className="file-viewer">
            {/* <div>
                <h4>File Viewer</h4>
            </div> */}
            {/* <h4>File Viewer</h4> */}
            {loading ? (
                <p>Loading...</p>
            ) : files.length === 0 ? (
                <p>No files available</p>
            ) : (
                <ul className="file-list">
                    {/* <VideoFileItem fileName="example.mp4" videoLength="00:01:30" fileSize={10} fileDate="2023-10-01T12:00:00Z" onClick={() => {}} />
                    <VideoFileItem fileName="example2.mp4" videoLength="00:02:15" fileSize={20} fileDate="2023-10-02T12:00:00Z" onClick={() => {}} /> */}
                    {files.map((file, index) => (
                        <VideoFileItem
                            key={index}
                            fileName={file.name} // Adjust based on the actual file object structure
                            videoLength={file.length} // Adjust based on the actual file object structure
                            fileSize={file.size} // Adjust based on the actual file object structure
                            fileDate={file.date} // Adjust based on the actual file object structure
                            onClick={() => console.log(`Clicked on ${file.name}`)} // Replace with your click handler
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
export default FileViewer;