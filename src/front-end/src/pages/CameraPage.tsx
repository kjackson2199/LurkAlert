import React from "react";

export default function CameraPage() {
  return (
    <div>
      <h1>Lurk View</h1>
      <img
        src="http://localhost:5333/video_feed_test"
        alt="Live Camera"
        style={{ width: "100%", maxWidth: "640", borderRadius: "10px" }}
      />
    </div>
  );
}