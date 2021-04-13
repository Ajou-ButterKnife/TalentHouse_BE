const User = require("../models/user");
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

var admin = require("firebase-admin");
var serviceAccount = require("../butterfly-efb30-firebase-adminsdk-2x0u2-344c142e5a.json");
const { db } = require("../models/user");
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

router.post("/social", async (req, res, next) => {
  const user_email = req.body.email;
  const user_nickname = req.body.nickname;
  const user_phone_num = req.body.phone_num;
  const user_category = req.body.category;
  const user_uid = req.body.uid;

  User.create({
    email : user_email,
    nickname : user_nickname,
    phone_num : user_phone_num,
//  "category" : user_category,
    uid : user_uid}).then(function(results) {
      console.log("insert success");
    }, function(err) {
      console.log(err);
    });
  });

router.post("/nickname_overlap_check", async (req, res, next) => {
  const user_nickname = req.body.nickname;
  const user_check = await User.findOne({nickname:user_nickname}, function(err, check_dt) {
    if(err) {
      res.status(500).send(err);
    }else {
      if(check_dt == null){   // 중복되는 닉네임 없음
        res.status(200).json({"result" : "Success"});
      } else {                // 중복되는 닉네임 존재
        res.status(200).json({"result" : "Fail"});
      }
    }
  })
});

router.post("/email_overlap_check", async (req, res, next) => {
  const user_email = req.body.email;
  const user_check = await User.findOne({email:user_email}, function(err, check_dt) {
    if(err) {
      res.status(500).send(err);
    }else {
      if(check_dt == null){   // 중복되는 이메일 없음
        res.status(200).json({"result" : "Success"});
      } else {                // 중복되는 이메일 존재
        res.status(200).json({"result" : "Fail"});
      }
    }
  })
});

module.exports = router;
