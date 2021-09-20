const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPass,
    });

    const user = await newUser.save();
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (err) {
    res.status(500).json("Something went wrong while saving");
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    !user && res.status(403).json("Wrong credentials!!!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(40).json("Wrong credentials");

    const { password, ...rests } = user._doc;
    res.status(200).json(rests);
  } catch (error) {
    res.status(500).json("user was not found due to and error");
  }
});

module.exports = router;
