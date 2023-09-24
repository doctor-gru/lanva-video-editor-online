const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const express = require("express");
const request = require("request");
const cloudinary = require("cloudinary");

const fs = require("fs");
const os = require("os");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios");

const ROSS_CLOUD_NAME = "dbo8l90u9";
const ROSS_UNSIGNED_UPLOAD_PRESET = "h8nwhmtm";

const YOUR_CLOUD_NAME = "dkfk6xyyv";
const YOUR_UNSIGNED_UPLOAD_PRESET = "pxlahsyi";

const DEV_WEB_HOOK_URL = "https://lanva.io/version-test/api/1.1/wf/remotion-export";
const WEB_HOOK_URL = "https://lanva.io/api/1.1/wf/remotion-export";
const MY_NGROK_URL = "https://lanva-render.ngrok.io";

const app = express();
const port = process.env.PORT || 4727;
const compositionId = "VideoComposition";

cloudinary.config({
  cloud_name: 'detnah4pp',
  api_key: '399997517476578',
  api_secret: 'm7EIudH1sH6DmUCzK9FK9WBU5u8',
  secure: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // TODO: change this to `https://lanva.io` later
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/test", (req, res) => {
  const param = req.query.param;
  res.send(`param:${param}`);
});

app.get("/download", function (req, res) {
  var url = req.query.url; // get the file url from query params
  var filename = req.query.filename; // get the filename from query params
  res.setHeader("Content-Disposition", "attachment; filename=" + filename);
  request(url).pipe(res);
});

app.post("/video", async (req, res) => {
  try {
    const name = req.body.name;

    if (name != "export_video")
      return res.status(500).send(
        json({
          //   error: err,
        })
      );

    const tmpDir = await fs.promises.mkdtemp(
      path.join(os.tmpdir(), "remotion-")
    );

    const logPath = `${tmpDir}/${compositionId}_${new Date().getTime()}.log`;
    console.log("Log file path = ", logPath);

    const accessLogStream = fs.createWriteStream(logPath, { flags: "a" });

    const params = req.body.config;
    const { uniqueId, isDev = false } = params;
    const selectedRatio = params.videoData.selectedAspectRatio;

    const inputProps = { config: params };

    accessLogStream.write("Config params = " + JSON.stringify(inputProps));

    const bundled = await bundle(
      path.join(__dirname, "./src/Render/render.js")
    );

    const video = await selectComposition({
      serveUrl: bundled,
      id: compositionId,
      inputProps,
    });

    if (!video) {
      throw new Error(`No video called ${compositionId}`);
    }

    res.set("content-type", "video/mp4");

    logToFile(accessLogStream, "Render started");

    const filePath = `${tmpDir}/${compositionId}_${new Date().getTime()}.mp4`;
    logToFile(accessLogStream, "Video file path = " + filePath);

    // Render the video
    await renderMedia({
      composition: video,
      serveUrl: bundled,
      codec: "h264",
      outputLocation: filePath,
      inputProps: inputProps,
      logLevel: "error",
      jpegQuality: 100,
      onProgress: (RenderMediaOnProgress = () => { }),
    });

    logToFile(accessLogStream, "Render ended");

    logToFile(accessLogStream, "Upload video started");

    // upload video to cloudinary
    cloudinary.v2.uploader.upload_large(filePath,
      {
        resource_type: "video",
        chunk_size: 6000000
      }, function (error, result) {
        if (result != undefined) {
          logToFile(
            accessLogStream,
            "Upload video response = " + JSON.stringify(result)
          );
          logToFile(accessLogStream, "Upload video ended");

          const clonedResponseData = Object.assign({}, result);
          const videoUrl = clonedResponseData.secure_url;

          fs.unlink(filePath, (err) => {
            if (err) {
              logToFile(accessLogStream, "Error deleting file" + filePath);
            } else {
              logToFile(accessLogStream, "Deleted successfully" + filePath);
            }
          });

          const filename = (params.titleData?.titleStyle?.title || uniqueId) + ".mp4";

          const payload = {
            uniqueId: uniqueId,
            resultUrl: videoUrl,
            aspectRatio: selectedRatio,
            downloadUrl: `${MY_NGROK_URL}/download?filename=${encodeURIComponent(
              filename
            )}&url=${encodeURIComponent(videoUrl)}`,
          };

          logToFile(
            accessLogStream,
            "Webhook payload = " + JSON.stringify(payload)
          );

          const webhookUrl = isDev ? DEV_WEB_HOOK_URL : WEB_HOOK_URL;
          logToFile(accessLogStream, "Webhook call started " + webhookUrl);
          // call webhook
          const response = axios.post(webhookUrl, payload, {
            "Content-type": "application/json",
          }).then(response => {
            logToFile(
              accessLogStream,
              "Webhook response = " + JSON.stringify(response.data)
            );
            logToFile(accessLogStream, "Webhook call ended");

            const statusCode = response.status;

            if (statusCode == 200) res.status(200).send(response.data);

          })
            .catch(error => {
              logToFile(accessLogStream, "Webhook failed with try catch error");
              logToFile(accessLogStream, error);
            });;


        } else {
          logToFile(accessLogStream, "Upload video failed with error");
          logToFile(accessLogStream, error);
          res.status(200).send(
            error
          );
        }
      });
  } catch (err) {
    console.log(err);
    //ogToFile(accessLogStream, "Error = " + JSON.stringify(err));
    res.status(500).send(err);
  }
});

app.listen(port);

console.log(
  [
    `The server has started on http://localhost:${port}!`,
    "You can render a video by passing props as URL parameters.",
    "",
    "If you are running Hello World, try this:",
    "",
  ].join("\n")
);

function logToFile(fDescriptor, logStr) {
  fDescriptor.write(`\n---------------${new Date()}-----------------\n`);
  fDescriptor.write(logStr + "\n");
}
