import React, { useState } from "react";
import "./SearchResults.css";

const SearchResults = ({ filteredMedicines, onSelectMedicine, selectedMedicine }) => {
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);

  const handleAddReview = () => {
    if (newReview && newRating) {
      const review = {
        user: "Anonymous", // Replace with actual user data if available
        comment: newReview,
        rating: newRating
      };
      // Assuming there's a function to update reviews
      selectedMedicine.reviews.push(review);
      setNewReview("");
      setNewRating(5);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className="star">
        {index < rating ? "★" : "☆"}
      </span>
    ));
  };

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
            <img
              src={`http://localhost:9000${selectedMedicine.image}`}
              alt={selectedMedicine.name}
              className="medicine-image"
            />
            <div className="medicine-details">
              <h3>{selectedMedicine.name}</h3>
              <h4>{selectedMedicine.role}</h4>
              <p className="quantity">
                {selectedMedicine.quantity} Tablet(s) in Strip
              </p>
              <div className="price-info">
                <span className="price">₹{selectedMedicine.price}</span>
              </div>
              <div className="button-group">
    <button className="add-to-cart-button">Add to Cart</button>
    <button className="view-cart-button">View Cart</button>
  </div>
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
                      <strong>{review.user}:</strong> {review.comment}{" "}
                      ({renderStars(review.rating)})
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="add-review">
              <h4>Add Your Review:</h4>
              <textarea
                placeholder="Write your review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
              />
              <select
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} Star{star > 1 && "s"}
                  </option>
                ))}
              </select>
              <button onClick={handleAddReview}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;