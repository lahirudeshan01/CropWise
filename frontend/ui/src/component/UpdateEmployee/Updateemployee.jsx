import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateEmployee() {
  const { id } = useParams(); // Get task ID from URL
  const [employeeID, setEmployeeID] = useState("");
  const [status, setStatus] = useState(""); // New state for Status
  const navigate = useNavigate();
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  // Define all styles as JavaScript objects
  const styles = {
    updateContainer: {
      maxWidth: "400px",
      margin: "50px auto",
      padding: "20px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    heading: {
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    label: {
      fontWeight: "bold",
      marginBottom: "5px",
    },
    input: {
      padding: "10px",
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "14px",
    },
    select: {
      padding: "10px",
      marginBottom: "15px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      fontSize: "14px",
    },
    button: {
      padding: "10px",
      backgroundColor: "#ff8c00",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
    },
    buttonHover: {
      backgroundColor: "#e07b00",
    },
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/tasks/${id}`, { employeeID, status });
      alert("Employee ID and Status updated successfully!");
      navigate(`/Showtask`); // Redirect to the details page
    } catch (error) {
      console.error("Error updating Employee ID and Status:", error);
      alert("Failed to update Employee ID and Status.");
    }
  };

  return (
    <div style={styles.updateContainer}>
      <h2 style={styles.heading}>Update Employee</h2>
      <form onSubmit={handleUpdate} style={styles.form}>
        <label style={styles.label}>Employee ID:</label>
        <input
          type="text"
          value={employeeID}
          onChange={(e) => setEmployeeID(e.target.value)}
          required
          style={styles.input}
        />

        <label style={styles.label}>Status:</label>
        <select 
          value={status} 
          onChange={(e) => setStatus(e.target.value)} 
          required
          style={styles.select}
        >
          <option value="">Select Status</option>
          <option value="In Progress">In Progress</option>
          <option value="Complete">Complete</option>
        </select>

        <button 
          type="submit" 
          style={{
            ...styles.button,
            ...(isButtonHovered ? styles.buttonHover : {})
          }}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          Update
        </button>
      </form>
    </div>
  );
}

export default UpdateEmployee;