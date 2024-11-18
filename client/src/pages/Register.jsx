import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialisez navigate ici

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/register", {
        email,
        username,
        password,
      });
      console.log(response.data.message); // Affiche le message de succès
      navigate("/Login"); // Redirection après l'inscription réussie
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error.response.data.message);
    }
  };

  return (
    <div className="ConnexionContainer">
      <form className="Connexion box" onSubmit={handleSubmit}>
        <h1>Bienvenue</h1>
        <div className="divConnexionFlex">
          <div className="divConnexion">
            <label htmlFor="Email">Adresse mail :</label>
            <input id="Email" name="Email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="divConnexion">
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="divConnexion">
          <label htmlFor="Password">Mot de passe :</label>
          <input
            id="Password"
            name="Password"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Créer un compte</button>
        <Link className="LinkConnexion" to="../Login">
          Déjà un compte?
        </Link>
      </form>
    </div>
  );
};

export default Register;
