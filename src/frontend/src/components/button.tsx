import './button.css';
import React from "react";

interface ControlButtonProps {
    useImage?: boolean;
    imageUri?: string;
    onClick?: () => void;
}

const ControlButton: React.FC<ControlButtonProps> = ({ useImage, imageUri, onClick }) =>{
    return(
        <div className="button-container">
            <button className="control-button" onClick={onClick}>
                {useImage ? (
                    <img src={imageUri} alt="Control Button" />
                ):(
                    <span className="button-text">Control</span>
                )}
            </button>
        </div>
    )
}
export default ControlButton;