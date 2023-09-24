import React, { useState } from "react";
import { Box, Typography, Slider, Checkbox } from "@mui/material";
import UploadFile from "./UploadFile";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
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
    marginTop: "1rem !important",
  },
}));

const LogoConfigurator = ({ onConfigChange, config }) => {
  const classes = useStyles();

  const [customSize, setCustomSize] = useState({ width: "", height: "" });

  const thumbColor = "#6558F5";
  const trackColor = "#6558F5";

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    onConfigChange({ ...config, [name]: checked });
  };

  const handleSliderChange = (event, newValue) => {
    const { name } = event.target;
    onConfigChange({ ...config, [name]: newValue });
  };

  return (
    <Box sx={{ textAlign: "start", px: "1rem" }}>
      <UploadFile
        fileId="logo"
        config={config.url}
        fileType={1}
        handleConfigChange={(updatedValue) =>
          onConfigChange({
            ...config,
            url: updatedValue,
          })
        }
      ></UploadFile>
      <Typography className={classes.subtitle}>Size</Typography>
      <Box sx={{ textAlign: "start", display: "flex", alignItems: "center" }}>
        <Slider
          name="scaleFactor"
          value={config["scaleFactor"] || 0}
          min={0}
          max={100}
          step={config.scaleFactorTune ? 1 : 10}
          onChange={handleSliderChange}
          sx={{
            color: trackColor,
            "& .MuiSlider-thumb": { backgroundColor: thumbColor },
            "& .MuiSlider-track": { backgroundColor: trackColor },
            "& .MuiSlider-rail": { backgroundColor: trackColor },
            "& .MuiSlider-mark": { backgroundColor: trackColor },
            "& .MuiSlider-valueLabel": { color: thumbColor },
          }}
        />
        <div
          style={{
            alignContent: "center",
            display: "flex",
            flexDirection: "column",
            paddingBottom: "1rem",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#3F3F3F", whiteSpace: "nowrap" }}
          >
            Fine Tune
          </Typography>

          <Checkbox
            checked={config.scaleFactorTune || false}
            name="scaleFactorTune"
            onChange={handleCheckboxChange}
            sx={{ color: thumbColor, "&.Mui-checked": { color: thumbColor } }} // Update the style color to thumbColor
          />
        </div>
      </Box>
      <Typography className={classes.subtitle} mt={2} mb={1}>
        Position
      </Typography>
      <Box sx={{ textAlign: "start", display: "flex", alignItems: "flex-end" }}>
        <Typography
          className={classes.typography}
          variant="subtitle1"
          sx={{ mr: 1, width: "170px", mb: 1 }}
        >
          Vertical
        </Typography>
        <Slider
          name="positionY"
          value={config["positionY"] || 0}
          min={0}
          max={95}
          step={config.verticalFineTune ? 1 : 10}
          onChange={handleSliderChange}
          sx={{
            color: trackColor,
            "& .MuiSlider-thumb": { backgroundColor: thumbColor },
            "& .MuiSlider-track": { backgroundColor: trackColor },
            "& .MuiSlider-rail": { backgroundColor: trackColor },
            "& .MuiSlider-mark": { backgroundColor: trackColor },
            "& .MuiSlider-valueLabel": { color: thumbColor },
            mr: 1,
            mb: 1,
          }}
        />
        <div
          style={{
            alignContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#3F3F3F", whiteSpace: "nowrap" }}
          >
            Fine Tune
          </Typography>

          <Checkbox
            checked={config.verticalFineTune || false}
            name="verticalFineTune"
            onChange={handleCheckboxChange}
            sx={{ color: thumbColor, "&.Mui-checked": { color: thumbColor } }} // Update the style color to thumbColor
          />
        </div>
      </Box>
      <Box
        sx={{
          textAlign: "start",
          display: "flex",
          alignItems: "flex-end",
          flexDirection: "row",
        }}
      >
        <Typography
          className={classes.typography}
          variant="subtitle1"
          sx={{ mr: 1, width: "170px", mb: 1 }}
        >
          Horizontal
        </Typography>
        <Slider
          name="positionX"
          value={config["positionX"] || 0}
          min={0}
          max={98}
          step={config.horizontalFineTune ? 1 : 10}
          onChange={handleSliderChange}
          sx={{
            color: trackColor,
            "& .MuiSlider-thumb": { backgroundColor: thumbColor },
            "& .MuiSlider-track": { backgroundColor: trackColor },
            "& .MuiSlider-rail": { backgroundColor: trackColor },
            "& .MuiSlider-mark": { backgroundColor: trackColor },
            "& .MuiSlider-valueLabel": { color: thumbColor },
            mr: 1,
            mb: 1,
          }}
        />
        <div
          style={{
            alignContent: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#3F3F3F", whiteSpace: "nowrap" }}
          >
            Fine Tune
          </Typography>
          <Checkbox
            checked={config.horizontalFineTune || false}
            name="horizontalFineTune"
            onChange={handleCheckboxChange}
            sx={{ color: thumbColor, "&.Mui-checked": { color: thumbColor } }} // Update the style color to thumbColor
          />
        </div>
      </Box>
    </Box>
  );
};

export default LogoConfigurator;
