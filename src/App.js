import "./App.css";
import { useState, useEffect } from "react";
import Configurator from "./configurators/Configurator";
import OutputPreview from "./OutputPreview";
import { getVideoMetadata } from "@remotion/media-utils";
import { Config } from "remotion";

const INITIAL_CONFIG = {
  logoStyle: false,
  subTitleStyle: true,
  titleStyle: true,
  introOutro: false,
  videoMetadata: {},
  introData: {
    enabled: false,
    metadataLoaded: false,
    videoUrl: '',
    duration: 0,
  },
  outroData: {
    enabled: false,
    metadataLoaded: false,
    videoUrl: '',
    duration: 0,
  },
  videoData: {
    isRendering: false,
    selectedAspectRatio: "",
    metadataLoaded: false,
    sourceVideoUrls: {},
    width: 0,
    height: 0,
    aspectRatio: 0,
    videoStyle: {
      positionX: 0,
      positionY: 0,
      scaleFactor: 1,
    },
  },
  logoData: {
    logoRect: {
      _width: 60,
      _height: 60,
      objectFit: `contain`,
    },
    logoStyle: {
      url: "",
      positionX: 0,
      positionY: 0,
      scaleFactor: 6,
    },
  },
  titleData: {
    titleStyle: {
      alignment: "center",
      bold: true,
      italic: false,
      underline: false,
      fontName: "Helvetica",
      fontSize: 50,
      textColor: "#ffffff",
      scaleFactor: 1,
      positionY: 8,
      title: "",
    },
  },
  streamData: {
    audioData: {
      url: "",
      startOffset: 0,
      length: 0,
      lineColor: "#fcc203",
      lineHeight: 25,
      gramRect: {
        x: 0,
        y: 450,
        width: 300,
        height: 20,
        objectFit: "contain",
      },
    },
    subTitleData: {
      // https://res.cloudinary.com/dbo8l90u9/raw/upload/v1687605649/pwccjn5y0lxg2sy5icoo.srt
      text: "",
      subTitleStyle: {
        alignment: "center",
        bold: false,
        italic: false,
        underline: false,
        fontName: "Helvetica",
        fontSize: 36,
        fontWeight: "normal",
        textColor: "#ffffff",
        positionX: 0,
        positionY: 76,
        scaleFactor: 1,
      },
    },
  },
};

const testConfig = {
  "logoStyle": false, "subTitleStyle": true, "titleStyle": true, "introOutro": false,
  "introData": {
    "enabled": false,
    "videoUrl": '',
    "duration": 0,
  },
  "outroData": {
    "enabled": false,
    "videoUrl": '',
    "duration": 0,
  },
  "videoMetadata": { "16:9": { "durationInSeconds": 14.681333, "width": 1280, "height": 720, "aspectRatio": 1.7777777777777777, "isRemote": true }, "9:16": { "durationInSeconds": 14.681333, "width": 404, "height": 720, "aspectRatio": 0.5611111111111111, "isRemote": true } }, "videoData": { "isRendering": false, "selectedAspectRatio": "16:9", "metadataLoaded": true, "sourceVideoUrls": { "16:9": "https://res.cloudinary.com/dbo8l90u9/video/upload/v1689304840/uou6ululi7gdofffxkpe.mp4", "9:16": "https://res.cloudinary.com/dbo8l90u9/video/upload/v1689304840/uou6ululi7gdofffxkpe.mp4" }, "width": 1280, "height": 720, "aspectRatio": 1.7777777777777777, "videoStyle": { "positionX": 0, "positionY": 0, "scaleFactor": 1 }, "durationInSeconds": 14.681333, "isRemote": true }, "logoData": { "logoRect": { "_width": 60, "_height": 60, "objectFit": "contain" }, "logoStyle": { "url": "http://res.cloudinary.com/dbo8l90u9/image/upload/v1689280775/wzrotwzwnivtq5yftstp.jpg", "positionX": 0, "positionY": 20, "scaleFactor": 10 } }, "titleData": { "titleStyle": { "alignment": "right", "bold": true, "italic": false, "underline": false, "fontName": "Futura, Didact Gothic", "fontSize": "150", "textColor": "#ffffff", "scaleFactor": 1, "positionY": 8, "title": "Alex 4:40" } }, "streamData": { "audioData": { "url": "", "startOffset": 0, "length": 0, "lineColor": "#fcc203", "lineHeight": 25, "gramRect": { "x": 0, "y": 450, "width": 300, "height": 20, "objectFit": "contain" } }, "subTitleData": { "text": "1\n00:00:00,090 --> 00:00:01,022\nFor those of you too young,\n\n2\n00:00:01,076 --> 00:00:01,918\ncheck out the movie The\n\n3\n00:00:01,924 --> 00:00:03,566\nMatrix, if you don't get that\n\n4\n00:00:03,588 --> 00:00:05,779\nreference. And all of a\n\n5\n00:00:06,279 --> 00:00:06,782\nsudden, I could now look\n\n6\n00:00:06,836 --> 00:00:08,110\nbackwards and say, like, oh,\n\n7\n00:00:08,180 --> 00:00:09,838\nall these patterns that I see,\n\n8\n00:00:09,924 --> 00:00:11,386\nall these things that I can't\n\n9\n00:00:11,418 --> 00:00:13,102\nexplain in my life really are\n\n10\n00:00:13,156 --> 00:00:14,090\nstory driven.\n\n", "subTitleStyle": { "alignment": "center", "bold": false, "italic": false, "underline": false, "fontName": "Gill Sans, Work Sans", "fontSize": "49", "fontWeight": "normal", "textColor": "#ff0000", "positionX": 0, "positionY": 76, "scaleFactor": 1 } } }, "uniqueId": "1689225161472x500814245135122400"
}

function App() {

  const [config, setConfig] = useState(INITIAL_CONFIG);


  const loadMetaData = async (config) => {
    const { videoData } = config;
    const { selectedAspectRatio, sourceVideoUrls } = videoData;

    if (
      !selectedAspectRatio ||
      !sourceVideoUrls ||
      !Object.keys(sourceVideoUrls).length
    ) {
      return config;
    }

    let newConfig = { ...config };

    for (const aspectRatio in sourceVideoUrls) {
      try {
        newConfig.videoMetadata[aspectRatio] = await getVideoMetadata(
          sourceVideoUrls[aspectRatio]
        );
      } catch (error) {
        console.error("Failed to load video metadata:", error);
        return config;
      }
    }

    return {
      ...newConfig,
      videoData: {
        ...videoData,
        ...newConfig.videoMetadata[selectedAspectRatio],
        metadataLoaded: true,
      },
    };
  };

  const loadConfiguration = async () => {
    const {
      sourceVideoUrl,
      selectedRatio,
      captionText,
      headlineText,
      isRendering = false,
      uniqueId,
      isDev,
    } = window.lveData || {};

    let sourceVideoUrls = {};
    try {
      sourceVideoUrls =
        typeof sourceVideoUrl === "string"
          ? JSON.parse(sourceVideoUrl)
          : sourceVideoUrl || {};
    } catch {
      // handle the error if you need to
    }

    const selectedAspectRatio =
      selectedRatio || Object.keys(sourceVideoUrls)[0] || "";

    const newConfig = {
      ...config,
      videoData: {
        ...config.videoData,
        selectedAspectRatio,
        sourceVideoUrls,
        isRendering,
      },
      streamData: {
        ...config.streamData,
        subTitleData: {
          ...config.streamData?.subTitleData,
          text: captionText,
        },
      },
      titleData: {
        ...config.titleData,
        titleStyle: {
          ...config.titleData.titleStyle,
          title: headlineText,
        },
      },
      uniqueId,
      isDev
    };

    setConfig(await loadMetaData(newConfig));
  };

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#F4F4F4",
        }}
      >
        <button
          style={{ display: "none" }}
          id="btnInitialize"
          onClick={loadConfiguration}
        />
        <>
          <Configurator handleConfigChange={setConfig} config={config} />
          <OutputPreview handleConfigChange={setConfig} config={config} />
        </>
      </div>
    </div>
  );
}

export default App;
