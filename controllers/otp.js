// const {
//   generateHash,
//   generateJWT,
//   handlebarsReplacements,
//   parseToken,
//   compareHash,
// } = require("../services/misc-services");
// const { templateToHTML, sendMail } = require("../services/mail-services");
// const bcrypt = require("bcryptjs");
// const db = require("../db");

// const otp_generate = async (req, res) => {
//   try {
//     // get email
//     const { email } = req.body;

//     // check if user exists of giver email or username
//     let user = await db("users").where({ email }).first();

//     if (!user) {
//       res.status(400);
//       throw new Error("Email not found");
//     }

//     const payload = { email };

//     //generating OTP
//     let otp = Math.floor(100000 + Math.random() * 900000);

//     console.log("opt : ", otp);

//     // hashing OTP
//     const salt = await bcrypt.genSalt(10);
//     const hashedOtp = await generateHash(otp, salt);
//     payload.hashedOtp = hashedOtp;

//     // generating content
//     const replacements = { otp, expiresIn: "10 hourse" };
//     const source = templateToHTML("templates/otp.html");
//     const content = handlebarsReplacements({ source, replacements });

//     // generating token ref
//     const token = generateJWT(payload, { expiresIn: "1d" });

//     // sending mail
//     await sendMail({
//       to: email,
//       subject: "OTP verification | " + process.env.COMPANY,
//       html: content,
//     })
//       .then(() =>
//         res
//           .status(200)
//           .send({ message: "OTP sent to your mail", token, success: true })
//       )
//       .catch((err) => {
//         return res.status(424).send({
//           message: err.message || err.detail || "OTP is not sent",
//           success: false,
//         });
//       });
//   } catch (error) {
//     if (res.statusCode < 400) res.status(500);
//     res.send({
//       message: error.message || error.detail || "Internal server error",
//       success: false,
//     });
//   }
// };

// const otp_verify = async (req, res, next) => {
//   try {
//     // get otp
//     const otp = parseInt(req.body.otp);

//     // parse token
//     const { email, hashedOtp } = parseToken(req);

//     if (!email || !hashedOtp) {
//       res.status(498);
//       throw new Error("OTP has expired");
//     }

//     // compare otp
//     const isMatch = await compareHash(otp, hashedOtp);

//     // if otp is not matched
//     if (!isMatch) {
//       res.status(400);
//       throw new Error("Invalid OTP");
//     }

//     // generate token
//     const token = generateJWT({ email }, { expiresIn: "1d" });
//     res.status(200).send({ message: "OTP verified", token, success: true });
//   } catch (error) {
//     if (res.statusCode < 400) res.status(500);
//     res.send({
//       message: error.message || "Internal server error",
//       success: false,
//     });
//   }
// };

// module.exports = {
//   otp_generate,
//   otp_verify,
// };
