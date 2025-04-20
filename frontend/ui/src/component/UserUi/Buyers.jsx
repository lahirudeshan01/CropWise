import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import "./card.css";

const Buyers = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3000/api/farmers")
      .then((res) => {
        setFarmers(res.data);
        setFilteredFarmers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error getting farmers data:", err);
        setError("Failed to load farmers data. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Search functionality
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = farmers.filter(
      (farmer) =>
        farmer.Character.toLowerCase().includes(value) ||
        farmer.verity.toLowerCase().includes(value) ||
        farmer.location.toLowerCase().includes(value)
    );

    setFilteredFarmers(filtered);
  };

  const handleBuyProduct = (product) => {
    // Navigate to Userfee and pass the selected product as state
    navigate('/userfee', { state: { selectedProduct: product } });
  };

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="hero"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="hero-heading-container"
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
        >
          <h1 className="hero-heading">
            <div>
              {["Empowering Farmers With"].map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="animated-word"
                >
                  {word}{" "}
                </motion.span>
              ))}
            </div>
            <div>
              {["Cutting-Edge Technology"].map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="animated-word"
                >
                  {word}{" "}
                </motion.span>
              ))}
            </div>
          </h1>
        </motion.div>
        <p>
          CropWise offers innovative solutions to help farmers optimize
          productivity and sustainability.
        </p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="happy-customers"
        >
          100+ Custommers Orders
        </motion.p>
      </motion.div>

      {/* Farmers Listing Section */}
      <div className="buyers-container">
        <h2>Available Harvest Listings</h2>
        
        {/* Search Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '20px' 
        }}>
          <input 
            type="text" 
            placeholder="Search by Character, Variety, or Location" 
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: '50%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}
          />
        </div>

        {loading ? (
          <p>Loading farmers data...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredFarmers.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <div className="card-list">
            {filteredFarmers.map((farmer) => (
              <motion.div
                key={farmer._id}
                className="card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Image Section */}
                <div className="image-container">
                  <img
                    src={`http://localhost:3000/uploads/${farmer.image}`}
                    alt="Harvest"
                    className="farmer-image"
                    onError={(e) => (e.target.src = "/default-image.jpg")} // Fallback image
                  />
                </div>

                {/* Details Section */}
                <p>
                  <strong>Rice Type:</strong>  {farmer.Character || "N/A"}
                </p>
                <p>
                  <strong>Variety:</strong>  {farmer.verity || "N/A"}
                </p>
                <p>
                  <strong>Quantity:</strong>  {farmer.quantity || "N/A"} kg
                </p>
                <p>
                  <strong>Price:</strong>  Rs.{farmer.price || "N/A"}
                </p>
                <p>
                  <strong>Location:</strong>  {farmer.location || "N/A"}
                </p>

                {/* Buy Product Button */}
                <button 
                  onClick={() => handleBuyProduct(farmer)} 
                  className="btn"
                >
                  Buy Product
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Buyers;