import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "./Header";
import "./card.css"; // Ensure your styles are included

const Buyers = () => {
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
        <br/>

        {loading ? (
          <p>Loading farmers data...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="card-list">
            {farmers.map((farmer) => (
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
                {/* <h3>Listing ID: {farmer._id || "N/A"}</h3> */}
                <p>
                  <strong>Character:</strong>  {farmer.Character || "N/A"}
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

                {/* View Details Button */}
                <Link to={`/viewdetails/${farmer._id}`} className="btn">
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Buyers;
