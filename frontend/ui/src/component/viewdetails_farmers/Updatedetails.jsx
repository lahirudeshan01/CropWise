import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import './updatedetails.css';

function Updatedetails() {
  const [farmer, setFarmer] = useState({
    farmerId: "",
    Character: "",  // Kept capitalized to match schema
    verity: "",
    quantity: "",
    price: "",
    address: "",
    location: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch the farmer details when the component loads
  useEffect(() => {
    console.log("Fetching farmer with ID:", id);
    setLoading(true);
    
    axios
      .get(`http://localhost:3000/api/farmers/${id}`)
      .then((res) => {
        console.log("Farmer data received:", res.data);
        setFarmer({
          farmerId: res.data.farmerId || "",
          Character: res.data.Character || "",
          verity: res.data.verity || "",
          quantity: res.data.quantity || "",
          price: res.data.price || "",
          address: res.data.address || "",
          location: res.data.location || ""
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching farmer details:", err);
        setError("Failed to load farmer data. Please try again.");
        setLoading(false);
      });
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmer((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Optional validation - since your schema uses strings, this is a gentle validation
  const validateForm = () => {
    // Check if quantity and price contain numeric values (since they're stored as strings)
    if (isNaN(Number(farmer.quantity))) {
      setError("Quantity must be a numeric value");
      return false;
    }
    
    if (isNaN(Number(farmer.price))) {
      setError("Price must be a numeric value");
      return false;
    }
    
    return true;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    console.log("Submitting updated farmer data:", farmer);
    
    axios
      .put(`http://localhost:3000/api/farmers/${id}`, farmer)
      .then((res) => {
        console.log("Update response:", res.data);
        // Navigate to the farmer details page after successful update
        navigate(`/showall`);
      })
      .catch((err) => {
        console.error("Error updating farmer:", err);
        setError("Failed to update farmer data. Please try again.");
      });
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate(`/showall`);
  };

  if (loading) {
    return <div className="loading-message">Loading farmer data...</div>;
  }

  return (
    <div className="update-form-container">
      <div className="update-form">
        <h2 className="form-title">Update Farmer</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="farmerId">Farmer ID:</label>
            <input
              type="text"
              id="farmerId"
              name="farmerId"
              value={farmer.farmerId}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="Character">Character:</label>
            <input
              type="text"
              id="Character"
              name="Character"
              value={farmer.Character}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="verity">Verity:</label>
            <input
              type="text"
              id="verity"
              name="verity"
              value={farmer.verity}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={farmer.quantity}
              onChange={handleChange}
              required
              pattern="[0-9]*"
              title="Please enter a numeric value"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="text"
              id="price"
              name="price"
              value={farmer.price}
              onChange={handleChange}
              required
              pattern="[0-9]*\.?[0-9]*"
              title="Please enter a numeric value"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={farmer.address}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={farmer.location}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="update-button">Update</button>
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Updatedetails;