import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./addharvest.css";

const AddHarvest = () => {
  const navigate = useNavigate();
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
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Handling Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handling Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  // Form Validation
  const validateForm = () => {
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handling Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

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
      navigate("/showall"); // Redirect after submission
    } catch (error) {
      console.error("Error adding harvest:", error);
      alert("Failed to add harvest. Please try again.");
    }
  };

  return (
    <div className="harvest-container">
      <h1 className="page-title">Add Your Harvest</h1>

      <form className="harvest-form" onSubmit={handleSubmit} encType="multipart/form-data">
        
        {/* Image Upload Section */}
        <div className="form-group image-upload">
          <label className="form-label">Upload Image</label>
          <div className="image-preview-box">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="image-preview" />
            ) : (
              <div className="placeholder-icon">📷</div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} className="form-input" />
        </div>

        <div className="form-grid">
          {["Listing ID", "Character", "verity", "quantity", "price", "address", "location"].map((field) => (
            <div className="form-group" key={field}>
              <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type={field === "quantity" || field === "price" ? "number" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`form-input ${errors[field] ? "error" : ""}`}
                required
              />
              {errors[field] && <p className="error-message">{errors[field]}</p>}
            </div>
          ))}
        </div>

        <button type="submit" className="submit-button">ADD</button>
      </form>
    </div>
  );
};

export default AddHarvest;
