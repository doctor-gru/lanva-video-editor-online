import { AbsoluteFill, Video, Series, Experimental, useVideoConfig, OffthreadVideo } from "remotion";
import Logo from "./Logo/Logo";
import AudioGram from "./AudioGram/AudioGram";
import Caption from './Caption/Caption'

function VideoComposition(inputProps) {
  const config = inputProps.config;
  const videoData = config.videoData;
  const logoData = config.logoData;
  const titleData = config.titleData;
  const audioData = config.streamData;
  const titleEnabled = config.titleStyle;
  const subTitleEnabled = config.subTitleStyle;
  const logoEnabled = config.logoStyle;
  const introData = config.introData;
  const outroData = config.outroData;
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Series>
        {(config.introOutro && introData.enabled && introData.playDuration > 0) &&
          <Series.Sequence durationInFrames={Math.trunc(introData.playDuration * 30)}>
            <OffthreadVideo src={introData.videoUrl} width={width} height={height} />
          </Series.Sequence>}
        <Series.Sequence durationInFrames={Math.trunc(videoData.durationInSeconds * 30)}>
          {subTitleEnabled && <AudioGram audioStreamData={audioData} />}
          {logoEnabled && <Logo logoData={logoData} metaData={config.videoMetadata[videoData.selectedAspectRatio]}></Logo>}
          {titleEnabled && <Caption titleData={titleData}></Caption>}
          <OffthreadVideo src={videoData.sourceVideoUrls[config.videoData.selectedAspectRatio]} />
        </Series.Sequence>
        {(config.introOutro && outroData.enabled && outroData.playDuration > 0) &&
          <Series.Sequence durationInFrames={Math.trunc(outroData.playDuration * 30)}>
            <OffthreadVideo src={outroData.videoUrl} width={width} height={height} />
          </Series.Sequence>}
      </Series>
    </AbsoluteFill>

  );
}

export default VideoComposition;
