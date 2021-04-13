const User = require("../models/user");
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

router.get("/", async (req, res, next) => {
  console.log("GET :/login");
  res.send("login Server");
});

// 어플 내에서의 일반 로그인
router.post("/normal", async (req, res) => {});

// 소셜 로그인
router.post("/social", async (req, res, next) => {});

module.exports = router;
