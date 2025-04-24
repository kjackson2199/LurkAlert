import React from "react";
import FeedViewer from "./components/feedViewer";
import ControlButton from "./components/button";
import CameraControl from "./components/cameraControls";
import VideoFileItem from "./components/videoFileItem";
import FileViewer, { FileViewerRef } from "./components/fileViewer";
import SystemStatusViewer from "./components/systemStatusViewer";

const App: React.FC = () => {
  const fileViewerRef = React.useRef<FileViewerRef>(null);
  function handleFetchClick() {
    if (fileViewerRef.current) {
      fileViewerRef.current?.refreshFiles();
    }
  }
  return(
    <div style={{ width: "100%", maxWidth: "640", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column"}}>
      <h1>Lurk Alert</h1>
      <div style={{ display: "block", flexDirection: "column", width: "100%", height: "50vh" }}>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <FeedViewer />
            <CameraControl />
          </div>
          <div>
            <SystemStatusViewer />
          </div>
        </div>
      </div>
      <ControlButton buttonText="Refresh" onClick={handleFetchClick} />
      <FileViewer ref={fileViewerRef} />
    </div>
  );
}
export default App;