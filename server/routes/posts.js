const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");

const router = express.Router();

// Affichage de tous les posts
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("creator", "username profilePicture").sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des posts." });
  }
});

// Récupérer un post par ID
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post non trouvé." });
    }

    res.json(post);
  } catch (error) {
    console.error("Erreur lors de la récupération du post :", error);
    res.status(500).json({ message: "Erreur lors de la récupération du post." });
  }
});

// Création d'un post
router.post("/createPost", async (req, res) => {
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
router.put("/updatePost/:postId", async (req, res) => {
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
