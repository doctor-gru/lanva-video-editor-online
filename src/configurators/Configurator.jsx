import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Switch,
  IconButton,
  Box,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ImageIcon from "@mui/icons-material/Image";
import TitleIcon from "@mui/icons-material/Title";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import CaptionsConfigurator from "./ClosedCaptions";
import HeadlineConfigurator from "./HeadlineConfigurator";
import LogoConfigurator from "./LogoConfigurator";
import IntroOutroConfigurator from "./IntroOutroConfigurator";

const useStyles = makeStyles(() => ({
  leftSideContainer: {
    borderRadius: "5px",
    backgroundColor: "#F4F4F4",
    padding: "15px",
    width: "500px",
    minWidth: "500px",
    marginTop: "4rem",
    overflowY: "auto !important",
    maxHeight: "calc(100vh - 50px)",
  },
  accordinContainer: {
    borderRadius: "10px !important",
    boxShadow: "2px 2px 4px 2px rgba(63, 63, 63, 0.1) !important",
    padding: "0px 0px 0px 0px !important",
    "&::before": {
      content: "none !important",
    },
  },
  typography: {
    fontWeight: "700 !important",
    fontSize: "20px !important",
    color: "#3F3F3F !important",
  },
}));

const CustomAccordion = ({ config, handleConfigChange }) => {
  const classes = useStyles();

  const [expanded, setExpanded] = useState({
    // "Video": true,
    Logo: false,
    Headline: false,
    "Caption Style": false,
    "Intro & Outro": false,
  });

  const accordionData = [
    {
      title: "Logo",
      key: "logoStyle",
      Icon: ImageIcon,
      Detail: (
        <LogoConfigurator
          onConfigChange={(updatedValue) => {
            handleConfigChange({
              ...config,
              logoStyle: updatedValue.url ? true : false,
              logoData: {
                ...config.logoData,
                logoStyle: updatedValue,
              },
            });
          }}
          config={config.logoData.logoStyle}
        />
      ),
    },
    {
      title: "Headline",
      Icon: TitleIcon,
      key: "titleStyle",
      Detail: (
        <HeadlineConfigurator
          onConfigChange={(updatedValue) =>
            handleConfigChange({
              ...config,
              titleData: {
                ...config.titleData,
                titleStyle: updatedValue,
              },
            })
          }
          config={config.titleData.titleStyle}
        />
      ),
    },
    {
      title: "Caption Style",
      key: "subTitleStyle",
      Icon: ClosedCaptionIcon,
      Detail: (
        <CaptionsConfigurator
          onConfigChange={(updatedValue) =>
            handleConfigChange({
              ...config,
              streamData: {
                ...config.streamData,
                subTitleData: {
                  ...config.streamData.subTitleData,
                  subTitleStyle: updatedValue,
                },
              },
            })
          }
          config={config.streamData.subTitleData.subTitleStyle}
        />
      ),
    },
    {
      title: "Intro & Outro",
      key: "introOutro",
      Icon: ImageIcon,
      Detail: (
        <IntroOutroConfigurator
          onConfigChange={(updatedValue) => {

            let introOutroEnabled = config.introOutro;
            if (updatedValue.intro.enabled == true || updatedValue.outro.enabled == true)
              introOutroEnabled = true;

            if (updatedValue.intro.enabled == false && updatedValue.outro.enabled == false)
              introOutroEnabled = false;

            handleConfigChange(config => ({
              ...config,
              introOutro: introOutroEnabled,
              introData: updatedValue.intro,
              outroData: updatedValue.outro,
            }));

          }}
          config={{
            intro: config.introData,
            outro: config.outroData,
          }}
        />
      ),
    },
  ];

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // expanded[panel] = isExpanded;
    const isSwitchToggle = event.target.tagName === "INPUT"; // Check if the event target is the switch

    if (isSwitchToggle) {
      return; // Return early without updating the expanded state
    }

    setExpanded({
      ...expanded,
      [panel]: isExpanded,
    });
  };

  return (
    <Box className={classes.leftSideContainer}>
      {accordionData.map(({ title, Icon, Detail, key }) => (
        <Accordion
          key={title}
          expanded={expanded[title]}
          onChange={handleAccordionChange(title)}
          className={classes.accordinContainer}
        >
          <AccordionSummary
            expandIcon={
              <IconButton>
                <ExpandMoreIcon />
              </IconButton>
            }
            sx={{ my: 1 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "0px",
              }}
            >
              <Switch
                style={{
                  marginLeft: "auto",
                  color: config[key] ? "#6558F5" : "#ffffff",
                }}
                checked={config[key]}
                onChange={(e, enabled) => {
                  console.log("DDDDDDD= ", key);
                  if (enabled) {
                    if (key === "introOutro") {
                      handleConfigChange({
                        ...config,
                        introData: {
                          ...config.introData,
                          enabled: true
                        },
                        outroData: {
                          ...config.outroData,
                          enabled: true
                        },
                        [key]: enabled
                      })
                    } else {
                      handleConfigChange({
                        ...config,
                        [key]: enabled
                      })
                    }
                  } else
                    handleConfigChange({ ...config, [key]: enabled });
                }}
              />
              <Icon />
              <Typography className={classes.typography} sx={{ ml: 2 }}>
                {title}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {Detail ? (
              Detail
            ) : (
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default CustomAccordion;
