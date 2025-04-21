import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./addharvest.css";

const AddHarvest = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
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
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
      
      // Clear error if exists
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: undefined
        }));
      }
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: undefined
        }));
      }
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    
    // Specific validations
    if (!formData.farmerId.trim()) newErrors.farmerId = "Listing ID is required";
    if (!formData.Character.trim()) newErrors.Character = "Rice Type is required";
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
      // Scroll to first error
      const firstErrorField = document.querySelector('.error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setSubmitting(true);

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

      // Show success message with animation
      const successNotification = document.createElement('div');
      successNotification.className = 'success-notification';
      successNotification.innerHTML = '<div class="success-icon">✓</div><div>Harvest added successfully!</div>';
      document.body.appendChild(successNotification);
      
      setTimeout(() => {
        successNotification.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        successNotification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(successNotification);
          navigate("/showall"); // Redirect after success message
        }, 500);
      }, 2000);
      
    } catch (error) {
      console.error("Error adding harvest:", error);
      setSubmitting(false);
      
      // Show error notification
      const errorNotification = document.createElement('div');
      errorNotification.className = 'error-notification';
      errorNotification.innerHTML = '<div class="error-icon">!</div><div>Failed to add harvest. Please try again.</div>';
      document.body.appendChild(errorNotification);
      
      setTimeout(() => {
        errorNotification.classList.add('show');
      }, 100);
      
      setTimeout(() => {
        errorNotification.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(errorNotification);
        }, 500);
      }, 3000);
    }
  };

  return (
    <div className={`harvest-container ${isLoaded ? 'fade-in' : ''}`}>
      <div className="page-header">
        <h1 className="page-title">Add Your Harvest</h1>
        <p className="page-subtitle">List your rice products for buyers to discover</p>
      </div>

      <div className="form-card">
        <form className="harvest-form" onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Image Upload Section */}
          <div 
            className={`form-group image-upload ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <label className="form-label image-label">
              <i className="upload-icon"></i>
              Upload Image
            </label>
            <div className="image-preview-container">
              <div className="image-preview-box">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                ) : (
                  <div className="placeholder-content">
                    <div className="placeholder-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="#bdbdbd"/>
                      </svg>
                    </div>
                    <p className="placeholder-text">Drag & drop your image here or click to browse</p>
                  </div>
                )}
              </div>
            </div>
            <input 
              type="file" 
              id="image-upload"
              accept="image/*" 
              onChange={handleImageChange} 
              className="file-input"
            />
            <label htmlFor="image-upload" className="browse-button">
              Browse Files
            </label>
            {errors.image && <p className="error-message"><i className="error-icon-small"></i>{errors.image}</p>}
          </div>

          <div className="form-grid">
            {[
              { name: "farmerId", label: "Listing ID", icon: "listing" },
              { name: "Character", label: "Rice Type", icon: "rice" },
              { name: "verity", label: "Verity", icon: "variety" },
              { name: "quantity", label: "Available Quantity (kg)", type: "number", icon: "quantity" },
              { name: "price", label: "Price (per kg)", type: "number", icon: "price" },
              { name: "address", label: "Address", icon: "address" },
              { name: "location", label: "Location", icon: "location" }
            ].map(({ name, label, type = "text", icon }) => (
              <div className="form-group input-field" key={name}>
                <label className="form-label" htmlFor={name}>
                  <i className={`field-icon ${icon}-icon`}></i>
                  {label}
                </label>
                <input
                  type={type}
                  id={name}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`form-input ${errors[name] ? "error" : ""}`}
                  required
                  min={type === "number" ? "0" : undefined}
                  step={type === "number" ? "0.01" : undefined}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
                {errors[name] && <p className="error-message"><i className="error-icon-small"></i>{errors[name]}</p>}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={() => navigate('/showall')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`submit-button ${submitting ? 'submitting' : ''}`}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <i className="submit-icon"></i>
                  <span>Add Harvest</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHarvest;