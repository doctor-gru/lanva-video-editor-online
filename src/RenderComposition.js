import React from "react";
import { Composition } from "remotion";
import VideoComposition from "./VideoComposition";
import { getInputProps } from 'remotion';
import { duration } from "@mui/material";

const RenderComposition = () => {
    const { config } = getInputProps();
    const { introOutro, introData, outroData, videoData } = config;

    const introInSeconds = introOutro && introData.enabled && introData.playDuration > 0 ? introData.playDuration : 0;
    const durationVideoInSeconds = videoData.durationInSeconds;
    const outroInSeconds = introOutro && outroData.enabled && outroData.playDuration > 0 ? outroData.playDuration : 0;

    const durationInFrames = Math.trunc(introInSeconds * 30) + Math.trunc(durationVideoInSeconds * 30) + Math.trunc(outroInSeconds * 30)

    return (
        <>
            <Composition
                id="VideoComposition"
                component={VideoComposition}
                inputProps={config}
                height={videoData.height}
                width={videoData.width}
                durationInFrames={durationInFrames}
                fps={30}
            />
        </>
    );
};

export default RenderComposition;