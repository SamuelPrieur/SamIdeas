const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: { type: String },
  head: { type: String },
  image: { type: String },
  HTML: { type: String },
  CSS: { type: String },
  JS: { type: String },
  creator: { type: String },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
