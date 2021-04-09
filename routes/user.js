const User = require("../models/user");
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.get("/", async (req, res, next) => {
  // const users = await User.find({});
  //   res.json(users);
  // res.send(users);
  //   res.send("This is Login!");
  res.send("user server!====");
  console.log("GET :/user");
});

router.post("/signup", (req, res) => {
  var data = req.body;

  const user = new User({
    email: data.email,
    password: crypto.createHash("sha512").update(data.pwd).digest("base64"),
    phone_num: data.phone_num,
  });
  user.save((err) => {
    if (err) {
      res.send({ save: "fail" });
    } else {
      res.send({ save: "success" });
    }
  });
});

router.post("/", async (req, res, next) => {
  // const users = await User.find({});
  // res.json(users);
  //   res.send("This is login!!!");

  console.log("POST :/user");
  // var data = req.body;
  console.log(req.body);
  res.send(req.body);
});

module.exports = router;
