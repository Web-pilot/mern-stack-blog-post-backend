const express = require("express");
const router = express.Router();
const Category = require("../models/Category.model");

router.post("/", async (req, res) => {
  const newCat = new Category(req.body);
  try {
    const saveCategory = await newCat.save();
    res.status(200).json(saveCategory);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
