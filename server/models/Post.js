const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  name: { type: String, required: true },
  head: { type: String, required: true },
  image: { type: String },
  HTML: { type: String },
  CSS: { type: String },
  JS: { type: String },
  creator: { type: String },
  /* creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  */
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
