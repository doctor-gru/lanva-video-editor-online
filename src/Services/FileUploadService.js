import http from "../http-common";

const YOUR_CLOUD_NAME = "dbo8l90u9";
const YOUR_UNSIGNED_UPLOAD_PRESET = "h8nwhmtm";

const upload = (file, type, onUploadProgress) => {
    let formData = new FormData();
    let url = "";

    if (type == 0)
        url = "https://api.cloudinary.com/v1_1/" + YOUR_CLOUD_NAME + "/video/upload";
    else if (type == 1)
        url = "https://api.cloudinary.com/v1_1/" + YOUR_CLOUD_NAME + "/image/upload";

    formData.append("file", file);
    formData.append("upload_preset", YOUR_UNSIGNED_UPLOAD_PRESET);

    return http.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress,
    });
};

const cancel = () => {
    http.cancel();
};

export default {
    upload,
    cancel
};