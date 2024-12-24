const db = require("../db");
const { verifyJWT, parseToken } = require("../services/misc-services");

const verifyToken = async (req, res, next) => {
  try {
    // check bearer token is present
    // console.log("req.headers.authorization : ", req.headers.authorization);
    if (!req.headers.authorization.startsWith("Bearer")) {
      res.status(401);
      throw new Error("Invalid token");
    }

    const token = parseToken(req);

    // console.log("token : ", token);

    // check if token is present
    if (!token) {
      res.status(401);
      throw new Error("Access denied. No token provided.");
    }

    // verify token
    const decoded = verifyJWT(token);

    // check if token expired
    if (!decoded) {
      res.status(401);
      throw new Error("Token expired");
    }

    const { id, email } = decoded;
    let user = null;
    if (id) {
      user = await db("users").where({ id }).first();
    } else if (email) {
      user = await db("users").where({ email }).first();
    }
    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    req.user = user;

    next();
  } catch (error) {
    if (res.statusCode < 400) res.status(500);
    res.send({
      error: error.message || "Internal server error",
      success: false,
    });
  }
};

const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Unauthorized", success: false });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
