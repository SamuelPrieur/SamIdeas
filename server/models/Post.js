const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  creator: Number,
  image: String,
  name: String,
  head: String,
  HTML: String,
  CSS: String,
  JS: String,
});

module.exports = mongoose.model("Post", postSchema);
