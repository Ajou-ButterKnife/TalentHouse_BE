const Post = require("../models/post");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  const posts = await Post.find({});
  console.log("GET Post");
  const retval = {
    data: posts,
  };
  res.status(200).send(retval);
});

router.post("/create", async (req, res) => {
  var data = req.body;

  const post = new Post({
    writer_id: data.writerId,
    writer_nickname: data.writerNickname,
    title: data.title,
    category: data.category,
    description: data.description,
  });
  post.save((err) => {
    if (err) {
      console.log("/create : Save Error");
      res.status(500).send({ result: "Fail" });
    } else {
      console.log("/create : Save Success");
      res.status(200).send({ result: "Success" });
    }
  });
});

module.exports = router;
