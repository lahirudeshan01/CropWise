import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./addharvest.css";
import { addFarmer } from "../../api/farmersApi";

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
  
  // Chatbot states
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotMinimized, setChatbotMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Handling Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form data
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

    // Check if both Character and price are filled to trigger the chatbot
    // Important: Use the current value from the input rather than state
    const updatedCharacter = name === "Character" ? value : formData.Character;
    const updatedPrice = name === "price" ? value : formData.price;
    
    if ((name === "Character" || name === "price") && 
        updatedCharacter.trim() && 
        updatedPrice.trim() && 
        !showChatbot) {
      // Small delay to ensure state is updated
      setTimeout(() => {
        // Pass the current values to the function
        showChatbotWithPriceSuggestion(updatedCharacter, updatedPrice);
      }, 300);
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

  const showChatbotWithPriceSuggestion = async (character, price) => {
    setShowChatbot(true);
    setChatbotMinimized(false);
    setLoadingResponse(true);
    
    // Add welcome message - using the passed parameters
    setChatMessages([
      { 
        type: 'bot', 
        text: `Hello! I see you're listing ${character} rice for Rs.${price} per kg. I'll check the current market prices for you...` 
      }
    ]);

    // Fetch AI suggestion - using the passed parameters
    const aiRequestData = {
      contents: [{
        parts: [{
          text: `Give current marketprice of 1kg of ${character}. I'm going to sell 1kg for Rs.${price}. In response give a brief description explaining the difference and what is a good price within 100 words. Don't use ** or \\n, etc.`
        }]
      }]
    };
  
    try {
      const aiResponse = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA4e2B4bOhENr6DEbt6covF92CC4VZYa2E",
        aiRequestData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
  
      const responseText = aiResponse.data.candidates[0].content.parts[0].text;
      
      // Add AI response to chat
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', text: responseText }
      ]);
      
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      
      // Add error message to chat
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', text: "Sorry, I couldn't fetch the market price information at this time." }
      ]);
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Add user message to chat
    setChatMessages(prev => [
      ...prev,
      { type: 'user', text: userInput }
    ]);
    
    const userQuestion = userInput;
    setUserInput(''); // Clear input field
    setLoadingResponse(true);
    
    // Process user question with AI - use current formData values
    const aiRequestData = {
      contents: [{
        parts: [{
          text: `User asked: "${userQuestion}" about ${formData.Character} rice they're selling for Rs.${formData.price}. Please provide a helpful response about rice farming, market trends, or pricing strategies within 100 words.`
        }]
      }]
    };
    
    try {
      const aiResponse = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyA4e2B4bOhENr6DEbt6covF92CC4VZYa2E",
        aiRequestData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
  
      const responseText = aiResponse.data.candidates[0].content.parts[0].text;
      
      // Add AI response to chat
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', text: responseText }
      ]);
      
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      
      // Add error message to chat
      setChatMessages(prev => [
        ...prev,
        { type: 'bot', text: "Sorry, I couldn't process your question at this time." }
      ]);
    } finally {
      setLoadingResponse(false);
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
      await addFarmer(formDataWithImage);

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

  // Toggle chatbot visibility with improved behavior
  const toggleChatbot = () => {
    if (showChatbot && !chatbotMinimized) {
      setChatbotMinimized(true);
    } else {
      setShowChatbot(true);
      setChatbotMinimized(false);
      
      // If no messages yet, show intro message based on current form data
      if (chatMessages.length === 0 && formData.Character && formData.price) {
        showChatbotWithPriceSuggestion(formData.Character, formData.price);
      }
    }
  };

  // Close chatbot
  const closeChatbot = () => {
    setShowChatbot(false);
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
              { name: "verity", label: "Verity", icon: "variety" },
              { name: "quantity", label: "Available Quantity (kg)", type: "number", icon: "quantity" },
              { name: "price", label: "Price (per kg)", type: "number", icon: "price" },
              { name: "Character", label: "Rice Type", icon: "rice" },
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

      {/* Chatbot Icon - Always visible when not expanded */}
      <div className="chatbot-icon" onClick={toggleChatbot} style={{ 
       position:'fixed',
        bottom: '10px', 
        left:'950px',
        display: (showChatbot && !chatbotMinimized) ? 'none' : 'flex'
      }}>
        <div className="chat-icon">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#ffffff">
            <path d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M20,16H6l-2,2V4h16V16z"/>
            <path d="M7,9h2v2H7V9z M11,9h2v2h-2V9z M15,9h2v2h-2V9z"/>
          </svg>
        </div>
      </div>

      {/* Chatbot Window */}
      {(showChatbot && !chatbotMinimized) && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">CropWise AI</div>
            <div className="chatbot-controls">
              <div className="minimize-button" onClick={toggleChatbot}>─</div>
              <div className="close-button" onClick={closeChatbot}>×</div>
            </div>
          </div>
          <div className="chatbot-body">
            <div className="chat-messages">
              {chatMessages.map((message, index) => (
                <div key={index} className={`chat-message ${message.type}`}>
                  {message.text}
                </div>
              ))}
              {loadingResponse && (
                <div className="chat-message bot loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="chatbot-footer">
            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                placeholder="Type a message..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="chat-input"
              />
              <button type="submit" className="send-button">Send</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddHarvest;