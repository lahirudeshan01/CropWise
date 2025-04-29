import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './EditDetails.css';

function EditUserDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    farmName: "",
    area: "",
    startDate: "",
    typeOfRice: ""
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    // Calculate date range (3 months before and after today)
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);
    
    setMinDate(threeMonthsAgo.toISOString().split('T')[0]);
    setMaxDate(threeMonthsLater.toISOString().split('T')[0]);

    // Load user data if available
    const fetchUserData = async () => {
      try {
        if (location.state?.userData) {
          // If data was passed via navigation state
          const userData = location.state.userData;
          const formattedDate = userData.startDate ? 
            new Date(userData.startDate).toISOString().split('T')[0] : '';
          
          setInputs({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            farmName: userData.farmName || "",
            area: userData.area || "",
            startDate: formattedDate,
            typeOfRice: userData.typeOfRice || ""
          });
        } else {
          // If page was refreshed, get data from localStorage or API
          const user = JSON.parse(localStorage.getItem('userData'));
          if (user && user._id) {
            const response = await axios.get(`http://localhost:3000/users/${user._id}`);
            const userData = response.data.user;
            const formattedDate = userData.startDate ? 
              new Date(userData.startDate).toISOString().split('T')[0] : '';
            
            setInputs({
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              email: userData.email || "",
              farmName: userData.farmName || "",
              area: userData.area || "",
              startDate: formattedDate,
              typeOfRice: userData.typeOfRice || ""
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setErrorMessage("Failed to load user data");
      }
    };

    fetchUserData();
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'startDate') {
      const selectedDate = new Date(value);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(new Date().getMonth() - 3);
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(new Date().getMonth() + 3);
      
      if (selectedDate < threeMonthsAgo) {
        setErrorMessage('Start date cannot be older than 3 months ago');
        return;
      }
      if (selectedDate > threeMonthsLater) {
        setErrorMessage('Start date cannot be more than 3 months in the future');
        return;
      }
      setErrorMessage('');
    }
    
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const user = JSON.parse(localStorage.getItem('userData'));
      if (!user || !user._id) {
        throw new Error("User not authenticated");
      }

      const formattedDate = new Date(inputs.startDate).toISOString();
      
      const response = await axios.put(`http://localhost:3000/users/${user._id}`, {
        firstName: inputs.firstName.trim(),
        lastName: inputs.lastName.trim(),
        email: inputs.email.toLowerCase().trim(),
        farmName: inputs.farmName.trim(),
        area: Number(inputs.area),
        startDate: formattedDate,
        typeOfRice: inputs.typeOfRice
      });

      if (response.data) {
        // Update local storage with new data
        localStorage.setItem('userData', JSON.stringify({
          ...user,
          ...response.data.user
        }));
        
        alert("Profile updated successfully!");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Update error:", error);
      setErrorMessage(error.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const user = JSON.parse(localStorage.getItem('userData'));
      if (!user || !user._id) {
        throw new Error("User not authenticated");
      }

      await axios.delete(`http://localhost:3000/users/${user._id}`);
      
      // Clear user data and redirect to login
      localStorage.removeItem('userData');
      alert("Account deleted successfully");
      navigate('/');
    } catch (error) {
      console.error("Delete error:", error);
      setErrorMessage(error.response?.data?.message || "Delete failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    navigate('/');
  };

  return (
    <div className="edit-user-page">
      <div className="edit-user-container">
        <h2>Farmer Details</h2>
        <form className="edit-user-form" onSubmit={handleUpdate}>
          {/* Personal Information */}
          <div className="form-row">
            <div className="input-group">
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder=" "
                value={inputs.firstName}
                onChange={handleChange}
                required
              />
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className="input-group">
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder=" "
                value={inputs.lastName}
                onChange={handleChange}
                required
              />
              <label htmlFor="lastName">Last Name</label>
            </div>
          </div>

          {/* Contact Information */}
          <div className="input-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder=" "
              value={inputs.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          {/* Farm Information */}
          <div className="input-group">
            <input
              type="text"
              id="farmName"
              name="farmName"
              placeholder=" "
              value={inputs.farmName}
              onChange={handleChange}
              required
            />
            <label htmlFor="farmName">Farm Name</label>
          </div>

          {/* Farm Details */}
          <div className="form-row">
            <div className="input-group">
              <input
                type="number"
                id="area"
                name="area"
                placeholder=" "
                min="0"
                step="0.1"
                value={inputs.area}
                onChange={handleChange}
                required
              />
              <label htmlFor="area">Cultivation Area (acres)</label>
            </div>
            <div className="input-group">
              <input
                type="date"
                id="startDate"
                name="startDate"
                placeholder=" "
                value={inputs.startDate}
                onChange={handleChange}
                min={minDate}
                max={maxDate}
                required
              />
              <label htmlFor="startDate">Cultivation Start Date</label>
              <div className="date-hint">
                (Must be within 3 months before or after today)
              </div>
            </div>
          </div>

          {/* Rice Type Selection */}
          <div className="input-group">
            <select
              id="typeOfRice"
              name="typeOfRice"
              value={inputs.typeOfRice}
              onChange={handleChange}
              required
            >
              <option value="">Select Rice Type</option>
              <option value="basmati">Basmati</option>
              <option value="samba">Samba</option>
              <option value="red">Red Rice</option>
              <option value="white">White Rice</option>
            </select>
            <label htmlFor="typeOfRice">Type of Rice</label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              type="submit"
              className="update-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update'}
            </button>
            <button
              type="button"
              className="logout-btn"
              onClick={handleLogout}
              disabled={isSubmitting}
            >
              Logout
            </button>
            <button
              type="button"
              className="delete-btn"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserDetails;