// "use strict";
// const db = require("../db");
// const bcrypt = require("bcryptjs");
// const {
//   generateHash,
//   compareHash,
//   generateJWT,
// } = require("../services/misc-services");
// const { sendMail } = require("../services/mail-services");

// const register = async (req, res) => {
//   try {
//     const { user, response, tokens } = req;

//     // generate one time password
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     console.log("otp : ", otp);

//     // hashing OTP
//     const salt = await bcrypt.genSalt(10);
//     const hashedOtp = await generateHash(otp, salt);

//     const getUser = await db("users")
//       .insert({
//         email: user.payload.email,
//         first_name: user.payload.given_name,
//         last_name: user.payload.family_name,
//         profile_id: user.payload.sub,
//         password: hashedOtp,
//         yt_channel: response.data.items[0].id,
//         access_token: tokens.access_token,
//         refresh_token: tokens.refresh_token,
//         thumbnail: response.data.items[0].snippet.thumbnails.medium.url,
//         publishedAt: response.data.items[0].snippet.publishedAt,
//         role: "owner",
//       })
//       .returning([
//         "id",
//         "email",
//         "first_name",
//         "last_name",
//         "profile_id",
//         "yt_channel",
//         "thumbnail",
//         "publishedAt",
//       ])
//       .then((res) => res[0]);

//     if (!getUser) {
//       res.status(400);
//       throw new Error("User not found. Please register first.");
//     }

//     // Save the user's YouTube account details to the database

//     const channel = await db("channels")
//       .insert({
//         title: response.data.items[0].snippet.title,
//         description: response.data.items[0].snippet.description,
//         url: response.data.items[0].snippet.customUrl,
//         yt_channel_id: response.data.items[0].id,
//         user_id: getUser.id,
//         subscriberCount: response.data.items[0].statistics.subscriberCount,
//         videoCount: response.data.items[0].statistics.videoCount,
//         viewCount: response.data.items[0].statistics.viewCount,
//       })
//       .returning([
//         "id",
//         "title",
//         "description",
//         "url",
//         "yt_channel_id",
//         "subscriberCount",
//         "videoCount",
//         "viewCount",
//       ])
//       .then((res) => res[0]);

//     const token = generateJWT(
//       { id: getUser.id, email: getUser.email },
//       { expiresIn: "30d" }
//     );

//     // console.log({ token, channel, success: true, user: getUser });

//     await sendMail({
//       to: getUser.email,
//       subject: "Registration Successfull | " + process.env.COMPANY,
//       html: "Your Password is: <b>" + otp + "</b>",
//     }).catch((err) => {
//       return res
//         .status(424)
//         .send({ message: err.message || "OTP is not sent", success: false });
//     });

//     res.status(200).send({
//       // response,
//       // user,
//       token,
//       channel,
//       success: true,
//       user: getUser,
//     });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: error.detail, message: error.message, success: false });
//   }
// };

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await db("users")
//       .select(
//         "id",
//         "first_name",
//         "last_name",
//         "email",
//         "password",
//         "uuid",
//         "username",
//         "role",
//         "profile_id",
//         "yt_channel",
//         "access_token",
//         "refresh_token"
//       )
//       .where({ email })
//       .first();

//     // check if user exists
//     if (!user) {
//       throw new Error("Invalid email or password");
//     }

//     // check if password is correct
//     const isMatch = await compareHash(password, user.password);
//     if (!isMatch) {
//       throw new Error("Invalid email or password");
//     }

//     // generate token
//     const token = generateJWT({ id: user.id, email }, { expiresIn: "30d" });

//     req.user = user;
//     req.token = token;
//     next();
//   } catch (error) {
//     res
//       .status(400)
//       .send({ error: error.detail || error.message, success: false });
//   }
// };

// module.exports = { register, login };
