import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
// Removed the CSS import since we're using internal CSS now

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
      const response = await axios.post('http://localhost:3000/users/login', {
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

  // Styles
  const styles = {
    pageContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f4f8',
      padding: '20px',
    },
    loginWrapper: {
      display: 'flex',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 5px 25px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '900px',
      overflow: 'hidden',
    },
    loginContainer: {
      padding: '40px',
      width: '50%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    imageContainer: {
      width: '50%',
      background: '#27ae60',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    imageStyle: {
      maxWidth: '100%',
      height: 'auto',
    },
    welcomeText: {
      color: 'white',
      marginTop: '20px',
      fontSize: '24px',
      textAlign: 'center',
    },
    heading: {
      color: '#2c3e50',
      marginBottom: '30px',
      textAlign: 'center',
      fontSize: '28px',
    },
    loginForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    inputGroup: {
      position: 'relative',
    },
    inputLabel: {
      position: 'absolute',
      left: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#7f8c8d',
      pointerEvents: 'none',
      transition: '0.3s',
      background: 'white',
      padding: '0 5px',
    },
    input: {
      width: '100%',
      padding: '15px',
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'border-color 0.3s',
    },
    forgotPassword: {
      textAlign: 'right',
      marginTop: '-10px',
    },
    forgotPasswordLink: {
      color: '#27ae60',
      textDecoration: 'none',
      fontSize: '14px',
    },
    submitBtn: {
      background: '#27ae60',
      color: 'white',
      padding: '15px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background 0.3s',
      marginTop: '10px',
    },
    submitBtnDisabled: {
      backgroundColor: '#95a5a6',
      cursor: 'not-allowed',
    },
    signupLink: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '14px',
      color: '#7f8c8d',
    },
    signupLinkAnchor: {
      color: '#27ae60',
      textDecoration: 'none',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '10px',
      marginBottom: '20px',
      borderRadius: '4px',
      textAlign: 'center',
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px',
      textAlign: 'center',
    }
  };

  // Media query styles (applied conditionally)
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    styles.loginWrapper = {
      ...styles.loginWrapper,
      flexDirection: 'column',
      maxWidth: '500px',
    };
    styles.loginContainer = {
      ...styles.loginContainer,
      width: '100%',
      padding: '25px',
    };
    styles.imageContainer = {
      ...styles.imageContainer,
      width: '100%',
      padding: '30px 25px',
    };
    styles.heading.fontSize = '24px';
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginWrapper}>
        <div style={styles.loginContainer}>
          <h2 style={styles.heading}>Login to Your Account</h2>
          
          {successMessage && (
            <div style={styles.successMessage}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.loginForm}>
            <div style={styles.inputGroup}>
              <input
                type="email"
                id="email"
                name="email"
                value={inputs.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <label 
                htmlFor="email" 
                style={{
                  ...styles.inputLabel,
                  ...(inputs.email ? {
                    top: '0',
                    fontSize: '14px',
                    color: '#27ae60',
                  } : {})
                }}
              >
                Email Address
              </label>
            </div>

            <div style={styles.inputGroup}>
              <input
                type="password"
                id="password"
                name="password"
                value={inputs.password}
                onChange={handleChange}
                minLength="6"
                required
                style={styles.input}
              />
              <label 
                htmlFor="password" 
                style={{
                  ...styles.inputLabel,
                  ...(inputs.password ? {
                    top: '0',
                    fontSize: '14px',
                    color: '#27ae60',
                  } : {})
                }}
              >
                Password
              </label>
            </div>

            {errorMessage && (
              <div style={styles.errorMessage}>
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              style={{
                ...styles.submitBtn,
                ...(isSubmitting ? styles.submitBtnDisabled : {})
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            
            <p style={styles.signupLink}>
              Don't have an account? <a href="/register" style={styles.signupLinkAnchor}>Register here</a>
            </p>
          </form>
        </div>
        
        {/* Image section added to the right side */}
        <div style={styles.imageContainer}>
          {/* <img 
            src="https://www.wscubetech.com/blog/wp-content/uploads/2024/04/generative-ai.webp" 
            alt="Login illustration" 
            style={styles.imageStyle}
            // You can replace the src with your actual image path or use a placeholder
            // Example with placeholder: src="/api/placeholder/400/320"
          /> */}
          <h3 style={styles.welcomeText}>Welcome Back!</h3>
        </div>
      </div>
    </div>
  );
}

export default Login;