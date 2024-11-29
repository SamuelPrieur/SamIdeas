import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const Grid = ({ posts }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [creators, setCreators] = useState({}); // Stocker les données des créateurs
  const [follows, setFollows] = useState([]); // Stocker les utilisateurs suivis

  useEffect(() => {
    // Récupérer l'ID utilisateur depuis le localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserId(user._id);
      } catch (error) {
        console.error("Erreur lors de la conversion de l'utilisateur depuis le localStorage :", error);
      }
    }
  }, []);

  useEffect(() => {
    // Charger les utilisateurs suivis depuis la base de données
    const fetchFollows = async () => {
      if (!currentUserId) return;
      try {
        const response = await axios.get(`http://localhost:8080/api/Profil/${currentUserId}`);
        if (response.status === 200) {
          setFollows(response.data.follows); // Suppose que l'API retourne un tableau des ID suivis
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs suivis :", error);
      }
    };

    fetchFollows();
  }, [currentUserId]);

  useEffect(() => {
    // Charger les créateurs des posts
    const fetchCreators = async () => {
      const creatorsData = {};
      await Promise.all(
        posts.map(async (post) => {
          try {
            if (!post.creator) return; // Ignore les posts sans créateur
            const response = await axios.get(`http://localhost:8080/api/Profil/${post.creator}`);
            creatorsData[post.creator] = response.data;
          } catch (error) {
            console.error(`Erreur lors de la récupération du créateur pour le post ${post._id} :`, error);
          }
        })
      );
      setCreators(creatorsData);
    };

    if (posts.length > 0) fetchCreators();
  }, [posts]);

  const handleFollow = async (userIdToFollow) => {
    try {
      const response = await axios.post("http://localhost:8080/api/follow", {
        currentUserId,
        userIdToFollow,
      });

      if (response.status === 200) {
        setFollows((prevFollows) => [...prevFollows, userIdToFollow]);
      }
    } catch (error) {
      console.error("Erreur lors du suivi de l'utilisateur :", error);
    }
  };

  const handleUnfollow = async (userIdToUnfollow) => {
    try {
      const response = await axios.post("http://localhost:8080/api/unfollow", {
        currentUserId,
        userIdToUnfollow,
      });

      if (response.status === 200) {
        setFollows((prevFollows) => prevFollows.filter((id) => id !== userIdToUnfollow));
      }
    } catch (error) {
      console.error("Erreur lors du désabonnement de l'utilisateur :", error);
    }
  };

  return (
    <section className="grid-container">
      {posts.length > 0 ? (
        posts.map((post) => {
          const creator = creators[post.creator]; // Récupérer les infos du créateur
          const isFollowing = follows.includes(post.creator);

          return (
            <div key={post._id} className="grid-item box">
              <NavLink
                to={`/EditorPage/${post._id}`}
                className="containerPostImage"
                style={{
                  backgroundImage: `url(${post.image || "/img/placeholder.png"})`,
                }}
              ></NavLink>

              <h3>{post.name || "Nouveau Post"}</h3>
              <div className="postUser">
                {creator ? (
                  <NavLink to={`/api/Profil/${post.creator}`} className="userInfo">
                    <img src={creator.profilePicture || "/img/PPplaceholder.jpg"} alt={`Profil de ${creator.username}`} />
                    <p>{creator.username || "Utilisateur"}</p>
                  </NavLink>
                ) : (
                  <p>Chargement...</p>
                )}
                {creator && currentUserId !== post.creator && (
                  <button onClick={() => (isFollowing ? handleUnfollow(post.creator) : handleFollow(post.creator))}>
                    {isFollowing ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <p className="AucunPost">Aucun post à afficher</p>
      )}
    </section>
  );
};

export default Grid;
