import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@components/Navbar";
import Grid from "@components/Grid";
import SearchBar from "@components/SearchBar";
import axios from "axios";

const TrendingPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);

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
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/posts");
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des posts :", error);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPost = async () => {
    if (!currentUserId) {
      alert("Utilisateur non connecté. Veuillez vous reconnecter.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/createPost", {
        name: "Nouveau Post",
        head: "",
        image: "",
        HTML: "",
        CSS: "",
        JS: "",
        creator: currentUserId,
      });

      const newPostId = response.data._id;
      navigate(`/EditorPage/${newPostId}`);
    } catch (error) {
      console.error("Erreur lors de la création du post :", error);
      alert("Impossible de créer un nouveau post.");
    }
  };

  const handleSearchFunction = (query) => {
    const results = posts.filter((post) => post.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredPosts(results);
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

export default TrendingPage;
