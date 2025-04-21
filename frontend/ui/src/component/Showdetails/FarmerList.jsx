import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./showlist.css";

const FarmerList = ({ farmers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Filter farmers based on Character field
  const filteredFarmers = farmers.filter((farmer) => 
    farmer.Character.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add animation effect when component mounts
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!farmers || farmers.length === 0) {
    return <div className="no-farmers-container">
      <div className="no-farmers">
        <i className="icon-basket"></i>
        <h3>No farmers found!</h3>
        <p>Try again later or change your search criteria</p>
      </div>
    </div>;
  }

  return (
    <div className={`farmers-list-container ${isLoaded ? 'fade-in' : ''}`}>
      <div className="search-wrapper">
        <div className="search-container">
          
          <input
            type="text"
            placeholder="Search by Rice Type..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      <div className="table-container">
        <table className="borrower-table">
          <thead>
            <tr>
              <th>Listing ID</th>
              <th>Rice Type</th>
              <th>Verity</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarmers.map((farmer, index) => (
              <tr key={index} className="table-row-animate">
                <td><span className="farmer-id">{farmer.farmerId || "N/A"}</span></td>
                <td><span className="rice-type">{farmer.Character || "N/A"}</span></td>
                <td>{farmer.verity || "N/A"}</td>
                <td><span className="quantity-badge">{farmer.quantity || "N/A"}</span></td>
                <td><span className="price-tag">Rs.{farmer.price || "N/A"}.00</span></td>
                <td><span className="location-badge">{farmer.location || "N/A"}</span></td>
                <td>
                  {farmer._id ? (
                    <Link to={`/Show/${farmer._id}`} className="view-details-btn">
                      <span>View Details</span>
                      <i className="icon-arrow-right"></i>
                    </Link>
                  ) : (
                    <span className="no-id">No ID available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFarmers.length === 0 && (
          <div className="no-results">
            <i className="icon-search-minus"></i>
            <h3>No results found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
      
      <div className="results-count">
        Showing {filteredFarmers.length} of {farmers.length} listings
      </div>
    </div>
  );
};

export default FarmerList;