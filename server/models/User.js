const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  username: { type: String, required: true },
  password: { type: String, required: true },
  follows: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  profilePicture: { type: String, default: "" },
  banner: { type: String, default: "" },
  bio: { type: String, default: "" },
  socialLinks: { type: [String], default: [] },
});

module.exports = mongoose.model("User", userSchema);
