import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Si l'utilisateur n'est pas connecté, redirige vers la page de login
  if (!user) {
    return <Navigate to="/Login" />;
  }

  // Sinon, afficher le contenu de la route protégée
  return children;
};

export default ProtectedRoute;
