const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]);
  },
});

const upload = multer({ storage: storage });

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
  const { userIds } = req.body;

  try {
    const users = await User.find({ _id: { $in: userIds } }).select("username profilePicture banner bio socialLinks");
    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des profils :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

router.put(
  "/ModifyProfil/:id",
  upload.fields([
    { name: "profilPicture", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  (req, res) => {
    const userId = req.params.id;
    const { username, bio } = req.body;
    const profilPicture = req.files["profilPicture"] ? `/uploads/${req.files["profilPicture"][0].filename}` : null;
    const banner = req.files["banner"] ? `/uploads/${req.files["banner"][0].filename}` : null;

    const updatedData = {
      username,
      bio,
    };

    if (profilPicture) updatedData.profilePicture = profilPicture;
    if (banner) updatedData.banner = banner;

    User.findByIdAndUpdate(userId, updatedData, { new: true })
      .then((updatedUser) => res.json(updatedUser))
      .catch((err) => res.status(500).json({ error: err.message }));
  }
);

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;

  try {
    if (password.length < 6) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: "Ce nom d'utilisateur est déjà pris." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      username,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: errorMessages.join(", ") });
    }

    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur." });
  }
});

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

    const unfollowedUsers = await User.find({ _id: { $nin: [...user.follows, userId] } }).select("profilePicture username _id bio ");

    res.json(unfollowedUsers);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs non suivis :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
