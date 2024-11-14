import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Grid = ({ currentUserId }) => {
  const [posts, setPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
      }
    };
    fetchPosts();
  }, []);

  const handleFollow = async (userIdToFollow) => {
    try {
      if (followedUsers.includes(userIdToFollow)) {
        console.log("Utilisateur déjà suivi.");
        return;
      }

      const response = await axios.post(`http://localhost:8080/api/follow`, {
        currentUserId,
        userIdToFollow,
      });

      if (response.status === 200) {
        setFollowedUsers((prev) => [...prev, userIdToFollow]);
      } else {
        console.error("Erreur lors du suivi :", response.data.message);
      }
    } catch (error) {
      console.error("Erreur de connexion au serveur :", error);
    }
  };

  return (
    <section className="grid-container">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} className="grid-item box">
            <div className="containerPostImage">
              <img src={post.image || "/img/placeholder.png"} alt={post.name} />
            </div>
            <h3>{post.name}</h3>
            <div className="postUser">
              <NavLink to={`/api/Profil/${post.creator._id}`} className="userInfo">
                <img src={post.creator.profilePicture || "/img/PPplaceholder.jpg"} alt={`Profil de ${post.creator.username}`} />
                <p>{post.creator.username || "RealUserOfficialAccount"}</p>
              </NavLink>
              <button onClick={() => handleFollow(post.creator._id)}>{followedUsers.includes(post.creator._id) ? "Following" : "Follow"}</button>
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
