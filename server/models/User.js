const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  isVerified: Boolean,
  username: String,
  password: String,
  follows: [Number],
  profilePicture: String,
  banner: String,
  bio: String,
  socialLinks: [String],
});

module.exports = mongoose.model("User", userSchema);
