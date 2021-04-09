const User = require("../models/user");
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

var admin = require("firebase-admin");
var serviceAccount = require("../butterfly-efb30-firebase-adminsdk-2x0u2-344c142e5a.json");
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
 
});

module.exports = router;
