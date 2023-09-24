import React from "react";
import { Player } from "@remotion/player";
import VideoComposition from "./VideoComposition";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { makeStyles } from "@mui/styles";
import { useState, useRef, useEffect } from "react";
import ExportVideoService from "./Services/ExportVideoService";
import BoltIcon from "@mui/icons-material/Bolt";

const useStyles = makeStyles(() => ({
  rightSideContainer: {
    flex: 1,
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    borderRadius: "10px",
    backgroundColor: "#fff",
    margin: "20px",
    boxShadow: "2px 2px 4px 2px rgba(63, 63, 63, 0.1) !important",
  },
  exportButtonContainer: {
    marginLeft: "30px",
    marginRight: "45px",
    flexDirection: "row",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  controlContainer: {
    marginLeft: "30px",
    marginRight: "30px",
    flexDirection: "row",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  typography: {
    fontWeight: "700 !important",
    fontSize: "20px !important",
    color: "#3F3F3F !important",
    marginBottom: "0px !important",
  },
  buttonContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "flex-end",
    width: "100%",
    paddingRight: "0px !important",
  },
  activeButton: {
    fontWeight: "500 !important",
    fontSize: "16px !important",
    textAlign: "center !important",
    color: "#FFFFFF !important",
    backgroundColor: "#303030 !important",
    borderRadius: "8px !important",
    padding: "8px !important",
    margin: "0 8px !important",
    "&:hover": {
      border: "1px solid #303030 !important",
      backgroundColor: "#303030 !important",
    },
  },
  inactiveButton: {
    fontWeight: "500 !important",
    fontSize: "16px !important",
    textAlign: "center !important",
    color: "#5F5F5F !important",
    backgroundColor: "none !important",
    borderRadius: "8px !important",
    padding: "8px !important",
    margin: "0 8px !important",
    border: "1px solid #DBDBDB !important",
    "&:hover": {
      border: "1px solid #DBDBDB !important",
      backgroundColor: "#DBDBDB !important",
    },
  },
  videoContainer: {
    display: "flex",
    flex: 1,
    margin: "20px",
    // minHeight: "546px",
    borderRadius: "5px",
    // backgroundColor: "black",
    border: "1px solid #F8F8F8",
  },
  exportVideoButton: {
    width: "150px",
    fontWeight: "500 !important",
    fontSize: "16px !important",
    textAlign: "center !important",
    color: "#FFFFFF !important",
    backgroundColor: "#6558F5 !important",
    borderRadius: "8px !important",
    padding: "8px !important",
    textTransform: "none !important",
    "&:hover": {
      backgroundColor: "#6558F5 !important",
    },
  },
  exportVideoButtonDisabled: {
    width: "150px",
    fontWeight: "500 !important",
    fontSize: "16px !important",
    textAlign: "center !important",
    color: "#FFFFFF !important",
    backgroundColor: "#707070 !important",
    borderRadius: "8px !important",
    padding: "8px !important",
    textTransform: "none !important",
    "&:hover": {
      backgroundColor: "#6558F5 !important",
    },
  },
}));

const OutputPreview = ({ handleConfigChange, config }) => {

  const classes = useStyles();

  const playerRef = useRef();

  const [scaleType, setScaleType] = useState(
    config.videoData.selectedAspectRatio
  );
  const [snackOpen, setSnackOpen] = useState(false);
  const [isExportingVideo, setExportingVideo] = useState(false);

  const { introOutro, introData, outroData, videoData } = config;

  const introInSeconds = introOutro && introData.enabled && introData.playDuration > 0 ? introData.playDuration : 0;
  const durationVideoInSeconds = videoData.durationInSeconds;
  const outroInSeconds = introOutro && outroData.enabled && outroData.playDuration > 0 ? outroData.playDuration : 0;

  const durationInFrames = Math.trunc(introInSeconds * 30) + Math.trunc(durationVideoInSeconds * 30) + Math.trunc(outroInSeconds * 30)

  const handleSeekTo = (value) => {
    playerRef.current.seekTo(value);
  };

  const handleScaleTypeChange = (newScaleType) => {
    if (newScaleType !== scaleType) {
      setScaleType(newScaleType);

      handleConfigChange({
        ...config,
        videoData: {
          ...config.videoData,
          ...config.videoMetadata[newScaleType],
          selectedAspectRatio: newScaleType,
        },
      });
    }
  };

  const handleOpen = () => {
    setSnackOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const handleExportVideo = () => {
    setExportingVideo(true);

    handleConfigChange({
      ...config,
      videoData: {
        ...config.videoData,
        isRendering: true,
      },
    });

    ExportVideoService.exportVideo(config);
    handleOpen();
  };

  useEffect(() => {
    if (durationInFrames > 0)
      handleSeekTo(0);
  }, [config.introData, config.outroData, config.introOutro])

  const isShortHeight = useMediaQuery("(max-height:449px)");
  const isMediumHeight = useMediaQuery(
    "(min-height:450px) and (max-height:599px)"
  );
  const isLargeHeight = useMediaQuery(
    "(min-height:600px) and (max-height:799px)"
  );
  const isExtraLargeHeight = useMediaQuery("(min-height:800px)");

  let playerHeight;
  if (isShortHeight) {
    playerHeight = "40vh";
  } else if (isMediumHeight) {
    playerHeight = "50vh";
  } else if (isLargeHeight) {
    playerHeight = "60vh";
  } else if (isExtraLargeHeight) {
    playerHeight = "70vh";
  }

  const loader = (
    <div
      className={classes.typography}
      style={{
        alignItems: "center",
        display: "flex",
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      Initializing...
    </div>
  );
  const exportButton = (
    <Box className={classes.exportButtonContainer} sx={{ mt: 2, mb: 3 }}>
      <Button
        className={`${config.videoData.isRendering
          ? classes.exportVideoButtonDisabled
          : classes.exportVideoButton
          }`}
        sx={{ ml: 1 }}
        id="btnExportVideo"
        onClick={() => {
          handleExportVideo();
        }}
        disabled={config.videoData.isRendering}
      >
        <BoltIcon></BoltIcon>
        <Typography sx={{ fontWeight: 500, fontSize: 16 }} variant="inherit">
          {config.videoData.isRendering ? "Exporting..." : "Export Video"}
        </Typography>
      </Button>
      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity={"success"}>
          "Your video is being exported. We'll let you know once it's ready!"
        </Alert>
      </Snackbar>
    </Box>
  );


  return (
    <Box
      style={{
        pointerEvents: isExportingVideo ? "none" : "unset",
        flex: 1,
        backgroundColor: "#F4F4F4",
      }}
    >
      {exportButton}
      {!config.videoData.metadataLoaded && loader}
      {config.videoData.metadataLoaded && (
        <div style={{ flex: 1 }}>
          <Box className={classes.rightSideContainer}>
            <Box className={classes.controlContainer}>
              <Typography variant="h6" className={classes.typography}>
                Layout
              </Typography>
              <Box className={classes.buttonContainer} sx={{ m: 1, px: 5 }}>
                {Object.keys(config.videoData.sourceVideoUrls).map((ratio) => {
                  return (
                    <Button
                      key={ratio}
                      className={`${config.videoData.selectedAspectRatio === ratio
                        ? classes.activeButton
                        : classes.inactiveButton
                        }`}
                      onClick={() => handleScaleTypeChange(ratio)}
                    >
                      {ratio}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            <Box className={classes.videoContainer}>
              {durationInFrames > 0 && (
                <Player
                  ref={playerRef}
                  component={VideoComposition}
                  inputProps={{ config }}
                  compositionHeight={config.videoData.height}
                  compositionWidth={config.videoData.width}
                  durationInFrames={durationInFrames}
                  fps={30}
                  clickToPlay
                  controls={true}
                  doubleClickToFullscreen
                  loop
                  style={{
                    height: playerHeight,
                    width: "5wh",
                    flex: 1,
                  }}
                />
              )}
            </Box>
          </Box>
        </div>
      )}
    </Box>
    // </Box >
  );
};

export default OutputPreview;
