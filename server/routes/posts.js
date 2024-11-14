// routes/posts.js
const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");

const router = express.Router();

// Création d'un post
router.post("/", async (req, res) => {
  const { name, head, image, HTML, CSS, JS, creator } = req.body;

  try {
    const newPost = new Post({ name, head, image, HTML, CSS, JS, creator });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création du post." });
  }
});

// Mise à jour d'un post
router.put("/:postId", async (req, res) => {
  const { postId } = req.params;
  const { name, head, image, HTML, CSS, JS, creator } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, { name, head, image, HTML, CSS, JS, creator }, { new: true, runValidators: true });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post non trouvé." });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du post." });
  }
});

// Affichage des posts d'un utilisateur
router.get("/user/:creatorId", async (req, res) => {
  try {
    const posts = await Post.find({ creator: req.params.creatorId });
    console.log(posts);

    if (!posts.length) {
      return res.status(404).json({ message: "Aucun post trouvé pour cet utilisateur." });
    }

    res.json(posts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des posts de l'utilisateur." });
  }
});

// Affichage des posts des utilisateurs suivis
router.get("/following/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    const posts = await Post.find({ creator: { $in: user.follows } });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des posts des suivis." });
  }
});

module.exports = router;
