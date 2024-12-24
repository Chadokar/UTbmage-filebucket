// imports
require("./config/config");
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
app.use(express.json());

// set up cors
// app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: "*", // Adjust this to your specific allowed origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Range"],
  })
);
// initialize app

// set up routes
const routes = require("./routes");

app.get("/", (req, res) => {
  res.status(201).json("status: success");
});
for (let prefix in routes) {
  app.use(`/${prefix}`, routes[prefix]);
}

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
