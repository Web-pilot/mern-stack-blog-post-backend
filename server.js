const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postsRoutes = require("./routes/posts");
const categoriesRoutes = require("./routes/categories");
const multer = require("multer");
const path = require("path");

require("dotenv").config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

const url = process.env.ATLAS_URL;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to mongoDb"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("file has been upload successfully");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/categories", categoriesRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
