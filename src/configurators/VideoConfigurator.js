import React from "react";
import UploadFile from "./UploadFile";

const VideoConfigurator = ({ onConfigChange, config }) => {
    return (
        <UploadFile fileType={0} onConfigChange={(updatedValue) => onConfigChange({
            ...config,
            url: updatedValue
        })} config={config.url}></UploadFile>
    );
};

export default VideoConfigurator;