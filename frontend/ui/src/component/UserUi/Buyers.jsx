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
    fetchAllListings();
  }, []);

  const fetchAllListings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try multiple endpoints to get all listings
      const response = await axios.get("http://localhost:3000/api/farmers", {
        // Remove any authentication for now to test
        timeout: 10000, // 10 second timeout
      });

      console.log("API Response:", response.data); // Debug log
      
      if (response.data && Array.isArray(response.data)) {
        setFarmers(response.data);
        setFilteredFarmers(response.data);
        console.log(`Loaded ${response.data.length} listings`); // Debug log
      } else {
        console.warn("API response is not an array:", response.data);
        setError("Invalid data format received from server.");
      }
    } catch (err) {
      console.error("Error fetching farmers data:", err);
      
      // More detailed error handling
      if (err.response) {
        // Server responded with error
        if (err.response.status === 401) {
          setError("Authentication required. Please log in to view listings.");
        } else if (err.response.status === 404) {
          setError("Listings endpoint not found. Please check your server configuration.");
        } else {
          setError(`Server error: ${err.response.status}. Please try again later.`);
        }
      } else if (err.request) {
        // Request made but no response
        setError("Cannot connect to server. Please make sure the server is running on http://localhost:3000");
      } else {
        // Other errors
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Enhanced search functionality
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value.trim()) {
      // If search is empty, show all listings
      setFilteredFarmers(farmers);
      return;
    }

    const filtered = farmers.filter((farmer) => {
      const character = farmer.Character?.toLowerCase() || '';
      const variety = farmer.verity?.toLowerCase() || farmer.variety?.toLowerCase() || '';
      const location = farmer.location?.toLowerCase() || '';
      const price = farmer.price?.toString().toLowerCase() || '';
      
      return (
        character.includes(value) ||
        variety.includes(value) ||
        location.includes(value) ||
        price.includes(value)
      );
    });

    setFilteredFarmers(filtered);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredFarmers(farmers);
  };

  const handleBuyProduct = (product) => {
    navigate('/userfee', { state: { selectedProduct: product } });
  };

  const refreshListings = () => {
    fetchAllListings();
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
          100+ Customer Orders
        </motion.p>
      </motion.div>

      {/* Farmers Listing Section */}
      <div className="buyers-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>All Available Harvest Listings</h2>
          <div>
            <span style={{ marginRight: '10px', color: '#666' }}>
              {loading ? 'Loading...' : `${filteredFarmers.length} listings found`}
            </span>
            <button 
              onClick={refreshListings}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '20px',
          gap: '10px'
        }}>
          <input 
            type="text" 
            placeholder="Search by rice type, variety, location, or price..." 
            value={searchTerm}
            onChange={handleSearch}
            style={{
              width: '50%',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              style={{
                padding: '12px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 2s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Loading all listings...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ 
            textAlign: 'center', 
            color: '#dc3545', 
            padding: '20px',
            backgroundColor: '#f8d7da',
            borderRadius: '8px',
            border: '1px solid #f5c6cb',
            margin: '20px 0'
          }}>
            <h3>⚠️ Error Loading Listings</h3>
            <p>{error}</p>
            <button 
              onClick={refreshListings}
              style={{
                padding: '10px 20px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredFarmers.length === 0 && farmers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>📦 No Listings Available</h3>
            <p>There are currently no harvest listings available.</p>
            <button 
              onClick={refreshListings}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Refresh Listings
            </button>
          </div>
        )}

        {/* Search No Results */}
        {!loading && !error && filteredFarmers.length === 0 && farmers.length > 0 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>🔍 No listings match your search "{searchTerm}"</p>
            <button onClick={clearSearch} style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Show All Listings
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && filteredFarmers.length > 0 && (
          <div className="card-list">
            {filteredFarmers.map((farmer, index) => (
              <motion.div
                key={farmer._id || index}
                className="card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Image Section */}
                <div className="image-container">
                  <img
                    src={farmer.image ? `http://localhost:3000/uploads/${farmer.image}` : "/default-image.jpg"}
                    alt={`${farmer.Character || 'Rice'} harvest listing`}
                    className="farmer-image"
                    onError={(e) => {
                      e.target.src = "/default-image.jpg";
                    }}
                  />
                </div>

                {/* Details Section */}
                <div className="card-details">
                  <p>
                    <strong>🌾 Rice Type:</strong> {farmer.Character || "N/A"}
                  </p>
                  <p>
                    <strong>🌱 Variety:</strong> {farmer.verity || farmer.variety || "N/A"}
                  </p>
                  <p>
                    <strong>⚖️ Quantity:</strong> {farmer.quantity || "N/A"} kg
                  </p>
                  <p>
                    <strong>💰 Price:</strong> Rs. {farmer.price || "N/A"}
                  </p>
                  <p>
                    <strong>📍 Location:</strong> {farmer.location || "N/A"}
                  </p>
                  {farmer.description && (
                    <p>
                      <strong>📝 Description:</strong> {farmer.description}
                    </p>
                  )}
                </div>

                {/* Buy Product Button */}
                <button 
                  onClick={() => handleBuyProduct(farmer)} 
                  className="btn"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '10px',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                  🛒 Buy This Product
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Buyers;