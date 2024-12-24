const { header, body } = require("express-validator");
const { verifyToken } = require("../middlewares/verify");
const { validate } = require("../services/validator");
const path = require("path");
const multer = require("multer");
const {
  uploadVideo,
  uploadtodb,
  deleteVideo,
  getVideo,
  createVideo,
  getVideos,
  updateDbVideo,
  getVideoFile,
} = require("../controllers/video");

const router = require("express").Router();
// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the destination folder
  },
  filename: (req, file, cb) => {
    // Extract the file extension
    const extension = path.extname(file.originalname);
    // Generate a hash for the filename
    const hash =
      Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    // Combine hash with the original extension
    cb(null, `${hash}${extension}`);
  },
});
const upload = multer({ storage });

// get channel
router.post(
  "/upload",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verifyToken,
  // upload.single("video"),
  uploadVideo
);

router.post(
  "/create",
  [
    [header("Authorization", "Authorization token is required").exists()],
    body("title", "title is required").exists(),
  ],
  validate,
  verifyToken,
  createVideo
);

router.post(
  "/bucket/upload",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verifyToken,
  upload.single("video"),
  uploadtodb
);

router.post(
  "/update/local",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verifyToken,
  upload.single("video"),
  updateDbVideo
);

router.delete(
  "/",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verifyToken,
  deleteVideo
);

router.get(
  "/",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verifyToken,
  getVideo
);

router.get(
  "/videos",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verifyToken,
  getVideos
);

router.get(
  "/file",
  // [header("Authorization", "Authorization token is required").exists()],
  // validate,
  // verifyToken,
  getVideoFile
  // (req, res) => {
  //   res.status(200).json({ success: true, message: "File found" });
  // }
);

// router.get(
//   "/video/:id",
//   [header("Authorization", "Authorization token is required").exists()],
//   validate,
//   verifyToken,
//   getVideo
// );

module.exports = router;
