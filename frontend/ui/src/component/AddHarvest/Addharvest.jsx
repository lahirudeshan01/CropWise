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
    setFormData((prevData) => ({ 
      ...prevData, 
      [name]: value 
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
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
    const newErrors = {};
    
    // Specific validations
    if (!formData.farmerId.trim()) newErrors.farmerId = "Listing ID is required";
    if (!formData.Character.trim()) newErrors.Character = "Character is required";
    if (!formData.quantity.trim()) newErrors.quantity = "Quantity is required";
    if (!formData.price.trim()) newErrors.price = "Price is required";
    if (!formData.verity.trim()) newErrors.verity = "Verity is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    
    // Numeric validations
    if (formData.quantity && isNaN(Number(formData.quantity))) {
      newErrors.quantity = "Quantity must be a number";
    }
    
    if (formData.price && isNaN(Number(formData.price))) {
      newErrors.price = "Price must be a number";
    }

    // Image validation (optional)
    if (!image) {
      newErrors.image = "Please upload an image";
    }

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
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="form-input"
            required
          />
          {errors.image && <p className="error-message">{errors.image}</p>}
        </div>

        <div className="form-grid">
          {[
            { name: "farmerId", label: "Listing ID" },
            { name: "Character", label: "Rice Type" },
            { name: "verity", label: "Verity" },
            { name: "quantity", label: "Avalibale Quantity", type: "number" },
            { name: "price", label: "Price", type: "number" },
            { name: "address", label: "Address" },
            { name: "location", label: "Location" }
          ].map(({ name, label, type = "text" }) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className={`form-input ${errors[name] ? "error" : ""}`}
                required
                min={type === "number" ? "0" : undefined}
                step={type === "number" ? "0.01" : undefined}
              />
              {errors[name] && <p className="error-message">{errors[name]}</p>}
            </div>
          ))}
        </div>

        <button type="submit" className="submits-button">ADD HARVEST</button>
      </form>
    </div>
  );
};

export default AddHarvest;