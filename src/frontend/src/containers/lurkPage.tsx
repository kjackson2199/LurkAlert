import React from "react";
import "./styles/lurkPage.css"
import FeedViewer from "../components/feedViewer";
import ControlButton from "../components/button";
import CameraControl from "../components/cameraControls";
import VideoFileItem from "../components/videoFileItem";
import FileViewer, { FileViewerRef } from "../components/fileViewer";
import SystemStatusViewer from "../components/systemStatusViewer";

const LurkPage: React.FC = () => {
    const fileViewerRef = React.useRef<FileViewerRef>(null);
        function handleFetchClick() {
            if (fileViewerRef.current) {
                fileViewerRef.current?.refreshFiles();
            }
        }
    return(
        <div className="page-container">
            <div className="content-wrapper">
                <div className="left-pane">
                    <FeedViewer />
                    <CameraControl />
                </div>
                <div className="right-pane">
                    <SystemStatusViewer />
                </div>
                {/* <ControlButton buttonText="Refresh" onClick={handleFetchClick} /> */}
                {/* <FileViewer ref={fileViewerRef} /> */}
            </div>
        </div>
    )
}
export default LurkPage;