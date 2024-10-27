import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
//import "./Search.css";

function Search() {
  const [allMedicines, setAllMedicines] = useState([]); // Store all medicine data fetched once
  const [filteredMedicines, setFilteredMedicines] = useState([]); // Store filtered medicines
  const [selectedMedicine, setSelectedMedicine] = useState(null); // Store selected medicine details
  const [error, setError] = useState(null); // Store error messages

  // Fetch all medicine data once on component mount
  useEffect(() => {
    fetch("http://localhost:9000/api/medicines")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch medicine data");
        }
        return response.json();
      })
      .then((data) => {
        setAllMedicines(data.data);
        setError(null); // Clear any error if successful
      })
      .catch((err) => {
        setError("Failed to fetch medicine data: " + err.message);
      });
  }, []);

  const handleSearch = (value) => {
    if (value.trim()) {
      const filtered = allMedicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(value.toLowerCase()) ||
        medicine.description.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMedicines(filtered);
      setSelectedMedicine(null); // Clear selected medicine when filtering
      setError(null); // Clear errors
    } else {
      setFilteredMedicines([]); // Clear filter if input is empty
    }
  };

  const handleSelectMedicine = (medicine) => {
    setSelectedMedicine(medicine);
    setFilteredMedicines([]); // Clear filtered list upon selection
  };

  return (
    <div className="search">
      <div className="search-bar-container">
        <SearchBar onSearch={handleSearch} /> {/* Pass handleSearch as a prop */}
        <div id="search-results">
          <SearchResults
            filteredMedicines={filteredMedicines}
            selectedMedicine={selectedMedicine}
            onSelectMedicine={handleSelectMedicine}
          />
        </div>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
export default Search;