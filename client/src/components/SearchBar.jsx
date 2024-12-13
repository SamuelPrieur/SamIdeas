import { useState, useRef } from "react";
import PropTypes from "prop-types";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="SearchBar" onClick={handleClick}>
      <img src="/img/SearchIcon.svg" alt="Search Icon" className="search-icon" />
      <input type="text" placeholder="Chercher une idée..." value={query} onChange={handleSearch} ref={inputRef} />
    </div>
  );
};

// Validation des props
SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default SearchBar;
