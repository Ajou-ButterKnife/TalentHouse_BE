const User = require('../models/user');
const Post = require('../models/post');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  console.log(req.query.page);
  console.log(req.query.category);

  const categoryTemp = req.query.category.split('-');

  const offset = 6;
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

router.get('/category/:id', async (req, res, next) => {
  console.log('/category');
  const category = await User.findOne(
    { _id: req.params.id },
    { _id: false, category: true }
  );
  const retval = {
    data: category,
  };
  res.status(200).json(retval);
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

router.get('/comment/:id', (req, res) => {
  console.log(req.params.id);

  const p = Post.findById(req.params.id)
    .then((p) => {
      res.status(200).json({ result: 'Success', data: p.comments });
    })
    .catch((err) => res.status(500).json({ result: 'Fail' }));
});

router.post('/comment/create', async (req, res) => {
  console.log('Post comment/create');
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

module.exports = router;
