import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateTransaction } from "../../api/financeApi";
import "./Finance.css";

const UpdateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");

  // Pre-fill form with transaction data
  useEffect(() => {
    if (location.state?.transaction) {
      setFormData({
        name: location.state.transaction.name,
        amount: location.state.transaction.amount,
        status: location.state.transaction.status,
      });
    }
  }, [location.state]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user types
    setErrors({ ...errors, [name]: "" });
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop submission if validation fails

    try {
      await updateTransaction({
        id: location.state.transaction._id,
        ...formData,
      });
      navigate("/finance");
    } catch (error) {
      console.error("Error updating transaction:", error);
      setApiError("Failed to update transaction. Please try again.");
    }
  };

  // Go back to the previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="form-page-container">
      <div className="update-form-container">
        <h2>Update Transaction</h2>
        {apiError && <p className="error-message">{apiError}</p>}
        <form onSubmit={handleSubmit} className="update-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleInputChange}
              
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleInputChange}
              
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
         
            >
              <option value="" disabled>Select status</option>
              <option value="Income">Income</option>
              <option value="Outcome">Outcome</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>
          <div className="form-buttons">
            <button type="button" className="back-button1" onClick={handleGoBack}>
              Back
            </button>
            <button type="submit" className="update-button">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateForm;
