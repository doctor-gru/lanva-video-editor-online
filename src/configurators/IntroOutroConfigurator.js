import React from "react";
import { Box, Typography, Checkbox, TextField, Switch } from "@mui/material";
import UploadFile from "./UploadFile";
import { makeStyles } from "@mui/styles";
import { getVideoMetadata } from "@remotion/media-utils";
import { useState, useEffect } from "react";

const useStyles = makeStyles(() => ({
  typography: {
    fontWeight: "400 !important",
    fontSize: "16px !important",
    color: "#3F3F3F !important",
    textAlign: "left",
  },
  subtitle: {
    fontWeight: "600 !important",
    fontSize: "18px !important",
    color: "#3F3F3F !important",
    textAlign: "left",
  },
}));

const IntroOutroConfigurator = ({ onConfigChange, config }) => {

  const classes = useStyles();

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const [type, field] = name.split("_");
    onConfigChange({ ...config, [type]: { ...config[type], [field]: checked } });
  };

  const handleTextFieldChange = (event) => {
    const { name, value } = event.target;
    const [type, field] = name.split("_");
    onConfigChange({ ...config, [type]: { ...config[type], [field]: parseInt(value) } });
  };

  const [isIntroVideoUrl, setIsIntroVideoUrl] = useState('');
  const [isOutroVideoUrl, setIsOutroVideoUrl] = useState('');
  const [durationIntro, setDurationIntro] = useState(0);
  const [durationOutro, setDurationOutro] = useState(0);

  useEffect(() => {
    if (isIntroVideoUrl) {
      onConfigChange({
        ...config,
        "intro": { ...config["intro"], enabled: true, videoUrl: isIntroVideoUrl }
      });
    }
    loadIntroOutroMetaData("intro", isIntroVideoUrl);
  }, [isIntroVideoUrl])

  useEffect(() => {
    if (isOutroVideoUrl) {
      onConfigChange({
        ...config,
        "outro": { ...config["outro"], enabled: true, videoUrl: isOutroVideoUrl }
      });

      loadIntroOutroMetaData("outro", isOutroVideoUrl);
    }
  }, [isOutroVideoUrl])

  useEffect(() => {
    if (isIntroVideoUrl) {
      onConfigChange({
        ...config,
        "intro": { ...config["intro"], duration: durationIntro, playDuration: durationIntro }
      });
    }
  }, [durationIntro])

  useEffect(() => {
    if (isOutroVideoUrl) {
      onConfigChange({
        ...config,
        "outro": { ...config["outro"], duration: durationOutro, playDuration: durationOutro }
      });

    }
  }, [durationOutro])

  const loadIntroOutroMetaData = async (type, url) => {

    if (url.length > 0) {
      try {
        const { durationInSeconds } = await getVideoMetadata(
          url
        );
        const duration = Math.trunc(Math.min(durationInSeconds, 99));
        if (type == 'intro') {
          setDurationIntro(duration);
        }
        else if (type == 'outro') {
          setDurationOutro(duration);
        }

      } catch (error) {
        console.error("Failed to load intro video metadata:", error);
      }
    }
  }

  return (
    <Box sx={{ textAlign: "start" }}>
      {["intro", "outro"].map((type) => (
        <Box key={type} sx={{ marginTop: "1rem" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Switch
              checked={config[type].enabled || false}
              onChange={handleCheckboxChange}
              name={`${type}_enabled`}
            />
            <Typography
              className={classes.subtitle}
              sx={{ marginLeft: "0.5rem" }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "stretch", px: '1rem' }}>
            <UploadFile
              fileId={type}
              config={config[type].videoUrl}
              fileType={0}
              handleConfigChange={(updatedValue) => {
                if (type == 'intro') {
                  setIsIntroVideoUrl(updatedValue)
                }
                else if (type == 'outro') setIsOutroVideoUrl(updatedValue)
              }
              }
            />
            <Box
              sx={{
                marginLeft: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography color='rgb(107,125, 138)' fontWeight={500}>
                  Upload a video to use as an {type}
                </Typography>
                <Typography variant="body2" color="rgb(189, 203, 213)">
                  Maximum file size: 100MB
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" color='rgb(107,125, 138)'
                  fontSize={13} mt={'5px'}>Duration</Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    type="number"
                    variant="outlined"
                    InputProps={{
                      style: { height: "40px" },
                      inputProps: { max: Math.min(99, config[type].duration) }
                    }}
                    value={config[type].playDuration || 0}
                    onChange={handleTextFieldChange}
                    name={`${type}_playDuration`}
                    sx={{ width: "60px", marginRight: "0px" }}
                  />
                  <Typography variant="body2" sx={{ marginLeft: "0.5rem" }}>
                    seconds
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default IntroOutroConfigurator;
