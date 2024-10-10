import { useState } from "react";
import Navbar from "@components/Navbar";
import Grid from "@components/Grid";
import SearchBar from "@components/SearchBar";

const TrendingPage = () => {
  const items = ["Item 1", "Item 2", "Item 3"]; // Constante simple
  const [filteredItems, setFilteredItems] = useState(items);

  const handleSearchFunction = (query) => {
    const results = items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
    setFilteredItems(results);
  };

  return (
    <div>
      <Navbar />
      <SearchBar onSearch={handleSearchFunction} />
      <Grid items={filteredItems} />
    </div>
  );
};

export default TrendingPage;
