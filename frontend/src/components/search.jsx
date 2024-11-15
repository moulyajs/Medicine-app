import React, { useState} from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";

function Search() {
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = (value) => {
    if (value.trim()) {
      fetch(`http://localhost:5000/api/medicines/search?name=${encodeURIComponent(value)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch search results");
          }
          return response.json();
        })
        .then((data) => {
          setFilteredMedicines(data);
          setError(null);
        })
        .catch((err) => {
          setError("Failed to fetch search results: " + err.message);
        });
    } else {
      setFilteredMedicines([]);
    }
  };

  const handleSelectMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setFilteredMedicines([]);
  };

  return (
    <div className="search">
      <div className="search-bar-container">
      <SearchBar onSearch={handleSearch} />
      <SearchResults
        filteredMedicines={filteredMedicines}
        selectedMedicine={selectedMedicine}
        onSelectMedicine={handleSelectMedicine}
        setSelectedMedicine={setSelectedMedicine}
      />
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
export default Search;
