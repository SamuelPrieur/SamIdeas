import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "@components/Navbar";

const ProfilPage = () => {
  const { id } = useParams(); // Récupère l'id depuis l'URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // État pour stocker les posts
  const [loading, setLoading] = useState(true); // État pour le chargement
  const [showFollows, setShowFollows] = useState(false); // État pour gérer l'affichage des suivis
  const [unfollowedUsers, setUnfollowedUsers] = useState([]); // Nouvel état pour stocker les utilisateurs non suivis

  useEffect(() => {
    // Fonction pour récupérer le profil de l'utilisateur et ses posts
    const fetchProfil = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:8080/api/Profil/${id}`);
        const postsResponse = await axios.get(`http://localhost:8080/api/user/${id}`); // Récupère les posts de l'utilisateur

        if (userResponse.status === 200) {
          setUser(userResponse.data);
        } else {
          console.error("Erreur de récupération du profil :", userResponse.data.message);
        }

        if (postsResponse.status === 200) {
          setPosts(postsResponse.data); // Mettez à jour l'état des posts
        } else {
          console.error("Erreur de récupération des posts :", postsResponse.data.message);
        }
      } catch (error) {
        console.error("Erreur de connexion au serveur :", error);
      } finally {
        setLoading(false); // Fin de chargement
      }
    };

    fetchProfil();
  }, [id]);

  if (loading) {
    return <p>Chargement...</p>; // Affichage pendant le chargement
  }

  if (!user) {
    return <p>Profil introuvable.</p>; // Gérer le cas où l'utilisateur n'est pas trouvé
  }

  return (
    <div className="profil-page">
      <Navbar />

      <div className="grid-containerProfil">
        <div></div>
        <section className="item box middle">
          <div className="bannerContainer">
            <img src={user.banner || "/img/placeholder.png"} alt={`${user.username}'s banner`} />
          </div>
          <img className="ProfilPicture" src={user.profilPicture || "/img/PPplaceholder.jpg"} alt={`${user.username}'s profil`} />

          <div className="ProfilInfo">
            <h1 className="ProfilName">{user.username}</h1>
            <p className="ProfilBio">{user.bio || "Cet utilisateur n'a pas encore ajouté de bio."}</p>

            <div className="ProfilSocial">
              <p>{user.follows ? user.follows.length : 0} suivi(s)</p>
              {user.follows && user.follows.length > 0 && (
                <>
                  <button onClick={() => setShowFollows((prev) => !prev)}>{showFollows ? "Masquer les suivis" : "Voir les suivis"}</button>
                  {showFollows && (
                    <ul>
                      {user.follows.map((followId, index) => (
                        <li key={index}>User ID: {followId}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              <h3> - </h3>
              <ul>
                {user.socialLinks && user.socialLinks.length > 0 ? (
                  user.socialLinks.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))
                ) : (
                  <p>Pas de liens sociaux ajoutés.</p>
                )}
              </ul>
            </div>
          </div>
          <h2>Posts de {user.username}</h2>
          <div className="ProfilPost">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <div key={post._id} className={index === 0 ? "FirstPostProfil" : "postProfil"}>
                  {post.image && (
                    <div className="containerPostImage">
                      <img src={post.image} alt={post.name} />
                    </div>
                  )}
                  <h3>{post.name}</h3>
                </div>
              ))
            ) : (
              <p>Aucun post trouvé.</p>
            )}
          </div>
        </section>
        <section className="item box">
          <h2>Utilisateurs non suivis</h2>
          {unfollowedUsers.length > 0 ? (
            <ul>
              {unfollowedUsers.map((unfollowedUser) => (
                <li key={unfollowedUser._id}>{unfollowedUser.username}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun utilisateur non suivi trouvé.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilPage;
