import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });

      // Enregistre le token dans localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      console.log("Connexion réussie :", response.data);

      // Redirige vers la page TrendingPage
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error.response.data.message);
    }
  };

  return (
    <div className="ConnexionContainer">
      <form className="Connexion box" onSubmit={handleSubmit}>
        <div className="divConnexion">
          <label htmlFor="Email">Adresse mail :</label>
          <input name="Email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="divConnexion">
          <label htmlFor="Password">Mot de passe :</label>
          <input name="Password" type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
