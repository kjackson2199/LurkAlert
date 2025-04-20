import React from "react";
import { text } from "stream/consumers";

export default function CameraViewer() {
    return (
        <div style={styles.container}>
            <h2>Lurk Feed</h2>
            <div style={styles.videoContainer}></div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        textAlign: "center",
        padding: "20px",
    },
    videoContainer: {
        width: "640px",
        height: "480px",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "#000",
        margin: "0 auto",
    },
};