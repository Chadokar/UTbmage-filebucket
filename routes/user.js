// const express = require("express");
// const { body, header } = require("express-validator");
// const { validate } = require("../services/validator");
// const { login } = require("../controllers/auth");
// const refreshToken = require("../services/refresh-token");
// const { user, addMember, updateMember } = require("../controllers/user");
// const { verifyToken } = require("../middlewares/verify");
// const { otp_generate, otp_verify } = require("../controllers/otp");

// const Router = express.Router();
// // auth
// Router.post(
//   "/login",
//   [
//     body("email", "Email required").exists().isEmail(),
//     body("password", "Password length should be atleast 8 characters"),
//   ],
//   validate,
//   login,
//   refreshToken
// );

// Router.get(
//   "/profile",
//   [header("Authorization", "Authorization token is required").exists()],
//   validate,
//   verifyToken,
//   user
// );

// Router.post(
//   "/add-member",
//   [
//     body("first_name", "First name is required").exists(),
//     body("last_name", "Last name is required").exists(),
//     body("email", "Email is required").exists().isEmail(),
//     body("memberType", "Member type is required").exists(),
//     [header("Authorization", "Authorization token is required").exists()],
//   ],
//   validate,
//   verifyToken,
//   addMember
// );

// Router.post(
//   "/otp",
//   [body("email", "Email is required").exists().isEmail()],
//   validate,
//   otp_generate
// );

// Router.post(
//   "/otp-verify",
//   [
//     body("otp", "OTP is required").exists(),
//     [header("Authorization", "Authorization token is required").exists()],
//   ],
//   validate,
//   otp_verify
// );

// Router.put(
//   "/update",
//   [header("Authorization token is required").exists()],
//   validate,
//   verifyToken,
//   updateMember
// );

// module.exports = Router;
