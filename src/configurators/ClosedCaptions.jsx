import React from "react";
import {
  Box,
  Typography,
  Slider,
  Checkbox
} from "@mui/material";
import Toolbar from "../components/TextFormattingToolbar";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({

  typography: {
    fontWeight: "500 !important",
    fontSize: "18px !important",
    color: "#3F3F3F !important",
    textAlign: "left"
  },
  subtitle: {
    fontWeight: "600 !important",
    fontSize: "18px !important",
    color: "#3F3F3F !important",
    textAlign: "left",
    marginTop: "1rem !important",
  },
}));

const CaptionsConfigurator = ({ onConfigChange, config }) => {

  const classes = useStyles();

  const handleToolbarConfigChange = (newConfig) => {
    onConfigChange({ ...config, ...newConfig });
  };

  const handleSliderChange = (event, newValue) => {
    const { name } = event.target;
    onConfigChange({ ...config, [name]: newValue });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    onConfigChange({ ...config, [name]: checked });
  };

  const thumbColor = "#6558F5";
  const trackColor = "#6558F5";

  // const handleHorizontalPositionChange = (event) => {
  //   const newPosition = event.target.value;
  //   onConfigChange({ ...config, "position-x": newPosition });
  // };

  return (
    <Box sx={{ textAlign: "start", px: "1rem" }}>
      <Typography className={classes.typography} variant="subtitle1" sx={{ mb: 2 }}>
        Text
      </Typography>
      <Toolbar
        onTextConfigChange={handleToolbarConfigChange}
        textConfig={config}
      />
      <Typography className={classes.subtitle} variant="h6" fontWeight="bold" mt={2} mb={1}>
        Position
      </Typography>
      <Box sx={{ textAlign: "start", display: "flex", alignItems: "flex-end" }}>
        <Typography
          className={classes.typography}
          sx={{ width: "170px", mb: 1.5 }}
        >
          Vertical
        </Typography>
        <Slider
          name="positionY"
          value={config["positionY"] || 0}
          min={0}
          max={85}
          step={config.verticalFineTune ? 2 : 10}
          onChange={handleSliderChange}
          sx={{
            color: trackColor,
            "& .MuiSlider-thumb": { backgroundColor: thumbColor },
            "& .MuiSlider-track": { backgroundColor: trackColor },
            "& .MuiSlider-rail": { backgroundColor: trackColor },
            "& .MuiSlider-mark": { backgroundColor: trackColor },
            "& .MuiSlider-valueLabel": { color: thumbColor },
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
    </Box>
  );
};

export default CaptionsConfigurator;
