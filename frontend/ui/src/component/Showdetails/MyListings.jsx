import React, { useEffect, useState } from "react";
import { getFarmers } from "../../api/farmersApi";
import FarmerList from "./FarmerList";

const MyListings = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true);
        const data = await getFarmers();
        setFarmers(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch farmer listings:", err);
        setError("Failed to load your listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  if (loading) {
    return <div className="loading">Loading your listings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return <FarmerList farmers={farmers} title="My Listings" />;
};

export default MyListings;
