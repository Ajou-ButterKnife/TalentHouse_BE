const User = require("../models/user");
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.get("/", async (req, res, next) => {
  console.log("GET :/login");
  res.send("login Server");
});

// 어플 내에서의 일반 로그인
router.post("/normal", async (req, res) => {  
});

// 소셜 로그인
router.post("/social", async (req, res, next) => {
  const user_uid = req.body.uid;
  const user = User.findOne({uid:user_uid}, function(err, user_dt) {
    if(err) {
      res.status(500).send(err);
    }else {
      if(user_dt == null){
        res.status(200).json({"socialFlag" : "signup"});   // 회원가입으로 가세요
      } else {
        res.status(200).json({"socialFlag" : "login"});   // 로그인 성공
      }
    }
  })
  

});

module.exports = router;
