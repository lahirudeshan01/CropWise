import React, { useState, useEffect } from "react";
import { getFarmers } from "../../api/farmersApi";
import FarmerList from "./FarmerList";

const Showall = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getFarmers()
      .then((data) => {
        setFarmers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error getting farmers data:", err);
        setError("Failed to load your listings. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading your listings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="borrowers-page">
      <h1>My Harvest Listings</h1>
      <FarmerList farmers={farmers} />
    </div>
  );
};

export default Showall;