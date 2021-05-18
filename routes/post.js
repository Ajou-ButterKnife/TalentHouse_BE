
const Post = require("../models/post");
const User = require("../models/user");
const express = require("express");
const { response } = require("express");

const router = express.Router();

const offset = 10;

router.get('/', async (req, res, next) => {
  let categoryTemp;
  if (req.query.category != 'all') {
    categoryTemp = req.query.category.split('-');
  } else {
    categoryTemp = ['춤', '노래', '랩', '그림', '사진', '기타'];
  }

  const posts = await Post.find({
    category: { $in: categoryTemp },
  })
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

router.get('/hot', async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);

  const posts = await Post.find({
    update_time: { $gt: startDate, $lt: endDate },
  })
    .distinct('category')
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

router.get('/search', async (req, res, next) => {
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

router.post('/create', async (req, res) => {
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
      res.status(500).json({ result: 'Fail' });
    } else {
      res.status(200).json({ result: 'Success' });
    }
  });
});

router.post("/comment", (req, res) => {
  const p = Post.findById(req.params.id)
    .then((p) => {
      res.status(200).json({ result: 'Success', data: p.comments });
    })
    .catch((err) => res.status(500).json({ result: 'Fail' }));
});

router.post('/comment/create', async (req, res) => {
  data = req.body;
  content_id = data._id;
  const newComment = {
    writer_id: data.id,
    writer_nickname: data.nickname,
    comment: data.comment,
    date: Date.now(),
  };

  Post.updateOne({ _id: content_id }, { $push: { comments: newComment } })
    .then(() => {
      res.status(200).json({ result: 'Success', data: newComment });
    })
    .catch((err) => {
      res.status(500).json({ result: 'Fail' });
    });
});

router.post("/favorite", async (req, res) => {
  console.log(req.body);
  const post_id = req.body.postId;

  Post.findById(post_id).then((post) => {
    const response = {
      data: post.like_IDs,
    };
    res.status(200).json(response);
  });
});

router.post("/favoritePost", async (req, res) => {
  console.log(req.body.postIdList);

  const postIdList = req.body.postIdList;
  var postArr = [];

  for (var postId of postIdList) {
    const postObject = await Post.findById(postId);
    postArr.push(postObject);
  }
  const response = {
    data: postArr,
  };
  res.status(200).send(response);
});


router.put('/like/:postId/:userId', (req, res) => {
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
                  res
                    .status(200)
                    .json({ result: 'Plus', likeCnt: temp_like_cnt });
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
});

module.exports = router;
