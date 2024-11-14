const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Accès refusé. Token manquant." });

  try {
    const decoded = jwt.verify(token, "votre_clé_secrète");
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token invalide." });
  }
};

module.exports = authMiddleware;
