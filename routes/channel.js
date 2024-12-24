// const { header, body } = require("express-validator");
// const { verifyToken } = require("../middlewares/verify");
// const { validate } = require("../services/validator");
// const {
//   getChannel,
//   updateChannel,
//   getSubscribers,
//   getVideos,
// } = require("../controllers/channel");

// const router = require("express").Router();

// // get channel
// router.get(
//   "/",
//   [header("Authorization", "Authorization token is required").exists()],
//   validate,
//   verifyToken,
//   getChannel
// );

// // update channel
// router.put(
//   "/",
//   [header("Authorization", "Authorization token is required").exists()],
//   validate,
//   verifyToken,
//   updateChannel
// );

// // get subscribers count
// router.get(
//   "/subscribers",
//   [header("Authorization", "Authorization token is required").exists()],
//   validate,
//   verifyToken,
//   getSubscribers
// );

// // get youtube videos
// router.get(
//   "/videos",
//   [header("Authorization", "Authorization token is required").exists()],
//   validate,
//   verifyToken,
//   getVideos
// );

// module.exports = router;
