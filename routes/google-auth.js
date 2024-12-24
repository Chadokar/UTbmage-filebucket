// const Router = require("express").Router();

// const {
//   redirectedUrl,
//   decoder,
//   googlelogin,
// } = require("../controllers/auth.google");
// const refreshToken = require("../services/refresh-token");

// const router = Router;

// // router.get("/google/auth", passport.authenticate("google"), (req, res) => {
// //   console.log(req?.user || "no user");
// //   res.status(200).send("You have been authenticated");
// // });

// router.get("/google/auth", redirectedUrl);
// router.get("/google/decode", decoder, googlelogin, refreshToken);

// module.exports = router;
