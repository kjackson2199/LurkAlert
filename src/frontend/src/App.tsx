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
      {/* <h1>Lurk Alert</h1> */}
      <LurkPage />
    </div>
  );
}
export default App;