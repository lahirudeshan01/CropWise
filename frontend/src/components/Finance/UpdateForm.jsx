import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { updateTransaction } from "../../api/financeApi"; // Ensure this function is correctly implemented
import "./Finance.css";

const UpdateForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    status: "",
  });

  // Pre-fill the form with the transaction data passed via location.state
  useEffect(() => {
    if (location.state?.transaction) {
      setFormData({
        name: location.state.transaction.name,
        amount: location.state.transaction.amount,
        status: location.state.transaction.status,
      });
    }
  }, [location.state]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTransaction({
        id: location.state.transaction._id, // Include the transaction ID
        ...formData, // Include updated fields
      });
      navigate("/finance"); // Redirect to the Finance page after successful update
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="form-page-container">
      <div className="update-form-container">
        <h2>Update Transaction</h2>
        <form onSubmit={handleSubmit} className="update-form">
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
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Select status</option>
              <option value="Income">Income</option>
              <option value="Outcome">Outcome</option>
            </select>
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