import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logTransaction } from "../../api/financeApi"; // Import the API function
import "./Finance.css"; // Ensure this line is present

const IncomeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    reference: "Other", // Always set to "Other"
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
      // Send the transaction data to the backend
      await logTransaction(newTransaction);
      navigate("/finance"); // Redirect to the transaction table page
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div>
      {/* Back Button (Outside the Form Container) */}
      <button className="back-button1" onClick={handleGoBack}>
        Back
      </button>

      {/* Form Container */}
      <div className="form-container">
        <h2>Add Income</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default IncomeForm;