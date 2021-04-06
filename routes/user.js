// const User = require("../models/user");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  // const users = await User.find({});
  //   res.json(users);
  // res.send(users);
  //   res.send("This is Login!");
  res.send("user server!====");
  console.log("GET :/user");
});

router.post("/", async (req, res, next) => {
  // const users = await User.find({});
  // res.json(users);
  //   res.send("This is login!!!");
  console.log("POST :/user");
  // var data = req.body;
  console.log(req);
});

module.exports = router;
