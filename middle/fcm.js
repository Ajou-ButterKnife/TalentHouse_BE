const User = require('../models/user');
const Post = require('../models/post');
const express = require('express');
const util = require('../util');

const searchFcmKey = async (req, res, next) => {
  try {
    const findPost = await Post.findOne({
      _id: req.targetUser.post_id,
    });

    const findFcm = await User.findOne({
      _id: findPost.writer_id,
    });
    console.log(req.targetUser.flag);
    req.targetUser = {
      userNickname: findPost.writer_nickname,
      postTitle: findPost.title,
      fcmKey: findFcm.fcm_key,
      flag: req.targetUser.flag,
    };
    next();
  } catch (e) {
    res.status(400).json({ message: 'fcmKey not found' });
  }
};

const createFcm = async (req, res, next) => {
  console.log('create');
  const nickname = req.targetUser.userNickname;
  const postTitle = req.targetUser.postTitle;
  const token = req.targetUser.fcmKey;
  const flag = req.targetUser.flag;
  console.log(nickname);
  console.log(postTitle);
  console.log(token);
  console.log(flag);
  if (flag == 1) {
    // 댓글 일 경우
    const title = "'" + nickname + "'님, 댓글 알림이에요!";
    const body =
      "'" + postTitle + "' 에 누군가 댓글을 작성했어요. 지금 확인해보세요!";
    console.log(title + '/' + body);
    await util.sendFcm(title, body, token);
  }
  next();
};
module.exports = {
  searchFcmKey: searchFcmKey,
  createFcm: createFcm,
};
