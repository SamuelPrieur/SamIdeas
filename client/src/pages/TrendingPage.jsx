import { useState, useEffect } from "react";
import Navbar from "@components/Navbar";
import Grid from "@components/Grid";
import SearchBar from "@components/SearchBar";
import axios from "axios";

const TrendingPage = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const fetchAPI = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/posts"); // Route modifiée
      const data = response.data; // Pas besoin de "fruit" ici, on utilise directement les données de posts
      setPosts(data); // Stocke les posts dans l'état
      setFilteredPosts(data); // Affiche initialement tous les posts
    } catch (error) {
      console.error("Erreur lors de la récupération des posts :", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  const handleSearchFunction = (query) => {
    const results = posts.filter((post) => post.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredPosts(results);
  };

  return (
    <div>
      <Navbar />
      <SearchBar onSearch={handleSearchFunction} />
      <Grid posts={filteredPosts} /> {/* Passe les posts filtrés à Grid */}
    </div>
  );
};

export default TrendingPage;
