import React, { useState } from "react";
import CameraButtonImg from "../../resources/images/camera.svg";
import CameraButtonOffImg from "../../resources/images/cameraOff.svg";
import * as webRTCHandler from "../../utils/webRTCHandler";

const CameraButton = () => {
    const [isLocalVideoDisabled, setIsLocalVideoDisabled] = useState(false);

    const handleCameraButtonPressed = () => {
        webRTCHandler.toggleCamera(isLocalVideoDisabled);
        setIsLocalVideoDisabled(!isLocalVideoDisabled);
    };

    return (
        <div className="video_button_container">
            <img
                src={isLocalVideoDisabled ? CameraButtonOffImg : CameraButtonImg}
                onClick={handleCameraButtonPressed}
                className={
                    isLocalVideoDisabled ? "off video_button_image" : "video_button_image"
                }
                alt="camera"
            />
        </div>
    );
};

export default CameraButton;
