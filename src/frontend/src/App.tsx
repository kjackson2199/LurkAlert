import React from "react";
import FeedViewer from "./components/feedViewer";
import ControlButton from "./components/button";
import CameraControl from "./components/cameraControls";
import VideoFileItem from "./components/videoFileItem";
import FileViewer, { FileViewerRef } from "./components/fileViewer";
import SystemStatusViewer from "./components/systemStatusViewer";
import LurkPage from "./containers/lurkPage";

const App: React.FC = () => {
  return(
    <div>
      <h1>Lurk Alert</h1>
      <LurkPage />
      {/* <div className="content-wrapper">
        <div className="left-pane">
          <FeedViewer />
          <CameraControl />
          <CameraControl />
          <CameraControl />
        </div>

        <div className="right-pane">
          <SystemStatusViewer />
          <ControlButton buttonText="Refresh" onClick={handleFetchClick} />
          <FileViewer ref={fileViewerRef} />
        </div>
      </div> */}
    </div>
  );
}
export default App;