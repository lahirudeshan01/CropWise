import React, { useState, useEffect } from "react";
import axios from "axios";
import FarmerList from "./FarmerList";

const Showall = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/api/farmers")
      .then((res) => {
        setFarmers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error getting farmers data:", err);
        setError("Failed to load farmers data. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading farmers data...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="borrowers-page">
      <h1>Farmers List</h1>
      <FarmerList farmers={farmers} />
    </div>
  );
};

export default Showall;