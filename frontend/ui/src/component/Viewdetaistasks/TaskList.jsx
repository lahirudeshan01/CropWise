import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./TaskList.css";

const TaskList = ({ tasks }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const printRef = useRef();

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

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Task Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status-badge { 
              padding: 3px 6px; 
              border-radius: 3px; 
              color: white; 
              display: inline-block;
            }
            .total-row { font-weight: bold; }
            .print-header { text-align: center; margin-bottom: 20px; }
            .print-footer { text-align: right; margin-top: 20px; font-style: italic; }
            .print-date { text-align: right; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <h2>Task Management Report</h2>
          </div>
          <div class="print-date">
            Generated on: ${new Date().toLocaleDateString()}
          </div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTasks.map(task => `
                <tr>
                  <td>${task.title || "N/A"}</td>
                  <td>${task.category || "N/A"}</td>
                  <td>${task.employeeID || "N/A"}</td>
                  <td>${new Date(task.date).toLocaleDateString() || "N/A"}</td>
                  <td>${parseFloat(task.payment).toFixed(2) || "0.00"}</td>
                  <td>
                    <span class="status-badge ${task.status ? task.status.toLowerCase().replace(' ', '-') : 'unknown'}">
                      ${task.status || "Unknown"}
                    </span>
                  </td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4">Total</td>
                <td>Rs.${totalPayment.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          <div class="print-footer">
            End of Report
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!tasks || tasks.length === 0) {
    return <div className="no-tasks">No tasks found!</div>;
  }

  return (
    <div ref={printRef}>
      <div className="filters no-print">
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

        <button onClick={handlePrint} className="print-btn">
          Print Report
        </button>
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
                <th className="no-print">Actions</th>
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
                        task.status ? task.status.toLowerCase().replace(' ', '-') : "unknown"
                      }`}
                    >
                      {task.status || "Unknown"}
                    </span>
                  </td>
                  <td className="no-print">
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






















