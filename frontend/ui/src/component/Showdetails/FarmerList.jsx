import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./showlist.css";

const FarmerList = ({ farmers }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter farmers based on Character field
  const filteredFarmers = farmers.filter((farmer) => 
    farmer.Character.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!farmers || farmers.length === 0) {
    return <div className="no-borrowers">No farmers found!</div>;
  }

  return (
    <div className="farmers-list-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Rice Type..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              <tr key={index}>
                <td>{farmer.farmerId || "N/A"}</td>
                <td>{farmer.Character || "N/A"}</td>
                <td>{farmer.verity || "N/A"}</td>
                <td>{farmer.quantity || "N/A"}</td>
                <td>{farmer.price ||  "N/A"}.00</td>
                <td>{farmer.location || "N/A"}</td>
                <td>
                  {farmer._id ? (
                    <Link to={`/Show/${farmer._id}`} className="view-details-btn">
                      View Details
                    </Link>
                  ) : (
                    <span>No ID available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredFarmers.length === 0 && (
          <div className="no-results">No results found</div>
        )}
      </div>
    </div>
  );
};

export default FarmerList;