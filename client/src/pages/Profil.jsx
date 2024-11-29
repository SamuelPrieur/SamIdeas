import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "@components/Navbar";

const ProfilPage = () => {
  const [followsProfiles, setFollowsProfiles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const { id } = useParams(); // Récupère l'id depuis l'URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // État pour stocker les posts
  const [loading, setLoading] = useState(true); // État pour le chargement
  const [showFollows, setShowFollows] = useState(false); // État pour gérer l'affichage des suivis
  const [unfollowedUsers, setUnfollowedUsers] = useState([]); // État pour stocker les utilisateurs non suivis
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserId(user._id);
      } catch (error) {
        console.error("Erreur lors de la conversion de l'utilisateur depuis le localStorage :", error);
      }
    } else {
      console.error("Aucun utilisateur trouvé dans le localStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:8080/api/Profil/${id}`);
        const postsResponse = await axios.get(`http://localhost:8080/api/user/${id}`); // Récupère les posts de l'utilisateur

        if (userResponse.status === 200) setUser(userResponse.data);
        if (postsResponse.status === 200) setPosts(postsResponse.data);
        if (userResponse.status === 200) {
          setUser(userResponse.data);

          // Récupérer les profils suivis
          if (userResponse.data.follows && userResponse.data.follows.length > 0) {
            const followsResponse = await axios.post(`http://localhost:8080/api/getProfiles`, {
              userIds: userResponse.data.follows,
            });
            if (followsResponse.status === 200) setFollowsProfiles(followsResponse.data);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUnfollowedUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/unfollowed/${id}`);
        if (response.status === 200) setUnfollowedUsers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs non suivis :", error);
      }
    };

    fetchProfil();
    fetchUnfollowedUsers();
  }, [id]);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!user) {
    return <p>Profil introuvable.</p>;
  }

  return (
    <div className="profil-page">
      <Navbar />
      <div className="grid-containerProfil">
        <div></div>
        <section className="item box middle">
          {/* Section Profil */}
          <div className="bannerContainer">
            <img src={user.banner || "/img/placeholder.png"} alt={`${user.username}'s banner`} />
          </div>

          <div className="ImageAndButton">
            {user._id === currentUserId ? (
              <>
                {!isEditing ? (
                  <>
                    <img className="ProfilPicture" src={user.profilPicture || "/img/PPplaceholder.jpg"} alt={`${user.username}'s profil`} />
                    <button className="Modify" onClick={() => setIsEditing(true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <polygon points="3 21 4 16.5 17.5 3 18.5 3 21 5.5 21 6.5 7.5 20 3 21" fill="none" stroke="#dfdfd6" strokeMiterlimit="10" />
                        <line x1="15.5" y1="4.5" x2="19.5" y2="8.5" fill="none" stroke="#dfdfd6" strokeMiterlimit="10" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        const updatedData = {
                          username: e.target.username.value,
                          bio: e.target.bio.value,
                          profilPicture: e.target.profilPicture.value,
                          banner: e.target.banner.value,
                        };

                        const response = await axios.put(`http://localhost:8080/api/ModifyProfil/${user._id}`, updatedData);

                        if (response.status === 200) {
                          setUser(response.data);
                          setIsEditing(false);
                        }
                      } catch (error) {
                        console.error("Erreur lors de la mise à jour du profil :", error);
                      }
                    }}
                  >
                    <label>
                      Photo de profil :
                      <input type="text" name="profilPicture" defaultValue={user.profilPicture || ""} />
                    </label>
                    <label>
                      Bannière :
                      <input type="text" name="banner" defaultValue={user.banner || ""} />
                    </label>
                    <label>
                      Nom d'utilisateur :
                      <input type="text" name="username" defaultValue={user.username || ""} />
                    </label>
                    <label>
                      Bio :<textarea name="bio" defaultValue={user.bio || ""}></textarea>
                    </label>
                    <button type="submit">Enregistrer</button>
                    <button type="button" onClick={() => setIsEditing(false)}>
                      Annuler
                    </button>
                  </form>
                )}
              </>
            ) : (
              <img className="ProfilPicture" src={user.profilPicture || "/img/PPplaceholder.jpg"} alt={`${user.username}'s profil`} />
            )}
          </div>

          <div className="ProfilInfo">
            <h1 className="ProfilName">{user.username}</h1>
            <p className="ProfilBio">{user.bio || "Cet utilisateur n'a pas encore ajouté de bio."}</p>
            <div className="ProfilSocial">
              <p
                className="follow-button"
                onClick={() => setShowFollows(true)}
                style={{ cursor: "pointer", color: "var(--AccentColor)" }} // Style optionnel
              >
                {user.follows ? user.follows.length : 0} suivi(s)
              </p>

              {showFollows && (
                <div className="overlay">
                  <div className="overlay-content">
                    <button className="close-overlay" onClick={() => setShowFollows(false)}>
                      ×
                    </button>
                    <h2>Suivis de {user.username}</h2>

                    {followsProfiles && followsProfiles.length > 0 ? (
                      <div>
                        {followsProfiles.map((follow, index) => (
                          <div className="rightUser" key={follow._id}>
                            <div className="rightInfo">
                              <img
                                src={follow.profilePicture || "/img/PPplaceholder.jpg"}
                                alt={`${follow.username}'s profil`}
                                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                              />
                              <div>
                                <span>{follow.username}</span>
                                <p>{follow.bio || "Pas de bio disponible."}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>Aucun suivi trouvé.</p>
                    )}
                  </div>
                </div>
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
          <section className="ProfilPosts">
            <h2>Posts de {user.username}</h2>
            <div className="ProfilPost">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <div key={post._id} className={index === 0 ? "FirstPostProfil" : "postProfil"}>
                    <NavLink
                      to={`/EditorPage/${post._id}`}
                      className="containerPostImage"
                      style={{
                        backgroundImage: `url(${post.image || "/img/placeholder.png"})`,
                      }}
                    ></NavLink>
                    <h3>{post.name}</h3>
                  </div>
                ))
              ) : (
                <p>Aucun post trouvé.</p>
              )}
            </div>
          </section>
        </section>
        {/* Section Utilisateurs Non Suivis */}
        <section className="item box right">
          <h2>Suggestion</h2>
          {unfollowedUsers.length > 0 ? (
            <section>
              {unfollowedUsers.map((unfollowedUser, index) => (
                <div className="rightUser" key={unfollowedUser._id}>
                  <div className="rightInfo">
                    <img className="" src={unfollowedUser.profilPicture || "/img/PPplaceholder.jpg"} alt={`${unfollowedUser.username}'s profil`} />
                    <div>
                      <h2>{unfollowedUser.username}</h2>
                      <p>{unfollowedUser.bio || "Cet utilisateur n'a pas encore ajouté de bio."}</p>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        await axios.post("http://localhost:8080/api/follow", {
                          currentUserId: id,
                          userIdToFollow: unfollowedUser._id,
                        });
                        setUnfollowedUsers((prev) => prev.filter((user) => user._id !== unfollowedUser._id));
                      } catch (error) {
                        console.error("Erreur lors du suivi :", error);
                      }
                    }}
                  >
                    Suivre
                  </button>

                  {/* Condition pour ne pas ajouter un <hr /> après le dernier élément */}
                  {index !== unfollowedUsers.length - 1 && <hr />}
                </div>
              ))}
            </section>
          ) : (
            <p>Aucun utilisateur non suivi trouvé.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilPage;
