import React from "react";
import { Link } from "react-router-dom";
import "./showlist.css";

const FarmerList = ({ farmers }) => {
  if (!farmers || farmers.length === 0) {
    return <div className="no-borrowers">No farmers found!</div>;
  }

  return (
    <div className="table-container">
      <table className="borrower-table">
        <thead>
          <tr>
          
            <th>Listing ID</th>
            <th>Character</th>
            <th>Verity</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map((farmer, index) => (
            <tr key={index}>
              {/* <td>{farmer._id || "N/A"}</td> */}
              <td>{farmer.farmerId || "N/A"}</td>
              <td>{farmer.Character || "N/A"}</td>
              <td>{farmer.verity || "N/A"}</td>
              <td>{farmer.quantity || "N/A"}</td>
              <td>{farmer.price || "N/A"}</td>
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
    </div>
  );
};

export default FarmerList;