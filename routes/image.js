const { header } = require("express-validator");
const { verifyToken } = require("../middlewares/verify");
const { validate } = require("../services/validator");
const path = require("path");
const multer = require("multer");
const {
  uploadtodb,
  uploadImage,
  deleteImage,
  getImages,
  getImageFile,
} = require("../controllers/image");

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
  [
    header("Authorization", "Authorization token is required").exists(),
    header("id", "Id is required").exists(),
  ],
  validate,
  verifyToken,
  upload.single("image"),
  uploadImage
);

router.post(
  "/bucket/upload",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verifyToken,
  upload.single("image"),
  uploadtodb
);

router.delete(
  "/:id",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verifyToken,
  deleteImage
);

router.get(
  "/",
  [header('Authorization", "Authorization token is required').exists()],
  getImages
);

router.get(
  "/:id",
  [header("Authorization", "Authorization token is required").exists()],
  validate,
  verifyToken,
  getImageFile
);

// router.get("/", (req, res) => {
//   res.send("Image route");
// });

// router.get(
//   "/video/:id",
//   [header("Authorization", "Authorization token is required").exists()],
//   validate,
//   verifyToken,
//   getVideo
// );

module.exports = router;
