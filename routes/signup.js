const User = require("../models/user");
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

var admin = require("firebase-admin");
var serviceAccount = require("../butterfly-efb30-firebase-adminsdk-2x0u2-344c142e5a.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.get("/", async (req, res, next) => {
  console.log("GET :/signup");
  res.send("signup Server");
});

router.post("/", async (req, res) => {
  var data = req.body;
  console.log(data);
  res.send(data);
});

router.post("/normal", async (req, res) => {
  var data = req.body;
  console.log("/normal");

  const user = new User({
    email: data.email,
    password: crypto
      .createHash("sha512")
      .update(data.password)
      .digest("base64"),
    phone_num: data.phone,
    nickname: data.nickname,
    category: data.category,
  });
  console.log("Here");
  user.save((err) => {
    if (err) {
      console.log("/normal : Save Error");
      res.status(200).send({ save: "fail" });
    } else {
      console.log("/normal : Save Success");
      res.status(500).send({ save: "success" });
    }
  });
});

router.post("/social", async (req, res, next) => {});

module.exports = router;
