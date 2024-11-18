import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Grid = ({ posts }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  console.log(posts);
  useEffect(() => {
    // Récupérer l'ID utilisateur depuis le localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser); // Convertir en objet
        setCurrentUserId(user._id); // Extraire et définir l'ID utilisateur
      } catch (error) {
        console.error("Erreur lors de la conversion de l'utilisateur depuis le localStorage :", error);
      }
    } else {
      console.error("Aucun utilisateur trouvé dans le localStorage.");
    }
  }, []);

  return (
    <section className="grid-container">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="grid-item box">
            <div className="containerPostImage">
              <img src={post.image || "/img/placeholder.png"} alt={post.name} />
            </div>
            <h3>{post.name || "Nouveau Post"}</h3>
            <div className="postUser">
              <NavLink to={`/Profil/${post.creator._id}`} className="userInfo">
                <img src={post.creator.profilePicture || "/img/PPplaceholder.jpg"} alt={`Profil de ${post.creator.username}`} />
                <p>{post.creator.username || "Utilisateur"}</p>
              </NavLink>
              {currentUserId !== post.creator._id && <button>Follow</button>}
            </div>
          </div>
        ))
      ) : (
        <p>Aucun post à afficher</p>
      )}
    </section>
  );
};

export default Grid;
