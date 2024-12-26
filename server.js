require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
})

const upload = multer();

app.post("/api/upload", upload.fields([{ name: "thumbnail" }, { name: "video" }]), async (req, res) => {
  try {
    const { title, description } = req.body;

    const thumbnailUpload = await cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      (err, result) => result
    ).end(req.files["thumbnail"][0].buffer);

    const videoUpload = await cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      (err, result) => result
    ).end(req.files["video"][0].buffer);

    res.status(200).json({ message: "Media uploaded successfully!", data: { thumbnailUpload, videoUpload } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to upload media." });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
