import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTransaction } from "../../api/financeApi";
import "./Finance.css";

const OutcomeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    reference: "Other",
  });

  const [errors, setErrors] = useState({});

  const handleAmountChange = (e) => {
    const value = e.target.value;
    
    // Allow only numbers with up to 2 decimal places
    if (value === "" || value.match(/^\d*\.?\d{0,2}$/)) {
      setFormData({ ...formData, amount: value });
      setErrors({ ...errors, amount: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name !== "amount") {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount)) {
      newErrors.amount = "Amount must be a number";
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be positive";
    } else if (formData.amount.includes(".") && formData.amount.split(".")[1].length > 2) {
      newErrors.amount = "Maximum 2 decimal places allowed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newTransaction = {
      ...formData,
      amount: parseFloat(formData.amount).toFixed(2),
      date: new Date().toISOString(),
      status: "Outcome",
      isUserAdded: true,
    };

    try {
      await addTransaction(newTransaction);
      navigate("/finance", { state: { newTransaction } });
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="form-page-container">
      <div className="form-container">
        <h2>Add Outcome</h2>
        <form onSubmit={handleSubmit}>
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
              type="text"  // Changed to text to better handle decimal input
              name="amount"
              placeholder="Enter amount (e.g. 100.50)"
              value={formData.amount}
              onChange={handleAmountChange}
              onBlur={() => {
                // Format to 2 decimals when field loses focus
                if (formData.amount && !isNaN(formData.amount)) {
                  setFormData({
                    ...formData,
                    amount: parseFloat(formData.amount).toFixed(2),
                  });
                }
              }}
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>
          <div className="form-buttons">
            <button type="button" className="back-button1" onClick={handleGoBack}>
              Back
            </button>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OutcomeForm;