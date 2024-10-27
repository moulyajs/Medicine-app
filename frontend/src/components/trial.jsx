import React from "react";
import "./SearchResults.css";

const SearchResults = ({ filteredMedicines, onSelectMedicine, selectedMedicine }) => {
  return (
    <div className="search-results">
      {filteredMedicines.length > 0 && (
        <div className="filtered-medicines">
          {filteredMedicines.map((medicine, index) => (
            <div
              key={index}
              onClick={() => onSelectMedicine(medicine)}
              className="filtered-medicine-item"
            >
              {medicine.name}
            </div>
          ))}
        </div>
      )}

      {selectedMedicine && (
        <div className="medicine-info">
          <div className="medicine-header">
            <img src={`http://localhost:9000${selectedMedicine.image}`} alt={selectedMedicine.name} className="medicine-image" />
            <div className="medicine-details">
              <h3>{selectedMedicine.name}</h3>
              <h4>{selectedMedicine.role}</h4>
              <p className="quantity">{selectedMedicine.quantity} Tablet(s) in Strip
              </p>
              <div className="price-info">
                
                <span className="price">₹{selectedMedicine.price}</span>
              </div>
              <button  className="add-to-cart-button">
            Add to Cart
          </button>
            </div>
            
          </div>
          
          <div className="medicine-extra-info">
            <h4>Description:</h4>
            <p>{selectedMedicine.description}</p>

            {selectedMedicine.warnings && (
              <div>
                <h4>Warnings:</h4>
                <p>{selectedMedicine.warnings}</p>
              </div>
            )}

            {selectedMedicine.precautions && (
              <div>
                <h4>Precautions:</h4>
                <p>{selectedMedicine.precautions}</p>
              </div>
            )}

            {selectedMedicine.reviews && selectedMedicine.reviews.length > 0 && (
              <div>
                <h4>Reviews:</h4>
                <ul>
                  {selectedMedicine.reviews.map((review, index) => (
                    <li key={index}>
                      <strong>{review.user}:</strong> {review.comment} (Rating: {review.rating})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        
        </div>
        
      )}
    </div>
  );
};

export default SearchResults;