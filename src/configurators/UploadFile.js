import React, { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  generateVideoThumbnailViaUrl
} from "@rajesh896/video-thumbnails-generator";
import {
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import UploadService from "../Services/FileUploadService";

const UploadFile = ({ fileId, config, fileType, handleConfigChange }) => {
  const [selectedFile, setSelectedFile] = useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(0);
  const [thumbnail, setThumbnail] = useState(config);

  const loadThumbnailVideo = (url) => {
    if (url.length > 0) {
      generateVideoThumbnailViaUrl(url, 1).then((thumbs) => {
        setThumbnail(thumbs);
      });
    } else {
      setThumbnail(url);
    }
  }

  useEffect(() => {
    if (fileType == 0 && config) {
      loadThumbnailVideo(config);
    }
  }, [config, fileType]);

  const handleFileChange = (event) => {
    if (event.target.files[0] == undefined)
      return;

    const file = event.target.files[0];
    const fileSizeInBytes = file.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert bytes to MB

    if (fileSizeInMB > 100)
      return;

    setThumbnail(undefined);
    const selectedFile = event.target.files[0];
    setSelectedFile(selectedFile);

    setIsUploading(1);
    setUploadProgress(0);

    UploadService.upload(selectedFile, fileType, (event) => {
      setUploadProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setIsUploading(0);
        setUploadProgress(100);
        handleUploadFileChange(response.data.secure_url);

        if (fileType == 0)
          loadThumbnailVideo(response.data.secure_url);
        else
          setThumbnail(response.data.secure_url);
      })
      .catch(() => {
        setUploadProgress(0);
        setIsUploading(0);
        setSelectedFile(undefined);
      });
  };

  const handleUpload = async () => {
    if (selectedFile === undefined) {
      document.getElementById(`fileInput-${fileId}`).click();
      return;
    }
  };

  const handleUploadFileChange = (newValue) => {
    handleConfigChange(newValue);
    setSelectedFile(undefined);
  };

  const getFileInputByType = (filetype) => {
    if (filetype === 0) return "video/*";
    if (filetype === 1) return "image/*";
    if (filetype === 2) return "file/*";
    return "";
  };

  const centered = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const styles = {
    parentBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    childBox: {
      border: "1px solid #808080",
      position: "relative",
      width: "100px",
      height: "100px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgb(222, 229, 234)",
    },
    centered,
    imgStyle: {
      ...centered,
      width: "90px",
      height: "90px",
      objectFit: "cover",
    },
  };

  return (
    <Box sx={styles.parentBox}>
      <Box
        sx={styles.childBox}
        style={{ pointerEvents: isUploading === 1 ? "none" : "auto" }}
      >
        <input
          id={`fileInput-${fileId}`}
          type="file"
          accept={getFileInputByType(fileType)}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {isUploading !== 1 &&
          (config ? (
            <img
              src={thumbnail}
              onClick={handleUpload}
              style={styles.imgStyle}
            />
          ) : (
            <Button
              onClick={handleUpload}
              style={{ width: "100%", height: "100%" }}
            >
              <CloudUploadIcon
                style={{ color: "rgb(107, 125, 138)", fontSize: "50px" }}
              />
            </Button>
          ))}

        {isUploading === 1 && (
          <Box sx={styles.centered}>
            <CircularProgress
              variant="determinate"
              sx={{ color: "#6558F5" }}
              value={uploadProgress}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UploadFile;
