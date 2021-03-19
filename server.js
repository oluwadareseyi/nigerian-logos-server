const request = require("request");
const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const app = express();
var cors = require("cors");

require("dotenv/config");
const postUrl =
  "https://api.hubapi.com/filemanager/api/v3/files/upload?hapikey=" +
  process.env.API_KEY;

app.use(bodyParser.json());

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    safeFileNames: true,
    preserveExtension: true,
  })
);
app.get("/api/", (req, res) => {
  res.json({ message: "BRIX-FIGMA-PLUGIN V1" });
});

app.post("/api/upload", (req, res) => {
  const filePath = req.files.file.tempFilePath;

  const fileOptions = {
    access: "PUBLIC_INDEXABLE",
    ttl: "P3M",
    overwrite: false,
    duplicateValidationStrategy: "NONE",
    duplicateValidationScope: "ENTIRE_PORTAL",
  };

  const formData = {
    file: fs.createReadStream(filePath),
    options: JSON.stringify(fileOptions),
    folderPath: "docs",
  };

  return request.post(
    {
      url: postUrl,
      formData: formData,
    },
    function optionalCallback(err, httpResponse, body) {
      if (err) throw new Error(err);
      fs.unlinkSync(filePath);
      res.json(httpResponse);
    }
  );
});

app.get("/api/get-files", (req, res) => {
  return request.get(
    {
      url: ` https://api.hubapi.com/filemanager/api/v2/files?hapikey=${process.env.API_KEY}`,
    },
    function optionalCallback(err, httpResponse, body) {
      res.json(httpResponse.body);
    }
  );
});

app.post("/api/get-file", (req, res) => {
  const image = req.body.image;

  return request.get(
    {
      url: image,
    },
    function optionalCallback(err, httpResponse, body) {
      res.json(httpResponse.body);
    }
  );
});

app.listen(process.env.PORT || 5000);


