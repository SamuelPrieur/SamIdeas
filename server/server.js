const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "public")));

// Connexion à MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/myAppDB");

mongoose.connection.on("connected", () => {
  console.log("Connecté à MongoDB !");
});

mongoose.connection.on("error", (err) => {
  console.log("Erreur de connexion à MongoDB : ", err);
});

const { Schema } = mongoose;

const userSchema = new Schema({
  email: String,
  isVerified: Boolean,
  username: String,
  password: String,
  follows: [Number],
  profilePicture: String,
  banner: String,
  bio: String,
  socialLinks: [String],
});

const postSchema = new Schema({
  creator: Number,
  image: String,
  name: String,
  head: String,
  HTML: String,
  CSS: String,
  JS: String,
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

// Endpoint pour récupérer les utilisateurs
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(); // Utilisez le modèle User pour interroger la base de données
    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res.status(500).send("Erreur du serveur");
  }
});

// Ajoutez cette route pour récupérer les posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find(); // Utilisez le modèle Post pour interroger la base de données
    res.json(posts); // Renvoie les posts trouvés
  } catch (error) {
    console.error("Erreur lors de la récupération des posts :", error);
    res.status(500).send("Erreur du serveur");
  }
});

app.listen(8080, () => {
  console.log("Server lancé sur le port 8080");
});
