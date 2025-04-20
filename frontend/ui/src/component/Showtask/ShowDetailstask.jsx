import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ShowDetailstask() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Define all styles as JavaScript objects
  const styles = {
    taskDetailsContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f4f4f4",
    },
    taskCard: {
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      width: "50%",
    },
    title: {
      textAlign: "center",
      fontSize: "24px",
      marginBottom: "20px",
    },
    taskDetailsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "20px",
    },
    tableHeader: {
      border: "1px solid #ddd",
      padding: "10px",
      textAlign: "left",
      backgroundColor: "#f2f2f2",
    },
    tableCell: {
      border: "1px solid #ddd",
      padding: "10px",
      textAlign: "left",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
    },
    editButton: {
      padding: "10px 15px",
      textDecoration: "none",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: "#ff8c00", // Orange
      color: "white",
    },
    editButtonHover: {
      backgroundColor: "#e07b00", // Darker Orange on Hover
    },
    deleteButton: {
      padding: "10px 15px",
      textDecoration: "none",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: "#dc3545",
      color: "white",
    },
    deleteButtonHover: {
      backgroundColor: "#c82333",
    },
    loading: {
      textAlign: "center",
      padding: "20px",
      fontSize: "18px",
    },
    errorMessage: {
      color: "#dc3545",
      textAlign: "center",
      padding: "20px",
      fontSize: "18px",
    },
    noData: {
      textAlign: "center",
      padding: "20px",
      fontSize: "18px",
      color: "#6c757d",
    },
  };

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/api/tasks/${id}`)
        .then((res) => {
          setTask(res.data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load task details. Please try again later.");
          setLoading(false);
        });
    } else {
      setError("Task ID is missing or invalid");
      setLoading(false);
    }
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      axios
        .delete(`http://localhost:3000/api/tasks/${id}`)
        .then(() => {
          navigate("/showtask"); // Redirect to task list page
        })
        .catch(() => {
          setError("Failed to delete task. Please try again later.");
        });
    }
  };

  // States for button hover effects
  const [isEditHovered, setIsEditHovered] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);

  if (loading) return <div style={styles.loading}>Loading task details...</div>;
  if (error) return <div style={styles.errorMessage}>{error}</div>;
  if (!task) return <div style={styles.noData}>No task data found for this ID.</div>;

  return (
    <div style={styles.taskDetailsContainer}>
      <div style={styles.taskCard}>
        <h1 style={styles.title}>Task Details</h1>
        {/* Task Details Table */}
        <table style={styles.taskDetailsTable}>
          <tbody>
            <tr>
              <th style={styles.tableHeader}>Title</th>
              <td style={styles.tableCell}>{task.title || "N/A"}</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>Category</th>
              <td style={styles.tableCell}>{task.category || "N/A"}</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>Employee ID</th>
              <td style={styles.tableCell}>{task.employeeID || "N/A"}</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>Date</th>
              <td style={styles.tableCell}>{new Date(task.date).toLocaleDateString() || "N/A"}</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>Payment</th>
              <td style={styles.tableCell}>{task.payment || "N/A"}</td>
            </tr>
            <tr>
              <th style={styles.tableHeader}>Status</th>
              <td style={styles.tableCell}>{task.status || "N/A"}</td>
            </tr>
          </tbody>
        </table>
        <div style={styles.buttonContainer}>
          <Link 
            to={`/update-employee/${task._id}`} 
            style={{
              ...styles.editButton,
              ...(isEditHovered ? styles.editButtonHover : {})
            }}
            onMouseEnter={() => setIsEditHovered(true)}
            onMouseLeave={() => setIsEditHovered(false)}
          >
            Update Employee
          </Link>
          <button 
            onClick={handleDelete} 
            style={{
              ...styles.deleteButton,
              ...(isDeleteHovered ? styles.deleteButtonHover : {})
            }}
            onMouseEnter={() => setIsDeleteHovered(true)}
            onMouseLeave={() => setIsDeleteHovered(false)}
          >
            Remove Employee
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowDetailstask;