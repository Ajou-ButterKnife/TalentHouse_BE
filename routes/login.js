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
  const email = req.body.email;
  const password = crypto
      .createHash("sha512")
      .update(req.body.password)
      .digest("base64");

  console.log("POST : /login/normal\nrequest")
  console.log(req.body);
  const findUser = User.findOne({
    email: email,
    password: password
  });

  findUser.getFilter();

  const result = await findUser.exec();

  const response = {};
  response["result"] = result != null ? "Success" : "Fail";
  response["detail"] = result != null ? "" : "아이디 혹은 비밀번호가 잘못되었습니다.";
  response["data"] = result != null ? { "_id" : result._id } : null;
  console.log("response")
  console.log(response)
  console.log()
  res.status(200).send(response);
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
