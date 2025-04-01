import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./TaskList.css";

const TaskList = ({ tasks }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const uniqueCategories = [...new Set(tasks.map(task => task.category))];
  const uniqueStatuses = [...new Set(tasks.map(task => task.status))];

  const filteredTasks = tasks.filter(task => {
    return (
      (task.title.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === "") &&
      (task.category === categoryFilter || categoryFilter === "") &&
      (task.status === statusFilter || statusFilter === "")
    );
  });

  const totalPayment = filteredTasks.reduce((acc, task) => acc + (parseFloat(task.payment) || 0), 0);

  if (!tasks || tasks.length === 0) {
    return <div className="no-tasks">No tasks found!</div>;
  }

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          onChange={(e) => setCategoryFilter(e.target.value)}
          value={categoryFilter}
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          value={statusFilter}
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="no-task">No Tasks Found!</div>
      ) : (
        <div className="table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.title || "N/A"}</td>
                  <td>{task.category || "N/A"}</td>
                  <td>{task.employeeID || "N/A"}</td>
                  <td>{new Date(task.date).toLocaleDateString() || "N/A"}</td>
                  <td>{parseFloat(task.payment).toFixed(2) || "0.00"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        task.status ? task.status.toLowerCase() : "unknown"
                      }`}
                    >
                      {task.status || "Unknown"}
                    </span>
                  </td>
                  <td>
                    {task._id ? (
                      <Link
                        to={`/Showtask/${task._id}`}
                        className="view-details-btn"
                      >
                        View Details
                      </Link>
                    ) : (
                      <span>No ID available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-payment">
            Total Payment: Rs.{totalPayment.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;












