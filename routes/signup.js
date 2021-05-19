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
  user.save((err) => {
    if (err) {
      console.log("/normal : Save Error");
      res.status(500).send({ result: "Fail" });
    } else {
      console.log("/normal : Save Success");
      res.status(200).send({ result: "Success" });
    }
  });
});

router.post("/social", async (req, res, next) => {
  var data = req.body;

  var userInfo = await admin.auth().getUser(data.uid);
  const user = new User({
    email: userInfo.email,
    nickname: data.nickname,
    phone_num: data.phone_num,
    category: data.category,
    uid: data.uid,
  });
  user.save((err) => {
    if (err) {
      //console.log(err);
      res.status(200).json({ result: "Fail" });
    } else {
      res.status(200).json({ result: "Success" });
    }
  });
});

router.post("/nickname_overlap_check", async (req, res, next) => {
  const user_nickname = req.body.nickname;
  User.findOne({ nickname: user_nickname }, function (err, check_dt) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (check_dt == null) {
        // 중복되는 닉네임 없음
        res.status(200).json({ result: "Success" });
      } else {
        // 중복되는 닉네임 존재
        res.status(200).json({ result: "Fail" });
      }
    }
  });
});

router.post("/email_overlap_check", async (req, res, next) => {
  console.log("Here");
  const user_email = req.body.email;
  User.findOne({ email: user_email }, function (err, check_dt) {
    if (err) {
      res.status(500).send(err);
    } else {
      if (check_dt == null) {
        // 중복되는 이메일 없음
        res.status(200).json({ result: "Success" });
      } else {
        // 중복되는 이메일 존재
        res.status(200).json({ result: "Fail" });
      }
    }
  });
});

module.exports = router;
