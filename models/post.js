const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  writer_id: {
    type: String,
    required: true,
  },
  writer_nickname: {
    type: String,
//    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image_url: {
    type: [String],
  },
  video_url: {
    type: String,
  },
  mp3_url: {
    type: String,
  },
  like_cnt: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [Object],
    default: [],
  },
  update_time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
