import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logTransaction } from "../../api/financeApi"; // Import the API function
import './Finance.css';

const IncomeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    reference: "",
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
      navigate("/finance"); // Redirect to the finance page after successful submission
    } catch (error) {
      console.error("Error submitting transaction:", error);
    }
  };

  return (
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
        <input
          type="text"
          name="reference"
          placeholder="Reference"
          value={formData.reference}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default IncomeForm;