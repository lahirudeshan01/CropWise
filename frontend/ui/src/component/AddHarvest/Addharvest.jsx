import React, { useState } from "react";
import axios from "axios";
import "./addharvest.css";

const AddHarvest = () => {
  const [formData, setFormData] = useState({
    farmerId: "",
    Character: "",
    quantity: "",
    price: "",
    verity: "",
    address: "",
    location: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataWithImage = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataWithImage.append(key, formData[key]);
    });

    if (image) {
      formDataWithImage.append("image", image);
    }

    try {
      await axios.post("http://localhost:3000/api/farmers", formDataWithImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Harvest added successfully!");

      setFormData({
        farmerId: "",
        Character: "",
        quantity: "",
        price: "",
        verity: "",
        address: "",
        location: "",
      });
      setImage(null);
    } catch (error) {
      console.error("Error adding harvest:", error);
      alert("Failed to add harvest. Please try again.");
    }
  };

  return (
    <div className="harvest-container">
      <h1 className="page-title">Add Your Harvest</h1>

      <form className="harvest-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="form-input" />
          </div>

          <div className="form-group">
            <label className="form-label">Listing ID</label>
            <input type="text" name="farmerId" value={formData.farmerId} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Characters</label>
            <input type="text" name="Character" value={formData.Character} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Variety</label>
            <input type="text" name="verity" value={formData.verity} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Quantity (kg)</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="form-input" min="0" required />
          </div>

          <div className="form-group">
            <label className="form-label">Price (per kg)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-input" min="0" required />
          </div>

          <div className="form-group">
            <label className="form-label">Farmer Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" required />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-input" required />
          </div>
        </div>

        <button type="submit" className="submit-button">
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddHarvest;
