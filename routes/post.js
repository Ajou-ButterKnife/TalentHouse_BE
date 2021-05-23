const Post = require("../models/post");
const User = require("../models/user");
const express = require("express");
const { response } = require("express");

const router = express.Router();

const offset = 10;

router.get("/", async (req, res, next) => {
  let categoryTemp;
  if (req.query.category != "all") {
    categoryTemp = req.query.category.split("-");
  } else {
    categoryTemp = ["춤", "노래", "랩", "그림", "사진", "기타"];
  }

  const posts = await Post.find({
    category: { $in: categoryTemp },
  })
    .sort({
      update_time: -1,
    })
    .skip(req.query.page * offset)
    .limit(offset);

  const retval = {
    data: posts,
  };
  res.status(200).send(retval);
});

router.get("/hot", async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  const posts = await Post.find({
    update_time: { $gt: startDate, $lt: endDate },
  })
    .distinct("category")
    .sort({
      update_time: -1,
    })
    .skip(req.query.page * offset)
    .limit(offset);

  console.log(posts);
  const retval = {
    data: posts,
  };
  res.status(200).send(retval);
});

router.get("/search", async (req, res, next) => {
  const offset = 3;
  if (req.query.search_type == 1) {
    // 작성자 검색
    const posts = await Post.find({
      writer_nickname: req.query.search_item,
    })
      .sort({
        update_time: -1,
      })
      .skip(req.query.page * offset)
      .limit(offset);
    const retval = {
      data: posts,
    };
    res.status(200).json(retval);
  } else {
    // 글 제목 검색
    const query = new RegExp(req.query.search_item);
    const posts = await Post.find({
      title: query,
    })
      .sort({
        update_time: -1,
      })
      .skip(req.query.page * offset)
      .limit(offset);
    const retval = {
      data: posts,
    };
    res.status(200).json(retval);
  }
});

router.get("/:id/:page", async (req, res, next) => {
  console.log("/" + req.params.id + "/" + req.params.page);
  const posts = await Post.find({ writer_id: req.params.id }, {})
    .sort({
      update_time: -1,
    })
    .skip(req.params.page * offset)
    .limit(offset);
  const retval = {
    data: posts,
  };
  res.status(200).send(retval);
});

router.post("/create", async (req, res) => {
  var data = req.body;

  const post = new Post({
    writer_id: data.id,
    writer_nickname: data.nickname,
    category: data.category,
    title: data.title,
    description: data.description,
    image_url: data.imageUrl,
    video_url: data.videoUrl,
    update_time: Date.now(),
  });
  post.save((err) => {
    if (err) {
      res.status(500).json({ result: "Fail" });
    } else {
      res.status(200).json({ result: "Success" });
    }
  });
});

router.post("/comment/:id", async (req, res) => {
  console.log("/comment/:id");
  Post.findById(req.params.id)
    .then((p) => {
      res.status(200).json({ result: "Success", data: p.comments });
    })
    .catch((err) => res.status(500).json({ result: "Fail" }));
});

router.post("/create/comment", async (req, res) => {
  console.log("/create/comment");
  const data = req.body;
  const post_id = data.postId;
  const newComment = {
    post_id: data.postId,
    writer_id: data.userId,
    writer_nickname: data.nickname,
    profile: data.profile,
    comment: data.comment,
    date: Date.now(),
  };

  Post.updateOne({ _id: post_id }, { $push: { comments: newComment } })
    .then(() => {
      res.status(200).json({ result: "Success", data: newComment });
    })
    .catch((err) => {
      res.status(500).json({ result: "Fail" });
    });
});

router.delete("/delete/comment", async (req, res) => {
  console.log("/delete/comment");

  const post_id = req.body.postId;
  const user_id = req.body.userId;
  const date = Number(req.body.date);

  Post.updateOne(
    { _id: post_id },
    { $pull: { comments: { writer_id: user_id, date: date } } }
  )
    .then(() => {
      res.status(200).json({ result: "Success" });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ result: "Fail" });
    });
});

router.get("/get/favorite/:postId", (req, res) => {
  console.log("/favorite/:postId");
  const post_id = req.params.postId;
  Post.findByIdAndUpdate(post_id).then((post) => {
    res.status(200).send({ likeCnt: post.like_cnt, likeIds: post.like_IDs });
  });
});

router.put("/update/comment/:id", async (req, res) => {
  console.log("/update/comment");
  const post_id = req.params.id;
  const user_id = req.body.userId;
  const comment_date = req.body.date;
  const newComment = req.body.newComment;

  Post.findById(post_id).then((post) => {
    const update_comments = post.comments;
    let response_comment;
    for (var i = 0; i < update_comments.length; i++) {
      if (
        update_comments[i].writer_id == user_id &&
        update_comments[i].date == comment_date
      ) {
        update_comments[i].comment = newComment;
        update_comments[i].date = Date.now();
        response_comment = update_comments[i];
        break;
      }
    }
    Post.findByIdAndUpdate(
      post_id,
      { comments: update_comments },
      (err, data) => {
        if (err) {
          console.log(err);
          res.status(500).json({ result: "Fail" });
        } else {
          res.status(200).json({ result: "Success", data: response_comment });
        }
      }
    );
  });
});

router.post("/favorite", async (req, res) => {
  console.log("/favorite");
  const post_id = req.body.postId;

  Post.findById(post_id).then((post) => {
    res.status(200).json({ data: post.like_IDs });
  });
});

router.get("/favorite", async (req, res) => {
  const userId = req.query.id;
  const page = req.query.page;
  console.log("/favorite");
  const user = await User.findOne(
      {_id: userId},
      {_id: false, like_post: true}
  );

  const postIds = []

  for(var i = page * offset; i < user.like_post.length && i < (page + 1) * offset; i++) {
    postIds.push(user.like_post[i]);
  }

  const response = {
    "data" : []
  }

  for(var i = 0; i < postIds.length; i++) {
    const post = await Post.findOne(
        { _id : postIds[i] }
    )
    response["data"].push(post);
  }

  res.status(200).send(response);
});

router.post("/like/:postId", (req, res) => {
  console.log("/like/:postId");

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
              res.status(500).json({ result: "Fail" });
            } else {
              User.updateOne(
                { _id: user_Id },
                { $push: { like_post: post_Id } }
              ).then(() => {
                res
                  .status(200)
                  .json({ result: "Plus", likeCnt: temp_like_cnt });
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
              res.status(500).json({ result: "Fail" });
            } else {
              User.updateOne(
                { _id: user_Id },
                { $pull: { like_post: post_Id } }
              ).then(() => {
                res
                  .status(200)
                  .json({ result: "Minus", likeCnt: temp_like_cnt });
              });
            }
          }
        );
      });
    }
  });
});

router.put("/", async (req, res) => {
  var data = req.body;

  console.log(data);
  const updatePost = await Post.updateOne(
    { _id: data.id },
    {
      $set: {
        category: data.category,
        title: data.title,
        description: data.description,
        image_url: data.imageUrl,
        video_url: data.videoUrl,
        update_time: Date.now(),
      },
    }
  );

  const response = {};

  if (updatePost.n === 1 && updatePost.n === updatePost.ok) {
    response["result"] = "Success";
    if (updatePost.nModified == 0) response["detail"] = "같은 내용입니다.";
  } else {
    response["result"] = "Fail";
    response["detail"] =
      "개인 정보 변경 중 오류가 발생했습니다.\n다시 실행해주세요.";
  }

  res.status(200).send(response);
});

router.delete("/:writer_id", async (req, res) => {
  const post_id = req.body._id;

  const del = await Post.deleteOne({
    writer_id: req.params.writer_id,
    _id: post_id,
  });

  console.log(del);

  const user = await User.find(
    { like_post: post_id },
    { _id: true, like_post: true }
  );

  for (var i = 0; i < Object.keys(user).length; i++) {
    const temp_id = user[i]._id;
    const temp_arr = Array.from(user[i].like_post);
    const remove_idx = temp_arr.indexOf(post_id);
    if (remove_idx > -1) {
      temp_arr.splice(remove_idx, 1);
    }
    const aaa = await User.updateOne(
      { _id: temp_id },
      {
        $set: {
          like_post: temp_arr,
        },
      }
    );
    console.log(aaa);
  }

  const response = {};

  if (del.n == 0) {
    response["result"] = "Fail";
    response["detail"] = "잘못된 경로입니다.";
  } else if (del.n === 1 && del.n === del.ok) {
    response["result"] = "Success";
  } else {
    response["result"] = "Fail";
    response["detail"] =
      "게시글 삭제 중 오류가 발생했습니다.\n다시 실행해주세요.";
  }

  res.status(200).send(response);
});

module.exports = router;
