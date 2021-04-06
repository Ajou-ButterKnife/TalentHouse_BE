const User = require("../models/user");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const users = await User.find({});
  //   res.json(users);
  res.send(users);
  //   res.send("This is Login!");
});

router.post("/", async (req, res, next) => {
  const users = await User.find({});
  res.json(users);
  //   res.send("This is login!!!");
});

module.exports = router;
