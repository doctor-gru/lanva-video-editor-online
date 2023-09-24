import React, { useRef, useState } from "react";
import {
  IconButton,
  Select,
  MenuItem,
  TextField,
  Box,
  Popover,
  Grid,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";

const fonts = [
  "Arial",
  "Courier New",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Helvetica",
  "Courier",
  "Monaco",
  "Futura",
  "Gill Sans",
  "Baskerville",
  "Palatino",
];

const alternativeFonts = {
  Courier: "Courier Prime",
  Monaco: "Source Code Pro",
  Futura: "Didact Gothic",
  "Gill Sans": "Work Sans",
  Baskerville: "Libre Baskerville",
  Palatino: "Noto Serif",
};

function getFontFamily(font) {
  return `${font}, ${alternativeFonts[font]}`;
}

const Toolbar = ({
  onTextConfigChange,
  textConfig: {
    alignment,
    bold,
    italic,
    underline,
    fontSize = 36,
    fontName,
    textColor = "#000000",
  },
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const colorPickerRef = useRef();

  const handleColorChange = (e) => {
    onTextConfigChange({ textColor: e.target.value });
  };

  const handleColorClick = (e) => {
    setAnchorEl(e.currentTarget);
    colorPickerRef?.current?.click();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toolbarGroups = [
    [
      { command: "bold", Icon: FormatBoldIcon, active: bold },
      { command: "italic", Icon: FormatItalicIcon, active: italic },
      { command: "underline", Icon: FormatUnderlinedIcon, active: underline },
    ],
    [
      {
        command: "left",
        Icon: FormatAlignLeftIcon,
      },
      {
        command: "center",
        Icon: FormatAlignCenterIcon,
      },
      {
        command: "right",
        Icon: FormatAlignRightIcon,
      },
    ],
  ];

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Box
          sx={{
            mx: 2,
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            "& > :not(:last-child)": {
              marginBottom: "10px",
            },
          }}
        >
          {toolbarGroups.map((group, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                border: "1px solid rgb(197, 206, 213)",
                borderRadius: "2px",
                marginRight: "10px",
              }}
            >
              {group.map(({ command, Icon, active }) => (
                <IconButton
                  key={command}
                  onClick={
                    () =>
                      active === undefined
                        ? onTextConfigChange({ alignment: command }) // when changing alignment
                        : onTextConfigChange({ [command]: !active }) // when changing B/I/U
                  }
                  sx={{ color: active ? "primary.main" : "black" }}
                >
                  <Icon />
                </IconButton>
              ))}
            </Box>
          ))}

          <Select
            defaultValue="Helvetica"
            value={
              fonts.find((f) => getFontFamily(f) === fontName) || "Helvetica"
            }
            sx={{
              minWidth: 180,
              textAlign: "start",
              height: "40px",
              marginRight: "10px",
              fontFamily: getFontFamily(fontName),
            }}
            onChange={(e) =>
              onTextConfigChange({ fontName: getFontFamily(e.target.value) })
            }
          >
            {fonts.map((font) => (
              <MenuItem
                key={font}
                value={font}
                style={{ fontFamily: getFontFamily(font) }}
              >
                {font}
              </MenuItem>
            ))}
          </Select>

          <TextField
            type="number"
            variant="outlined"
            InputProps={{
              style: { height: "40px" },
              endAdornment: <span style={{ marginLeft: "5px" }}>px</span>,
            }}
            value={fontSize || 36}
            onChange={(e) => onTextConfigChange({ fontSize: e.target.value })}
            sx={{ width: "90px", marginRight: "10px" }}
          />

          <IconButton
            onClick={handleColorClick}
            sx={{
              color: textColor,
              border: "2px solid #6558F5",
              height: "40px",
              width: "40px",
              marginBottom: "10px",
            }}
          >
            <FormatColorFillIcon />
          </IconButton>

          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            style={{ marginTop: "1rem" }} // Adjust the marginTop value as needed
          >
            <Box p={2}>
              <input
                ref={colorPickerRef}
                type="color"
                id="color-picker"
                variant="outlined"
                defaultValue={textColor}
                onChange={handleColorChange}
              />
            </Box>
          </Popover>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Toolbar;
