// src/addTestData.js
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

// Fonction pour ajouter des valeurs de test à Firestore
const addTestData = async () => {
  try {
    await addDoc(collection(db, "items"), {
      name: "Item Test",
      description: "Ceci est une description de test.",
    });
    console.log("Données ajoutées avec succès !");
  } catch (e) {
    console.error("Erreur lors de l'ajout des données : ", e);
  }
};

// Appelle cette fonction pour ajouter des données
addTestData();
