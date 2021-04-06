const mongoose = require("mongoose");
// const mongooseAutoInc = require("mongoose-auto-increment");

const UserSchema = new mongoose.Schema({
  id: {
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

// UserSchema.plugin(mongooseAutoInc.plugin, "User");
module.exports = mongoose.model("User", UserSchema);
