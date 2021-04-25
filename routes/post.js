const Post = require("../models/post");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  console.log("GET :/signup");
  res.send("signup Server");
});

router.post("/", async (req, res) => {
  var data = req.body;
  console.log(data);
  res.send(data);
});

module.exports = router;
