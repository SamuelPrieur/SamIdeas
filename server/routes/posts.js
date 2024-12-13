const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const multer = require("multer");

const router = express.Router();

// Configuration du stockage des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Dossier où seront stockées les images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({ storage: storage });

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("creator", "username profilePicture").sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);
    res.status(500).json({ message: "Erreur lors de la récupération des posts." });
  }
});

router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé." });
    res.json(post);
  } catch (error) {
    console.error("Erreur lors de la récupération du post :", error);
    res.status(500).json({ message: "Erreur lors de la récupération du post." });
  }
});

router.post("/createPost", upload.single("image"), async (req, res) => {
  const { name, head, HTML, CSS, JS, creator } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const newPost = new Post({
      name,
      head,
      image,
      HTML,
      CSS,
      JS,
      creator,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Erreur lors de la création du post :", error);
    res.status(500).json({ message: "Erreur lors de la création du post." });
  }
});

router.put("/updatePost/:postId", upload.single("image"), async (req, res) => {
  const { postId } = req.params;
  const { name, head, HTML, CSS, JS, creator } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const updatedData = {
    name,
    head,
    HTML,
    CSS,
    JS,
    creator,
  };

  if (image) updatedData.image = image;

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, updatedData, { new: true, runValidators: true });
    if (!updatedPost) return res.status(404).json({ message: "Post non trouvé." });
    res.json(updatedPost);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du post :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du post." });
  }
});

router.get("/user/:creatorId", async (req, res) => {
  try {
    const posts = await Post.find({ creator: req.params.creatorId });
    res.json(posts);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des posts de l'utilisateur." });
  }
});

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
