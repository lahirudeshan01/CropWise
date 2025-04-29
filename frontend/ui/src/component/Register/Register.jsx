import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    email: "",
    farmName: "",
    area: "",
    startDate: "",
    typeOfRice: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  useEffect(() => {
    const today = new Date();

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);

    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(today.getMonth() + 3);

    const formattedMinDate = threeMonthsAgo.toISOString().split('T')[0];
    const formattedMaxDate = threeMonthsLater.toISOString().split('T')[0];

    setMinDate(formattedMinDate);
    setMaxDate(formattedMaxDate);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validation for only letters in firstName and lastName
    if (name === "firstName" || name === "lastName") {
      const onlyLetters = /^[A-Za-z]*$/;
      if (!onlyLetters.test(value)) {
        return; // Ignore invalid character
      }
    }

    // Validation for area not being 0 or less
    if (name === "area") {
      if (value !== '' && Number(value) <= 0) {
        setErrorMessage("Cultivation Area must be greater than 0");
      } else {
        setErrorMessage('');
      }
    }

    // Validation for startDate within 3 months
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

  const validatePasswords = () => {
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    // Final cultivation area validation before submit
    if (Number(inputs.area) <= 0) {
      setErrorMessage("Cultivation Area must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formattedDate = new Date(inputs.startDate).toISOString();

      const response = await axios.post("http://localhost:3000/users", {
        firstName: inputs.firstName.trim(),
        lastName: inputs.lastName.trim(),
        email: inputs.email.toLowerCase().trim(),
        farmName: inputs.farmName.trim(),
        area: Number(inputs.area),
        startDate: formattedDate,
        typeOfRice: inputs.typeOfRice,
        password: inputs.password
      });

      if (response.data) {
        alert("Registration Successful!");
        navigate('/log', {
          state: {
            registrationSuccess: true,
            email: inputs.email
          }
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Registration failed");
      } else if (error.request) {
        setErrorMessage("Network error - could not connect to server");
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <h2>Farmer Registration</h2>
        <form onSubmit={handleSubmit} className="registration-form">

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

          {/* Password Fields */}
          <div className="input-group">
            <input
              type="password"
              id="password"
              name="password"
              placeholder=" "
              ref={passwordRef}
              value={inputs.password}
              onChange={handleChange}
              minLength="6"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <div className="input-group">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder=" "
              ref={confirmPasswordRef}
              minLength="6"
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="submit-btn4"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register Now'}
          </button>

          {/* Login Link */}
          <div className="login-link">
            Already have an account? <a href="/log">Login here</a>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Register;
