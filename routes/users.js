const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post.model");
const bcrypt = require("bcrypt");

//UPDATED
router.put("/:id", async (req, res) => {
  if (req.body.userId == req.params.id) {
    const oldUser = await User.findById(req.params.id);
    const post = await Post.find({ username: oldUser.username });

    if (post) {
      await Post.find({ username: oldUser.username }).updateMany({
        username: req.body.username
      });
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(401).json("You can only edit your account");
  }
});

//DELETE
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("user has been deleted");
      } catch (error) {
        res.status(500).json(error);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(500).json("You can only delete your account");
  }
});

//GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;
