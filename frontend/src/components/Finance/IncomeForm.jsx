import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logTransaction } from "../../api/financeApi";
import "./Finance.css";

const IncomeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    reference: "Other",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTransaction = {
      ...formData,
      date: new Date().toISOString(),
      status: "Income",
    };

    try {
      await logTransaction(newTransaction);
      navigate("/finance");
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
        <h2>Add Income</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
            />
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

export default IncomeForm;