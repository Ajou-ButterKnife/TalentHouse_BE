const mongoose = require("mongoose");
const autoInc = require("mongoose-auto-increment");

const UserSchema = new mongoose.Schema({
  seq: {
    type: Number,
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

UserSchema.plugin(autoInc.plugin, {
  model: "User",
  field: "seq",
  startAt: 1,
});
module.exports = mongoose.model("User", UserSchema);
