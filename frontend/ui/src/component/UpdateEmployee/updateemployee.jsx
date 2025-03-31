import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./updateemployee.css";

function UpdateEmployee() {
  const { id } = useParams(); // Get task ID from URL
  const [employeeID, setEmployeeID] = useState("");
  const [status, setStatus] = useState(""); // New state for Status
  const navigate = useNavigate();
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/tasks/${id}`, { employeeID, status });
      alert("Employee ID and Status updated successfully!");
      navigate(`/detali`); // Redirect to the details page
    } catch (error) {
      console.error("Error updating Employee ID and Status:", error);
      alert("Failed to update Employee ID and Status.");
    }
  };

  return (
    <div className="update-container">
      <h2>Update Employee</h2>
      <form onSubmit={handleUpdate}>
        <label>Employee ID:</label>
        <input
          type="text"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          required
        />

        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} required>
          <option value="">Select Status</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </select>

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateEmployee;
