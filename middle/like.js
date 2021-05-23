const Post = require('../models/post');
const User = require('../models/user');
const express = require('express');

const createLike = async (req, res, next) => {
  console.log('like');
  const data = req.params;
  const post_Id = data.postId;
  const user_Id = data.userId;

  Post.findById(post_Id).then((post) => {
    const like_IDs = post.like_IDs;
    var check = true;
    for (var i = 0; i < like_IDs.length; i++) {
      if (like_IDs[i] == user_Id) {
        check = false;
        break;
      }
    }
    if (check == true) {
      // 좋아요
      Post.updateOne({ _id: post_Id }, { $push: { like_IDs: user_Id } }).then(
        () => {
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
        }
      );
    } else {
      // 좋아요 취소
      Post.updateOne({ _id: post_Id }, { $pull: { like_IDs: user_Id } }).then(
        () => {
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
                  console.log('end');
                  res
                    .status(200)
                    .json({ result: 'Minus', likeCnt: temp_like_cnt });
                });
              }
            }
          );
        }
      );
    }
  });
};

module.exports = {
  createLike: createLike,
};
