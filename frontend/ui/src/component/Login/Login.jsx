import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import api from '../../api/apiUtils';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage('Registration successful! Please login with your credentials.');
      if (location.state.email) {
        setInputs(prev => ({ ...prev, email: location.state.email }));
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await api.post('/users/login', {
        email: inputs.email,
        password: inputs.password
      });

      if (response.data && response.data.user) {
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-wrapper">
        <div className="login-container">
          <h2 className="login-heading">Login to Your Account</h2>
          
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <input
                type="email"
                id="email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
                required
                className="login-input"
                placeholder=" "
              />
              <label htmlFor="email" className="input-label">
                Email Address
              </label>
            </div>

            <div className="input-group">
              <input
                type="password"
                id="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
                minLength="6"
                required
                className="login-input"
                placeholder=" "
              />
              <label htmlFor="password" className="input-label">
                Password
              </label>
            </div>

            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'disabled' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            
            <p className="signup-link">
              Don't have an account? <a href="/register" className="signup-link-anchor">Register here</a>
            </p>
          </form>
        </div>
        
        <div className="image-container">
          <h3 className="welcome-text">Welcome Back!</h3>
          <p className="welcome-subtitle">Access your farm management dashboard</p>
        </div>
      </div>
    </div>
  );
}

export default Login;