import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { useRef, useState } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { PaginatedSubtitles } from './Subtitles';

function Vizualizer(props) {

    const data = props.audioStreamData;

    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const audioData = useAudioData(data.url);

    if (!audioData)
        return null;

    const allVisualizationValues = visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples: 256, // Use more samples to get a nicer visualisation
    });

    // Pick the low values because they look nicer than high values
    // feel free to play around :)
    const visualization = allVisualizationValues.slice(8, 30);
    const mirrored = [...visualization.slice(1).reverse(), ...visualization];

    return (
        <div className="audio-viz">
            {mirrored.map((v, i) => {
                return (
                    <div
                        key={i}
                        className="bar"
                        style={{
                            height: `${data.lineHeight * 50 * Math.sqrt(v)}%`,
                            backgroundColor: `${data.lineColor}`
                        }}
                    />
                );
            })}
        </div>
    );
};

const LINE_HEIGHT = 49;


function AudioGram(props) {

    const streamData = props.audioStreamData;
    const subtTitleData = streamData.subTitleData;
    const { height, durationInFrames } = useVideoConfig();
    const [subtitles, setSubtitles] = useState(subtTitleData.text);
    const ref = useRef(null);

    if (!subtitles) {
        return null;
    }

    return (
        <div ref={ref}>
            <AbsoluteFill>
                <Sequence from={0}>
                    <div className="container" style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        color: "white",
                        backgroundColor: "transparent"
                    }}>
                        {/* <div style={{
                            position: `absolute`,
                            left: `${streamData.audioData.gramRect.x}px`,
                            top: `${streamData.audioData.gramRect.y}px`,
                            alignItems: `${subtTitleData.subTitleStyle.alignment}`,
                            justifyContent: `${subtTitleData.subTitleStyle.alignment}`,
                            backgroundColor: `#ff0000`,
                            width: `100%`,
                        }}> */}
                        {/* <Vizualizer audioStreamData={streamData.audioData} /> */}
                        {/* </div> */}
                        <div
                            style={{
                                position: `relative`,
                                top: `${height * subtTitleData.subTitleStyle.positionY / 100}px`,
                                lineHeight: `${subtTitleData.subTitleStyle.fontSize * 1.25}px`,
                                fontSize: `${subtTitleData.subTitleStyle.fontSize}px`,
                                paddingLeft: '0px',
                                paddingRight: '0px',
                                display: "flex",
                                alignItems: `${subtTitleData.subTitleStyle.alignment}`,
                                justifyContent: `${subtTitleData.subTitleStyle.alignment}`,
                            }}
                            className="captions"
                        >
                            <PaginatedSubtitles
                                subtitles={subtitles}
                                startFrame={0}
                                endFrame={0 + durationInFrames}
                                linesPerPage={2}
                                subTitleData={subtTitleData}
                            />
                        </div>
                    </div>
                </Sequence>
            </AbsoluteFill>
        </div >
    );
};

export default AudioGram;