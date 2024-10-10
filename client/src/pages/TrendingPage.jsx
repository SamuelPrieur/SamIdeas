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
      const response = await axios.get("http://localhost:8080/api/posts"); // Mettez à jour l'URL
      const data = response.data; // Les données sont directement sous la réponse
      setPosts(data); // Store the fetched posts in state
      setFilteredPosts(data); // Initially display all posts
    } catch (error) {
      console.error("Error fetching the API", error);
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  // Fonction de recherche
  const handleSearchFunction = (query) => {
    const results = posts.filter((post) => post.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredPosts(results);
  };

  return (
    <div>
      <Navbar />
      <SearchBar onSearch={handleSearchFunction} />
      <Grid posts={filteredPosts} /> {/* Passes les posts filtrés à Grid */}
    </div>
  );
};

export default TrendingPage;
