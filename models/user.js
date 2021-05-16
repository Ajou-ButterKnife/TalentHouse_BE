const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  uid: {
    type: String,
  },
  phone_num: { type: String },
  social_login_flag: { type: Boolean, default: false },
  fcm_key: { type: String },
  category: { type: Array },
  nickname: { type: String },
  like_post: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("User", UserSchema);
