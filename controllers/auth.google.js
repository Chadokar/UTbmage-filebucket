// const { google } = require("googleapis");

// const db = require("../db");
// const { generateHash, generateJWT } = require("../services/misc-services");
// const bcrypt = require("bcryptjs");
// const { sendMail } = require("../services/mail-services");
// const { register } = require("./auth");

// const client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URL
// );

// // Oauth2 URL generator
// const redirectedUrl = async (req, res) => {
//   console.log("entered");
//   try {
//     const authorizationUrl = client.generateAuthUrl({
//       access_type: "offline",
//       scope: [
//         "email",
//         "profile",
//         "https://www.googleapis.com/auth/youtube",
//         "https://www.googleapis.com/auth/youtube.force-ssl",
//         "https://www.googleapis.com/auth/youtube.readonly",
//         "https://www.googleapis.com/auth/youtube.upload",
//         "https://www.googleapis.com/auth/youtubepartner",
//         "https://www.googleapis.com/auth/youtubepartner-channel-audit",
//       ],
//       include_granted_scopes: true,
//     });
//     res.status(200).send({ url: authorizationUrl });
//   } catch (error) {
//     if (error.code < 400) res.status(500);
//     res.send({ error: error });
//   }
// };

// // Oauth2 code decoder
// const decoder = async (req, res, next) => {
//   try {
//     const code = req.query.code;
//     console.log("code : ", code);
//     if (!code) {
//       res.status(400).send({ error: "Authorization code not provided" });
//       return;
//     }

//     // Use the OAuth2Client instance to get the token
//     const { tokens } = await client.getToken(code);
//     // console.log("token : ", tokens);

//     // user details
//     const user = await client.verifyIdToken({
//       idToken: tokens.id_token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     // // console.log("User: ", user);

//     // Set the credentials for the OAuth2 client
//     client.setCredentials(tokens);

//     // Create a YouTube service instance
//     const youtube = google.youtube({ version: "v3", auth: client });

//     // // Fetch user's profile information to get the email
//     // const oauth2 = google.oauth2({ version: "v2", auth: client });
//     // const profile = await oauth2.userinfo.get();

//     // Fetch user's YouTube account details
//     const response = await youtube.channels.list({
//       part: "snippet,contentDetails,statistics",
//       mine: true,
//     });

//     // const stats = await youtube.channels.list({
//     //   part: ["statistics"],
//     //   id: response.data.items[0].id,
//     // });
//     // // const youtubeResponse = await fetch(
//     // //     "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true",
//     // //     {
//     // //       headers: {
//     // //         Authorization: `Bearer ${tokens.access_token}`,
//     // //       },
//     // //     }
//     // //   ).then((res) => res.json());

//     if (!response.data.items.length) {
//       res.status(400);
//       throw new Error("No YouTube account found");
//     }

//     // get user usinng email or profile_id
//     const getUser = await db("users")
//       .select(["role", "id", "email", "password"])
//       .where({ email: user.payload.email })
//       .orWhere({ profile_id: user.payload.sub })
//       .first();

//     if (getUser && (getUser.role !== "owner" || getUser.role !== "admin")) {
//       res.status(400);
//       throw new Error("Please login using email and password");
//     }

//     req.user = user;
//     req.tokens = tokens;
//     req.response = response;

//     next();
//   } catch (error) {
//     console.error(error);

//     if (error.code < 400) res.status(500);
//     res.send({ error: error.detail || error.message });
//   }
// };

// const googlelogin = async (req, res, next) => {
//   try {
//     const { user } = req;
//     profile_id = user.payload.sub;
//     const getUser = await db("users").where({ profile_id }).first();
//     if (!getUser) {
//       return register(req, res);
//     }

//     const token = generateJWT(
//       { id: getUser.id, email: getUser.email },
//       { expiresIn: "30d" }
//     );

//     req.token = token;
//     req.user = getUser;
//     next();
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: error.detail, message: error.message, success: false });
//   }
// };

// // const decoder = async (req, res) => {
// //   try {
// //     const code = req.query.code;
// //     if (!code) {
// //       res.status(400).send({ error: "Authorization code not provided" });
// //       return;
// //     }

// //     // Use the OAuth2Client instance to get the token
// //     const { tokens } = await client.getToken(code);
// //     // console.log("token : ", tokens);

// //     // user details
// //     const user = await client.verifyIdToken({
// //       idToken: tokens.id_token,
// //       audience: process.env.GOOGLE_CLIENT_ID,
// //     });

// //     // console.log("User: ", user);

// //     // Set the credentials for the OAuth2 client
// //     client.setCredentials(tokens);

// //     // Create a YouTube service instance
// //     const youtube = google.youtube({ version: "v3", auth: client });

// //     // // Fetch user's profile information to get the email
// //     // const oauth2 = google.oauth2({ version: "v2", auth: client });
// //     // const profile = await oauth2.userinfo.get();

// //     // Fetch user's YouTube account details
// //     const response = await youtube.channels.list({
// //       part: "snippet,contentDetails,statistics",
// //       mine: true,
// //     });
// //     // const youtubeResponse = await fetch(
// //     //     "https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails,statistics&mine=true",
// //     //     {
// //     //       headers: {
// //     //         Authorization: `Bearer ${tokens.access_token}`,
// //     //       },
// //     //     }
// //     //   ).then((res) => res.json());

// //     if (!response.data.items.length) {
// //       res.status(400);
// //       throw new Error("No YouTube account found");
// //     }

// //     const { id } = await db("users")
// //       .select("id")
// //       .where({ email: user.payload.email })
// //       .first();

// //     // Save the user's YouTube account details to the database

// //     const video = await db("channels")
// //       .insert({
// //         title: response.data.items[0].snippet.title,
// //         description: response.data.items[0].snippet.description,
// //         url: response.data.items[0].snippet.customUrl,
// //         yt_channel_id: response.data.items[0].id,
// //         user_id: id,
// //       })
// //       .returning(["id", "title", "description", "url", "yt_channel_id"])
// //       .then((res) => res[0]);

// //     await db("users").where({ id }).update({
// //       yt_channel: video.id,
// //       access_token: tokens.access_token,
// //       profile_id: user.payload.sub,
// //     });

// //     res.status(200).send({
// //       token: tokens,
// //       youtubeAccount: response.data,
// //       success: true,
// //       user,
// //       // profile: profile.data,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res
// //       .status(error.code >= 400 ? error.code : 500)
// //       .send({ error: error.message });
// //   }
// // };

// module.exports = { redirectedUrl, decoder, googlelogin };
