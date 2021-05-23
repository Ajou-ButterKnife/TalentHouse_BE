const Post = require('../models/post');
const User = require('../models/user');
const express = require('express');

const createComment = async (req, res, next) => {
  const data = req.body;
  const post_id = data.postId;
  const newComment = {
    post_id: data.postId,
    writer_id: data.userId,
    writer_nickname: data.nickname,
    comment: data.comment,
    profile: data.profile,
    date: Date.now(),
  };
  req.targetUser = {
    post_id: data.postId,
    flag: 1,
  };
  console.log(req.targetUser.post_id);
  Post.updateOne({ _id: post_id }, { $push: { comments: newComment } })
    .then(() => {
      next();
    })
    .catch((err) => {
      res.status(500).json({ result: 'Fail' });
    });
};

module.exports = {
  createComment: createComment,
};
