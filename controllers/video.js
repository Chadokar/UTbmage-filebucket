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

const createVideo = async (req, res) => {
  try {
    const user = req.user;
    const id = req.query.id || "null";
    console.log("req.body : ", req.body);
    console.log("id : ", id);
    if (id !== "null") {
      const videoExists = await db("videos")
        .where({ id })
        .update({
          ...req.body,
        })
        .returning("*")
        .then((res) => res[0]);
      console.log("videoExists : ", videoExists);
      return res.status(200).json({ video: videoExists, success: true });
    }
    const video = await db("videos")
      .insert({
        ...req.body,
        yt_channel: user.yt_channel,
      })
      .returning("*")
      .then((res) => res[0]);

    res.status(201).json({ video, user, success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    else res.status(error.code);
    res.send({
      message: error.message || error.detail || "Internal server error",
      success: false,
    });
  }
};

const updateDbVideo = async (req, res) => {
  try {
    const id = req.query.videoId;
    const video = await db("videos")
      .where({ id })
      .update({
        ...req.body,
      })
      .returning("*")
      .then((res) => res[0]);
    res.status(200).json({ video, success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    else res.status(error.code);
    res.send({
      message: error.message || error.detail || "Internal server error",
      success: false,
    });
  }
};

// update video details on youtube channel
const updateVideo = async (req, res) => {
  try {
    // get channel details from the database
    const channel = await db("channels")
      .select("*")
      .where({ id: req.user.yt_channel })
      .first();
    if (!channel) {
      throw new Error("Channel not found");
    }

    // set the credentials for the OAuth2 client
    client.setCredentials({
      access_token: req.user.access_token,
      refresh_token: req.user.refresh_token,
    });

    // create a new youtube instance
    const youtube = google.youtube({
      version: "v3",
      auth: client,
    });

    // update video details on youtube : description, title, defaultLanguage, liveBroadcastContent,localized ,publishedAt, tags, thumbnails etc
    const response = await youtube.videos.update({
      part: ["snippet"],
      requestBody: {
        id: req.query.id,
        snippet: {
          ...req.body,
        },
      },
    });

    // update the database with the new description
    await db("videos").where({ id: req.query.id }).update({
      description: req.body.description,
    });

    res.status(200).json(response.data);
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    else res.status(error.code);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

const uploadtodb = async (req, res) => {
  try {
    const filename = req.file.filename;
    console.log("filename : ", filename);
    const id = req.query.videoId;
    const video = await db("videos")
      .where({ id })
      .update({
        backend_name: filename,
      })
      .returning("*")
      .then((res) => res[0]);
    res.status(200).json({
      video,
      success: true,
      message: "Video uploaded Successfully",
    });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    else res.status(error.code);
    res.send({
      message: error.message || error.detail || "Internal server error",
      success: false,
    });
  }
};

const getVideo = async (req, res) => {
  try {
    const id = req.query.id;
    const video = await db("videos").where({ id }).first();
    if (!video) {
      throw new Error("Video not found");
    }
    res.status(200).json({ video, success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    else res.status(error.code);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

const getVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    // get videos and sort them by id in ascending order
    const videos = await db("videos")
      .select("*")
      .where({ yt_channel: req.user.yt_channel })
      .orderBy("id", "asc")
      .limit(limit)
      .offset(offset);
    console.log("videos : ", videos.length);

    res.status(200).json({ videos, success: true });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    else res.status(error.code);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

const getVideoFile = async (req, res) => {
  console.log("getVideoFile : ", req.query.id);
  try {
    const id = req.query.id;
    const video = await db("videos").where({ id }).first();
    if (!video) {
      throw new Error("Video not found");
    }
    const filePath = path.join(
      "D:/Development/fullstack node/youtube manager/client/public",
      video.backend_name
    );
    console.log("filePath : ", filePath);

    // if (fs.existsSync(filePath)) {
    //   const stat = fs.statSync(filePath);
    //   const fileSize = stat.size;
    //   const range = req.headers.range;

    //   if (range) {
    //     const parts = range.replace(/bytes=/, "").split("-");
    //     const start = parseInt(parts[0], 10);
    //     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    //     const chunkSize = end - start + 1;
    //     const file = fs.createReadStream(filePath, { start, end });
    //     const head = {
    //       "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    //       "Accept-Ranges": "bytes",
    //       "Content-Length": chunkSize,
    //       "Content-Type": "video/mp4",
    //     };

    //     res.writeHead(206, head);
    //     file.pipe(res);
    //   } else {
    //     const head = {
    //       "Content-Length": fileSize,
    //       "Content-Type": "video/mp4",
    //     };

    //     res.writeHead(200, head);
    //     fs.createReadStream(filePath).pipe(res);
    //   }
    // } else {
    //   res.status(404).json({ error: "File not found" });
    // }
    res.status(200).send(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const uploadVideo = async (req, res) => {
  try {
    const video = await db("videos").where({ id: req.query.id }).first();
    const filePath = path.join(__dirname, "../uploads", video.backend_name);
    const fileSize = fs.statSync(filePath).size;
    client.setCredentials({
      access_token: req.user.access_token,
      refresh_token: req.user.refresh_token,
    });

    // create a new youtube instance
    const youtube = google.youtube({
      version: "v3",
      auth: client,
    });

    const response = await youtube.videos.insert(
      {
        part: ["snippet", "status"],
        notifySubscribers: req.body.notifySubscribers || false,
        requestBody: {
          snippet: {
            title: req.body.title || "title", //req.body.title,
            description: req.body.description || "title", // req.body.description,
          },
          status: {
            privacyStatus: "private",
          },
        },
        media: {
          body: fs.createReadStream(filePath),
        },
      },
      {
        onUploadProgress: (evt) => {
          const progress = (evt.bytesRead / fileSize) * 100;
          console.log(`${Math.round(progress)}% complete`);
        },
      }
    );
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

const deleteVideo = async (req, res) => {
  try {
    const video = await db("videos").where({ id: req.query.id }).first();
    const filePath = path.join(__dirname, "../uploads", video.backend_name);
    fs.unlinkSync(filePath);
    await db("videos").where({ id: req.query.id }).delete();
    res
      .status(200)
      .json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    else res.status(error.code);
    res.send({
      message: error.message || error.detail || "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  createVideo,
  uploadVideo,
  updateVideo,
  uploadtodb,
  getVideo,
  deleteVideo,
  getVideos,
  updateDbVideo,
  getVideoFile,
};
