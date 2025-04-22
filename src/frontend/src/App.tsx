import React from "react";
import FeedViewer from "./components/feedViewer";
import ControlButton from "./components/button";
import CameraControl from "./components/cameraControls";

const App: React.FC = () => {
  return(
    <div>
      <h1>Lurk Alert</h1>
      <FeedViewer />
      <CameraControl />
    </div>
  );
}
export default App;