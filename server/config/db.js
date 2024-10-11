const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/myAppDB");
    console.log("Connecté à MongoDB !");
  } catch (err) {
    console.log("Erreur de connexion à MongoDB : ", err);
    process.exit(1);
  }
};

module.exports = connectDB;
