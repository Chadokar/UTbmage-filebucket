// const db = require("../db");
// const { sendMail } = require("../services/mail-services");
// const { generateJWT } = require("../services/misc-services");

// const user = (req, res) => {
//   const { user } = req;
//   res.status(201).json({ user, success: true });
// };

// const addMember = async (req, res) => {
//   const { first_name, last_name, email, memberType } = req.body;
//   const role = memberType.value || "editor";
//   try {
//     const user = req.user;
//     if (user.role !== "manager" && user.role !== "owner") {
//       return res.status(403).json({ error: "Unauthorized", success: false });
//     }

//     const otp = Math.floor(100000 + Math.random() * 900000);

//     const salt = await bcrypt.genSalt(10);
//     const hashedOtp = await generateHash(otp, salt);

//     await db("users").insert({
//       first_name,
//       last_name,
//       email,
//       password: hashedOtp,
//       role,
//     });

//     await sendMail({
//       to: email,
//       subject:
//         "Added to | " +
//         process.env.COMPANY +
//         " | by " +
//         user.first_name +
//         " " +
//         user.last_name,
//       html: "Your Current Password is: <b>" + otp + "</b>",
//     }).catch((err) => {
//       return res
//         .status(424)
//         .send({ message: err.message || "OTP is not sent", success: false });
//     });

//     res.status(201).json({
//       message: first_name + " " + last_name + " added successfully",
//       success: true,
//     });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: error.detail || error.message || error, success: false });
//   }
// };

// const updateMember = async (req, res) => {
//   try {
//     const { email, id } = req?.user || req.body;
//     let user = null;
//     if (email) {
//       user = await db("users").where({ email }).first();
//     } else {
//       user = await db("users").where({ id }).first();
//     }
//     if (!user) {
//       return res.status(400).json({ error: "User not found", success: false });
//     }

//     const updatedUser = await db("users")
//       .where({ id: user.id })
//       .update({ ...req.body })
//       .then((res) => res[0]);

//     const token = generateJWT(
//       { id: updatedUser.id, email: updatedUser.email },
//       { expiresIn: "30d" }
//     );

//     res.status(200).json({ token, user: updatedUser, success: true });
//   } catch (error) {
//     res
//       .status(400)
//       .json({ error: error.detail || error.message || error, success: false });
//   }
// };

// module.exports = { user, addMember, updateMember };
