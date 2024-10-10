import { useState, useRef } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null); // Création de la référence à l'input

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Appelle la fonction de recherche fournie par le parent
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Met le focus sur l'input
    }
  };

  return (
    <div className="SearchBar" onClick={handleClick}>
      <img src="/img/SearchIcon.svg" alt="Search Icon" className="search-icon" />
      <input
        type="text"
        placeholder="Chercher une idée..."
        value={query}
        onChange={handleSearch}
        ref={inputRef} // Associe la référence à l'input
      />
    </div>
  );
};

// Validation des props
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired, // 'onSearch' doit être une fonction
};

export default SearchBar;
