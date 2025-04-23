import React from "react";
import FeedViewer from "./components/feedViewer";
import ControlButton from "./components/button";
import CameraControl from "./components/cameraControls";
import VideoFileItem from "./components/videoFileItem";
import FileViewer from "./components/fileViewer";

const App: React.FC = () => {
  return(
    <div style={{ width: "100%", height: "100%", maxWidth: "640", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column"}}>
      <h1>Lurk Alert</h1>
      {/* <VideoFileItem videoLength="1:40" fileName="FILENAME.mp4" fileSize={100} fileDate="05/23/1765" onClick={() => {}} /> */}
      <FileViewer />
      {/* <FeedViewer /> */}
      {/* <CameraControl /> */}
    </div>
  );
}
export default App;