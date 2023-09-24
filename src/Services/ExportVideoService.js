import http from "../http-common";

const exportVideo = (config, onUploadProgress) => {

    const postData = JSON.stringify({
        "name": 'export_video',
        "config": config
    });

    const url = "https://lanva-render.ngrok.io/video"; // "http://199.195.144.83:4727/video";

    return http.post(url, postData, {
        headers: {
            "Content-type": "application/json"
        },
        onUploadProgress,
    });
};

const cancel = () => {
    http.cancel();
};

export default {
    exportVideo,
    cancel
};