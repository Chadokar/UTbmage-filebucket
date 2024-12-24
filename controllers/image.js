const { google } = require("googleapis");
const path = require("path");
const db = require("../db");
const fs = require("fs");
const mime = require("mime");

// OAuth2 client for Google APIs
const client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

const getImageFile = async (req, res) => {
  try {
    const image = await db("images").where({ id: req.params.id }).first();
    if (!image) throw new Error("Image not found");
    const filePath = path.join(__dirname, "../uploads", image.backend_name);
    console.log("filePath : ", filePath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }
    const mimeType = mime.getType(filePath);
    res.setHeader("Content-Type", mimeType);
    res.sendFile(filePath);
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      message: error.message || error.detail || "Internal server error",
      success: false,
    });
  }
};

const uploadtodb = async (req, res) => {
  try {
    const filename = req.file.filename;
    const video_id = req.query.id;
    console.log("req.query : ", req.query);
    const image = await db("images")
      .insert({
        title: req.query.title,
        backend_name: filename,
        is_thumbnail: req.query.is_thumbnail || false,
        yt_id: req.query.channelId,
        video_id,
      })
      .returning("*")
      .then((res) => res[0]);
    res.status(200).json({
      image,
      success: true,
      message: "Video uploaded Successfully",
    });
  } catch (error) {
    console.log("error : ", error);
    if (res.statusCode < 400) res.status(500);
    else res.status(401);
    res.send({
      message: error.message || error.detail || "Internal server error",
      success: false,
      error,
    });
  }
};

const uploadImage = async (req, res) => {
  try {
    const image = await db("images").where({ id: req.body.id }).first();
    const filePath = path.join(__dirname, "../uploads", image.backend_name);
    client.setCredentials({
      access_token: req.user.access_token,
      refresh_token: req.user.refresh_token,
    });

    // create a new youtube instance
    const youtube = google.youtube({
      version: "v3",
      auth: client,
    });

    const response = await youtube.thumbnails.set({
      videoId: videoId,
      media: {
        mimeType: "image/jpeg",
        body: fs.createReadStream(filePath),
      },
    });
    console.log("response : ", response);
    res.status(200).json({ videoId: response.data.id });
  } catch (error) {
    // console.log("error : ", error);
    if (error.code < 400) res.status(500);
    else res.status(error.code);
    res.json({ error: error.message || error.detail || error, success: false });
  }
  // finally {
  //   // Remove the file from the server after uploading
  //   fs.unlinkSync(filePath);
  // }
};

const deleteImage = async (req, res) => {
  console.log("req.param.id : ", req.params.id);
  try {
    const image = await db("images").where({ id: req.params.id }).first();
    if (!image) throw new Error("Image not found");
    console.log("image : ", image);
    const filePath = path.join(__dirname, "../uploads", image.backend_name);
    fs.unlinkSync(filePath);
    await db("images").where({ id: req.params.id }).del();
    res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    else res.status(error.code);
    res.send({
      message: error.message || error.detail || "Internal server error",
      success: false,
    });
  }
};

const getImages = async (req, res) => {
  try {
    const images = await db("images").where({ video_id: req.query.id });
    res.status(200).json({ images, success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      message: error.message || error.detail || "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  uploadImage,
  uploadtodb,
  deleteImage,
  getImages,
  // getVideo,
  getImageFile,
};
