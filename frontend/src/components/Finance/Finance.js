import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa"; // Three-dots icon
import { getTransactions, generateReport, deleteTransaction } from "../../api/financeApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"; // Import Recharts components
import "./Finance.css";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState({ totalIncome: 0, totalOutcome: 0, profit: 0 });
  const [showMenu, setShowMenu] = useState(null); // Track which row's menu is open
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // Track delete confirmation
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch transactions and report data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactions = await getTransactions();
        const report = await generateReport();
        setTransactions(transactions);
        setReport(report);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle new transaction from form pages
  useEffect(() => {
    if (location.state?.newTransaction) {
      setTransactions([...transactions, location.state.newTransaction]);
    }
  }, [location.state]);

  // Handle Export PDF Button Click
  const handleExportPDF = () => {
    navigate("/finance-report", { state: { transactions, report } });
  };

  // Handle Income Button Click
  const handleIncome = () => {
    navigate("/income-form");
  };

  // Handle Outcome Button Click
  const handleOutcome = () => {
    navigate("/outcome-form");
  };

  // Handle Three-Dots Menu Click
  const handleMenuClick = (index, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowMenu(showMenu === index ? null : index); // Toggle menu
  };

  // Close the menu when clicking outside
  const handleClickOutside = () => {
    setShowMenu(null);
  };

  // Handle Update Transaction
  const handleUpdate = (index) => {
    const transaction = transactions[index];
    navigate("/update-form", { state: { transaction } }); // Redirect to UpdateForm with transaction data
  };

  // Open Delete Confirmation Modal
  const confirmDelete = (index) => {
    setDeleteConfirmation(index);
  };

  // Handle Delete Transaction
  const handleDelete = async () => {
    const transaction = transactions[deleteConfirmation];
    try {
      await deleteTransaction(transaction._id); // Delete the transaction

      // Re-fetch transactions and report
      const updatedTransactions = await getTransactions();
      const updatedReport = await generateReport();

      // Update the state
      setTransactions(updatedTransactions);
      setReport(updatedReport);

      setDeleteConfirmation(null); // Close modal
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Handle Cancel Action
  const handleCancel = () => {
    setDeleteConfirmation(null); // Close modal
  };

  // Prepare data for the line chart
  const prepareLineChartData = () => {
    const dataMap = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toISOString().split("T")[0]; // Extract date (YYYY-MM-DD)
      if (!dataMap[date]) {
        dataMap[date] = { date, income: 0, outcome: 0 };
      }
      if (transaction.status === "Income") {
        dataMap[date].income += transaction.amount;
      } else if (transaction.status === "Outcome") {
        dataMap[date].outcome += transaction.amount;
      }
    });

    return Object.values(dataMap);
  };

  const lineChartData = prepareLineChartData();

  return (
    <div className="finance-dashboard" onClick={handleClickOutside}>
      {/* Buttons Section at the Top */}
      <div className="buttons-section">
        <button className="button export-pdf" onClick={handleExportPDF}>
          Export PDF
        </button>
        <button className="button income" onClick={handleIncome}>
          Income
        </button>
        <button className="button outcome" onClick={handleOutcome}>
          Outcome
        </button>
      </div>

      {/* Title Below Buttons */}
      <h1>Financial Transactions</h1>

      {/* Metrics Section */}
      <div className="metrics">
        <div className="metric">
          <h3>Total Income</h3>
          <p>Rs.{report.totalIncome.toLocaleString()}</p>
        </div>
        <div className="metric">
          <h3>Total Outcome</h3>
          <p>Rs.{report.totalOutcome.toLocaleString()}</p>
        </div>
        <div className="metric">
          <h3>Profit</h3>
          <p>Rs.{report.profit.toLocaleString()}</p>
        </div>
      </div>

      {/* Income vs. Outcome Analysis Line Chart */}
      <div className="chart-container">
        <h3>Income vs. Outcome Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#28a745" name="Income" />
            <Line type="monotone" dataKey="outcome" stroke="#dc3545" name="Outcome" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Transactions Table */}
      <table>
        <thead>
          <tr>
            <th>NAME</th>
            <th>DATE & TIME</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th>REFERENCE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.name}</td>
              <td>{new Date(transaction.date).toLocaleString()}</td>
              <td>Rs.{transaction.amount}</td>
              <td data-status={transaction.status}>{transaction.status}</td>
              <td>{transaction.reference}</td>
              <td>
                <div className="actions-container">
                  {/* Three-dots icon */}
                  <button className="three-dots-button" onClick={(e) => handleMenuClick(index, e)}>
                    <FaEllipsisV />
                  </button>
                  {/* Dropdown menu */}
                  {showMenu === index && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleUpdate(index)}>Update</button>
                      <button onClick={() => confirmDelete(index)}>Delete</button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation !== null && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this transaction?</h3>
            <button className="button delete" onClick={handleDelete}>
              Delete
            </button>
            <button className="button cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;