import React from "react";
import { Box, Typography, TextField, Slider, Checkbox } from "@mui/material";
import Toolbar from "../components/TextFormattingToolbar";
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

const HeadlineConfigurator = ({ onConfigChange, config }) => {
  const classes = useStyles();

  const handleToolbarConfigChange = (newConfig) => {
    onConfigChange({ ...config, ...newConfig });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    onConfigChange({ ...config, [name]: value });
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

  return (
    <Box sx={{ textAlign: "start", px: "1rem" }}>
      <Typography className={classes.subtitle}>Title</Typography>
      <Box sx={{ textAlign: "start", px: "1rem", my: 2 }}>
        <TextField
          placeholder="AI Generated Video Title"
          name="title"
          value={config.title || ""}
          onChange={handleInputChange}
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
        />
      </Box>

      <Toolbar
        onTextConfigChange={handleToolbarConfigChange}
        textConfig={config}
      />

      <Typography className={classes.subtitle}>Position</Typography>

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
          max={80}
          step={config.vertical_fineTune ? 2 : 10}
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
            checked={config.vertical_fineTune || false}
            name="vertical_fineTune"
            onChange={handleCheckboxChange}
            sx={{ color: thumbColor, "&.Mui-checked": { color: thumbColor } }} // Update the style color to thumbColor
          />
        </div>
      </Box>
    </Box>
  );
};

export default HeadlineConfigurator;
