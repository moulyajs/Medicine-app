import React, { useState } from "react";
import "./SearchBar.css";
import { FaSearch } from 'react-icons/fa';

export const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInput(value);
    onSearch(value); // Call onSearch prop function with the input value
  };

  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />
      <input
        placeholder="Type to search..."
        value={input}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchBar;
