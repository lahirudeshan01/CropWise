
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ShowDetails.css";

function ShowDetails() {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();


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
          navigate("/detali"); // Redirect to task list page
        })
        .catch(() => {
          setError("Failed to delete task. Please try again later.");
        });
    }
  };

  if (loading) return <div className="loading">Loading task details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!task) return <div className="no-data">No task data found for this ID.</div>;

  return (
    <div className="task-details-container">
      <div className="task-card">
        
        <h1 className="title">Task Details</h1>
        {/* Task Details Table */}
        <table className="task-details-table">
          
          <tbody>
            <tr>
              <th>Title</th>
              <td>{task.title || "N/A"}</td>
            </tr>
            <tr>
              <th>Category</th>
              <td>{task.category || "N/A"}</td>
            </tr>
            <tr>
              <th>Employee ID</th>
              <td>{task.employeeID || "N/A"}</td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{new Date(task.date).toLocaleDateString() || "N/A"}</td>
            </tr>
            <tr>
              <th>Payment</th>
              <td>{task.payment || "N/A"}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{task.status || "N/A"}</td>
            </tr>
          </tbody>
        </table>
        <div className="button-container">
          
          <Link to={`/update-employee/${task._id}`} className="edit-button">
            Update Employee
          </Link>
          <button onClick={handleDelete} className="delete-button">
            Remove Employee
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowDetails;
