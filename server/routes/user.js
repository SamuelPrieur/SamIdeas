// routes/users.js
const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth"); // Middleware pour l'authentification

const router = express.Router();

// Route pour récupérer les utilisateurs qui ne sont pas suivis par l'utilisateur connecté
router.get("/unfollowed", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; // ID de l'utilisateur connecté
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Récupère les utilisateurs qui ne sont pas dans la liste des suivis de l'utilisateur actuel
    const unfollowedUsers = await User.find({
      _id: { $ne: userId, $nin: currentUser.follows },
    });

    res.json(unfollowedUsers);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs non suivis :", error);
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

module.exports = router;
