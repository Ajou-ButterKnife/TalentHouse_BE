const Post = require('../models/post');
const User = require('../models/user');
const commentMid = require('../middle/comment');
const fcmMid = require('../middle/fcm');
const likeMid = require('../middle/like');
const express = require('express');

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

  const retval = {
    data: posts,
  };
  res.status(200).send(retval);
});

router.get('/board', async (req, res, next) => {
  let categoryTemp;
  const sortFlag = req.query.flag;

  if (req.query.category != 'all') {
    categoryTemp = req.query.category.split('-');
  } else {
    categoryTemp = ['춤', '노래', '랩', '그림', '사진', '기타'];
  }

  let retval;
  if (sortFlag == 1) {
    const postsTime = await Post.find({
      category: { $in: categoryTemp },
    })
      .sort({
        update_time: -1,
      })
      .skip(req.query.page * offset)
      .limit(offset);

    console.log(postsTime);
    retval = {
      data: postsTime,
    };
  } else if (sortFlag == 2) {
    const postsLike = await Post.find({
      category: { $in: categoryTemp },
    })
      .sort({
        like_cnt: -1,
      })
      .skip(req.query.page * offset)
      .limit(offset);

    console.log(postsLike);
    retval = {
      data: postsLike,
    };
  }

  res.status(200).send(retval);
});

router.get('/hot', async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  let endDate = new Date(req.query.endDate);
  endDate.setDate(endDate.getDate() + 1);
  console.log(startDate);
  console.log(endDate);
  let retval = { data: [] };

  const posts = await Post.find({
    update_time: { $gte: startDate, $lte: endDate },
    category: '춤',
  })
    .sort({
      like_cnt: -1,
    })
    .limit(3);

  const posts2 = await Post.find({
    update_time: { $gte: startDate, $lte: endDate },
    category: '노래',
  })
    .sort({
      like_cnt: -1,
    })
    .limit(3);

  const posts3 = await Post.find({
    update_time: { $gte: startDate, $lte: endDate },
    category: '랩',
  })
    .sort({
      like_cnt: -1,
    })
    .limit(3);

  const posts4 = await Post.find({
    update_time: { $gte: startDate, $lte: endDate },
    category: '그림',
  })
    .sort({
      like_cnt: -1,
    })
    .limit(3);

  const posts5 = await Post.find({
    update_time: { $gte: startDate, $lte: endDate },
    category: '사진',
  })
    .sort({
      like_cnt: -1,
    })
    .limit(3);

  const posts6 = await Post.find({
    update_time: { $gte: startDate, $lte: endDate },
    category: '기타',
  })
    .sort({
      like_cnt: -1,
    })
    .limit(3);

  for (let i = 0; i < 3; i++) {
    if (posts[i] != null) retval.data.push(posts[i]);
  }
  for (let i = 0; i < 3; i++) {
    if (posts2[i] != null) retval.data.push(posts2[i]);
  }
  for (let i = 0; i < 3; i++) {
    if (posts3[i] != null) retval.data.push(posts3[i]);
  }
  for (let i = 0; i < 3; i++) {
    if (posts4[i] != null) retval.data.push(posts4[i]);
  }
  for (let i = 0; i < 3; i++) {
    if (posts5[i] != null) retval.data.push(posts5[i]);
  }
  for (let i = 0; i < 3; i++) {
    if (posts6[i] != null) retval.data.push(posts6[i]);
  }
  console.log(retval);
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

router.get('/:id/:page', async (req, res, next) => {
  console.log('/' + req.params.id + '/' + req.params.page);
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
    profile: data.profile,
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

router.post('/comment/:id', async (req, res) => {
  console.log('/comment/:id');
  Post.findById(req.params.id)
    .then((p) => {
      res.status(200).json({ result: 'Success', data: p.comments });
    })
    .catch((err) => res.status(500).json({ result: 'Fail' }));
});

router.post(
  '/create/comment',
  commentMid.createComment,
  fcmMid.searchFcmKey,
  fcmMid.createFcm,
  async (req, res, next) => {
    const data = req.body;
    const newComment = {
      post_id: data.postId,
      writer_id: data.userId,
      writer_nickname: data.nickname,
      comment: data.comment,
      profile: data.profile,
      date: Date.now(),
    };
    res.status(200).json({ result: 'Success', data: newComment });
  }
);

router.delete('/delete/comment', async (req, res) => {
  console.log('/delete/comment');

  const post_id = req.body.postId;
  const user_id = req.body.userId;
  const date = Number(req.body.date);

  Post.updateOne(
    { _id: post_id },
    { $pull: { comments: { writer_id: user_id, date: date } } }
  )
    .then(() => {
      res.status(200).json({ result: 'Success' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ result: 'Fail' });
    });
});

router.get('/get/favorite/:postId', (req, res) => {
  console.log('/favorite/:postId');
  const post_id = req.params.postId;
  Post.findByIdAndUpdate(post_id).then((post) => {
    res.status(200).send({ likeCnt: post.like_cnt, likeIds: post.like_IDs });
  });
});

router.put('/update/comment/:id', async (req, res) => {
  console.log('/update/comment');
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
          res.status(500).json({ result: 'Fail' });
        } else {
          res.status(200).json({ result: 'Success', data: response_comment });
        }
      }
    );
  });
});

router.post('/favorite', async (req, res) => {
  console.log('/favorite');
  const post_id = req.body.postId;

  Post.findById(post_id).then((post) => {
    res.status(200).json({ data: post.like_IDs });
  });
});

router.get('/favorite', async (req, res) => {
  const userId = req.query.id;
  const page = req.query.page;
  console.log('/favorite');
  const user = await User.findOne(
    { _id: userId },
    { _id: false, like_post: true }
  );

  const postIds = [];

  for (
    var i = page * offset;
    i < user.like_post.length && i < (page + 1) * offset;
    i++
  ) {
    postIds.push(user.like_post[i]);
  }

  const response = {
    data: [],
  };

  for (var i = 0; i < postIds.length; i++) {
    const post = await Post.findOne({ _id: postIds[i] });
    response['data'].push(post);
  }

  res.status(200).send(response);
});

router.post(
  '/like/:postId',
  likeMid.createLike,
  fcmMid.searchFcmKey,
  fcmMid.createFcm,
  (req, res) => {
    const likeCount = req.likeCnt.temp_like_cnt;
    console.log('plus 전송' + likeCount);
    res.status(200).json({ result: 'Plus', likeCnt: likeCount });
  }
);

router.put('/', async (req, res) => {
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
    response['result'] = 'Success';
    if (updatePost.nModified == 0) response['detail'] = '같은 내용입니다.';
  } else {
    response['result'] = 'Fail';
    response['detail'] =
      '개인 정보 변경 중 오류가 발생했습니다.\n다시 실행해주세요.';
  }

  res.status(200).send(response);
});

router.delete('/:writer_id', async (req, res) => {
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
    response['result'] = 'Fail';
    response['detail'] = '잘못된 경로입니다.';
  } else if (del.n === 1 && del.n === del.ok) {
    response['result'] = 'Success';
  } else {
    response['result'] = 'Fail';
    response['detail'] =
      '게시글 삭제 중 오류가 발생했습니다.\n다시 실행해주세요.';
  }

  res.status(200).send(response);
});

router.get("/one", async(req, res) => {
  const postItem = await Post.findOne(
      { _id : req.query.id }
  )

  res.status(200).send(postItem)
})

module.exports = router;
