const User = require("../models/user");
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

var admin = require("firebase-admin");
var serviceAccount = require("../butterfly-efb30-firebase-adminsdk-2x0u2-344c142e5a.json");
const { db } = require("../models/user");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

router.get("/", async (req, res, next) => {
  console.log("GET :/signup");
  res.send("signup Server");
});

router.post("/normal", async (req, res) => {

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

module.exports = router;
