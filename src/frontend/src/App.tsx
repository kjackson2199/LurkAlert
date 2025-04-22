import React from "react";
import FeedViewer from "./components/feedViewer";
import ControlButton from "./components/button";

const App: React.FC = () => {
  return(
    <div>
      <h1>Lurk Alert</h1>
      <FeedViewer />
      <ControlButton useImage={false} imageUri="" onClick={() => console.log("Button clicked")} />
      <ControlButton useImage={false} imageUri="" onClick={() => console.log("Button clicked")} />
      <ControlButton useImage={false} imageUri="" onClick={() => console.log("Button clicked")} />
    </div>
  );
}
export default App;