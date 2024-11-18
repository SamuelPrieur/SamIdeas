import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@components/Navbar";
import Grid from "@components/Grid";
import SearchBar from "@components/SearchBar";
import axios from "axios";

const FollowingPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const navigate = useNavigate(); // Pour rediriger

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
    if (!currentUserId) return;

    const fetchFollowingPosts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/following/${currentUserId}`);
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts suivis :", error);
      }
    };

    fetchFollowingPosts();
  }, [currentUserId]);

  const handleSearchFunction = (query) => {
    const results = posts.filter((post) => post.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredPosts(results);
  };

  const handleNewPost = async () => {
    if (!currentUserId) {
      alert("Utilisateur non connecté. Veuillez vous reconnecter.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/createPost", {
        name: "Nouveau Post",
        head: "<head></head>",
        image: "",
        HTML: "",
        CSS: "",
        JS: "",
        creator: currentUserId,
      });

      const newPostId = response.data._id; // Récupérer l'ID du post créé
      navigate(`/EditorPage/${newPostId}`); // Rediriger vers EditorPage avec l'ID
    } catch (error) {
      console.error("Erreur lors de la création du post :", error);
      alert("Impossible de créer un nouveau post.");
    }
  };

  return (
    <div>
      <Navbar />
      <SearchBar onSearch={handleSearchFunction} />
      <Grid posts={filteredPosts} />
      <button onClick={handleNewPost} className="NewPostButton">
        <p>Une nouvelle Idée ?</p>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <polygon
            points="3 21 4 16.5 17.5 3 18.5 3 21 5.5 21 6.5 7.5 20 3 21"
            fill="none"
            stroke="#dfdfd6"
            strokeWidth="1.8"
            strokeMiterlimit="10"
          />
          <line x1="15.5" y1="4.5" x2="19.5" y2="8.5" fill="none" stroke="#dfdfd6" strokeWidth="1.8" strokeMiterlimit="10" />
        </svg>
      </button>
    </div>
  );
};

export default FollowingPage;
