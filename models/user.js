const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone_num: { type: String, required: true },
  first_login_flag: { type: Boolean, default: false },
  fcm_key: { type: String },
  category: { type: Array },
  nickname: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
