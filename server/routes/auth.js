// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.get("/Profil/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("username profilePicture banner bio follows socialLinks");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé." });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur." });
  }
});

router.post("/getProfiles", async (req, res) => {
  const { userIds } = req.body; // Attendre un tableau d'IDs dans le body

  try {
    // Trouver tous les utilisateurs correspondants aux IDs
    const users = await User.find({ _id: { $in: userIds } }).select("username profilePicture banner bio socialLinks");
    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des profils :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

router.put("/ModifyProfil/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du profil.", error });
  }
});

// Fonction pour l'inscription
router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Utilisateur déjà existant." });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur avec les valeurs par défaut
    const user = new User({
      email,
      username,
      password: hashedPassword,
      isVerified: false,
      follows: [],
      profilePicture: "", // URL de l'image de profil par défaut
      banner: "", // URL de l'image de bannière par défaut
      bio: "", // Bio par défaut (chaîne vide)
      socialLinks: [], // Liens sociaux par défaut (tableau vide)
    });

    await user.save();
    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
  }
});

// Fonction pour la connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect." });

    const token = jwt.sign({ id: user._id }, "votre_clé_secrète", { expiresIn: "1h" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion." });
  }
});

router.post("/follow", async (req, res) => {
  const { currentUserId, userIdToFollow } = req.body;

  try {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ message: "Utilisateur non trouvé." });

    // Vérifier si l'utilisateur est déjà suivi
    if (currentUser.follows.includes(userIdToFollow)) {
      return res.status(200).json({ message: "Utilisateur déjà suivi." });
    }

    currentUser.follows.push(userIdToFollow);
    await currentUser.save();

    res.status(200).json({ message: "Utilisateur suivi avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du suivi." });
  }
});

// Fonction pour ne plus suivre un utilisateur
router.post("/unfollow", async (req, res) => {
  const { currentUserId, userIdToUnfollow } = req.body;

  try {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) return res.status(404).json({ message: "Utilisateur non trouvé." });

    currentUser.follows = currentUser.follows.filter((id) => id.toString() !== userIdToUnfollow);
    await currentUser.save();

    res.status(200).json({ message: "Utilisateur non suivi avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du désabonnement." });
  }
});

router.get("/unfollowed/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("follows");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable." });

    // Récupérer tous les utilisateurs sauf ceux qui sont suivis et l'utilisateur actuel
    const unfollowedUsers = await User.find({ _id: { $nin: [...user.follows, userId] } }).select("username _id");

    res.json(unfollowedUsers);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs non suivis :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
