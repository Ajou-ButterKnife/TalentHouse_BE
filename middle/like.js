const Post = require('../models/post');
const User = require('../models/user');
const express = require('express');

const createLike = async (req, res, next) => {
  console.log('like');
  const post_Id = req.params.postId;
  const user_Id = req.body.userId;

  const new_Like_IDs = {
    user_id: req.body.userId,
    nickname: req.body.nickname,
    profile: req.body.profile,
  };

  Post.findById(post_Id).then((post) => {
    const like_IDs = post.like_IDs;
    var check = true;
    for (var i = 0; i < like_IDs.length; i++) {
      if (like_IDs[i].user_id == user_Id) {
        check = false;
        break;
      }
    }
    if (check == true) {
      // 좋아요
      Post.updateOne(
        { _id: post_Id },
        { $push: { like_IDs: new_Like_IDs } }
      ).then(() => {
        temp_like_cnt = post.like_cnt + 1;
        Post.findByIdAndUpdate(
          post_Id,
          { like_cnt: temp_like_cnt },
          (err, data) => {
            if (err) {
              res.status(500).json({ result: 'Fail' });
            } else {
              User.updateOne(
                { _id: user_Id },
                { $push: { like_post: post_Id } }
              ).then(() => {
                req.likeCnt = {
                  temp_like_cnt: temp_like_cnt,
                };
                req.targetUser = {
                  post_id: post_Id,
                  flag: 2,
                };
                next();
              });
            }
          }
        );
      });
    } else {
      // 좋아요 취소
      Post.updateOne(
        { _id: post_Id },
        { $pull: { like_IDs: new_Like_IDs } }
      ).then(() => {
        temp_like_cnt = post.like_cnt - 1;
        Post.findByIdAndUpdate(
          post_Id,
          { like_cnt: temp_like_cnt },
          (err, data) => {
            if (err) {
              res.status(500).json({ result: 'Fail' });
            } else {
              User.updateOne(
                { _id: user_Id },
                { $pull: { like_post: post_Id } }
              ).then(() => {
                console.log('minus 전송' + temp_like_cnt);
                res
                  .status(200)
                  .json({ result: 'Minus', likeCnt: temp_like_cnt });
              });
            }
          }
        );
      });
    }
  });
};

module.exports = {
  createLike: createLike,
};
