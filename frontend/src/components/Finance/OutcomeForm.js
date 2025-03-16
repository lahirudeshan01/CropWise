import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logTransaction } from "../../api/financeApi"; // Import the API function
import "./Finance.css";

const OutcomeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    reference: "Other", // Set default value for reference
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
      status: "Outcome",
      isUserAdded: true, // Add this flag
    };
  
    try {
      await logTransaction(newTransaction);
      navigate("/finance", { state: { newTransaction } }); // Pass the new transaction to the Finance page
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
      <div className="form-container">
        <h2>Add Outcome</h2>
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

export default OutcomeForm;