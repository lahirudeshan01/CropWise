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
    
    // Special handling for amount field
    if (name === "amount") {
      // Check if the value has more than 2 decimal places
      const decimalRegex = /^\d+(\.\d{0,2})?$/;
      
      // If the value is empty or matches the decimal format (max 2 decimal places)
      if (value === "" || decimalRegex.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
      // Otherwise, don't update the state (invalid input)
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user types
    setErrors({ ...errors, [name]: "" });
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount)) {
      newErrors.amount = "Amount must be a number";
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be positive";
    } else if (formData.amount.includes(".") && formData.amount.split(".")[1].length > 2) {
      newErrors.amount = "Maximum 2 decimal places allowed";
    }

    // Status validation
    if (!formData.status) {
      newErrors.status = "Type is required";
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
        _id: location.state.transaction._id,
        ...formData,
        reference: location.state.transaction.reference,
        date: location.state.transaction.date,
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
              min="0.01"
              step="0.01"
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="status">Type</label>
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