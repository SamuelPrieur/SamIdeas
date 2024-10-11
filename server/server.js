const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const corsOptions = require("./config/corsOptions");

const app = express();

// Connexion à la base de données
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/posts"));

// Démarrage du serveur
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server lancé sur le port ${PORT}`);
});
