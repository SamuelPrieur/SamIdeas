const express = require("express");
const Post = require("../models/Post");

const router = express.Router();

// Route pour récupérer tous les posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);
    res.status(500).json({ message: "Erreur du serveur lors de la récupération des posts." });
  }
});

module.exports = router;
