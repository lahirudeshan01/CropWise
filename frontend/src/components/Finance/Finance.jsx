import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa"; // Three-dots icon
import { getTransactions, generateReport, deleteTransaction } from "../../api/financeApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"; // Import Recharts components
import "./Finance.css";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState({ totalIncome: 0, totalOutcome: 0, profit: 0 });
  const [showMenu, setShowMenu] = useState(null); // Track which row's menu is open
  const [deleteConfirmation, setDeleteConfirmation] = useState(null); // Track delete confirmation
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    reference: "",
    minAmount: "",
    maxAmount: "",
  });
  const [applyFiltersTrigger, setApplyFiltersTrigger] = useState(false); // State to trigger filter application
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [error, setError] = useState(null); // Error state for data fetching issues

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch transactions and report data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Create a clean filter object without empty values
        const cleanFilters = {};
        Object.keys(filters).forEach(key => {
          if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
            cleanFilters[key] = filters[key];
          }
        });

        console.log("Fetching transactions with filters:", cleanFilters);
        const transactions = await getTransactions(cleanFilters);

        // Calculate total income, outcome, and profit based on filtered transactions
        const totalIncome = transactions
          .filter(t => t.status === "Income")
          .reduce((sum, t) => sum + t.amount, 0);

        const totalOutcome = transactions
          .filter(t => t.status === "Outcome")
          .reduce((sum, t) => sum + t.amount, 0);

        const profit = totalIncome - totalOutcome;

        setTransactions(transactions);
        setReport({ totalIncome, totalOutcome, profit });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, applyFiltersTrigger]); // Re-fetch when filters or applyFiltersTrigger changes

  // Handle new transaction from form pages
  useEffect(() => {
    if (location.state?.newTransaction) {
      setTransactions((prevTransactions) => [...prevTransactions, location.state.newTransaction]);
      // Clear the location state to prevent duplicate additions
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setFilters({ ...filters }); // Force a state update
    setApplyFiltersTrigger((prev) => !prev); // Toggle the trigger
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      type: "",
      reference: "",
      minAmount: "",
      maxAmount: "",
    });
    // Also trigger a re-fetch with empty filters
    setApplyFiltersTrigger(prev => !prev);
  };

  // Handle click outside the dropdown menu
  const handleClickOutside = () => {
    setShowMenu(null);
  };

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
    if (deleteConfirmation === null) return;

    const transaction = transactions[deleteConfirmation];
    try {
      await deleteTransaction(transaction._id); // Make sure to use _id not id

      // Re-fetch transactions and report with current filters
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
          cleanFilters[key] = filters[key];
        }
      });

      const updatedTransactions = await getTransactions(cleanFilters);

      // Recalculate total income, outcome, and profit
      const totalIncome = updatedTransactions
        .filter(t => t.status === "Income")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalOutcome = updatedTransactions
        .filter(t => t.status === "Outcome")
        .reduce((sum, t) => sum + t.amount, 0);

      const profit = totalIncome - totalOutcome;

      setTransactions(updatedTransactions);
      setReport({ totalIncome, totalOutcome, profit });
      setDeleteConfirmation(null); // Close modal
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError("Failed to delete transaction. Please try again.");
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

    // Convert to array and sort by date
    return Object.values(dataMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const lineChartData = prepareLineChartData();

  // Prepare data for the pie chart
  const pieChartData = [
    { name: "Income", value: report.totalIncome },
    { name: "Outcome", value: report.totalOutcome },
  ];

  // Colors for the pie chart
  const COLORS = ["#008000", "#dc3545"];

  return (
    <div className="finance-dashboard" onClick={handleClickOutside}>
      {/* Buttons Section at the Top */}
      <div className="buttons-section">
        <button className="button export-pdf" onClick={handleExportPDF}>
          Generate Report
        </button>
        <button className="button income" onClick={handleIncome}>
          Income
        </button>
        <button className="button outcome" onClick={handleOutcome}>
          Outcome
        </button>
      </div>

      {/* Title Below Buttons */}
      <h1 className="heading">Financial Overview</h1>

      {/* Metrics Section */}
      <div className="metrics">
        <div className="metric">
          <h3>Total Income</h3>
          <p className="income1">Rs.{report.totalIncome.toLocaleString()}</p>
        </div>
        <div className="metric">
          <h3>Total Outcome</h3>
          <p className="outcome1">Rs.{report.totalOutcome.toLocaleString()}</p>
        </div>
        <div className="metric">
          <h3>Profit</h3>
          <p className="profit">Rs.{report.profit.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h3>Filter Transactions</h3>
        <div className="filters">
          {/* Date Range Filter */}
          <div className="date-range-filter">
            <label>Date Range</label>
            <div className="date-inputs">
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                placeholder="Start Date"
                max={filters.endDate || undefined} // Ensure start date is not after end date
              />
              <span>to</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                placeholder="End Date"
                min={filters.startDate || undefined} // Ensure end date is not before start date
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="type-filter">
            <label>Type</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="Income">Income</option>
              <option value="Outcome">Outcome</option>
            </select>
          </div>

          {/* Reference Filter */}
          <div className="reference-filter">
            <label>Reference</label>
            <select name="reference" value={filters.reference} onChange={handleFilterChange}>
              <option value="">All References</option>
              <option value="Inventory Expense">Inventory Expense</option>
              <option value="Salary Payment">Salary Payment</option>
              <option value="Sales Income">Sales Income</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Amount Range Filter */}
          <div className="amount-range-filter">
            <label>Amount Range</label>
            <div className="amount-inputs">
              <input
                type="number"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                placeholder="Min Amount"
              />
              <span>to</span>
              <input
                type="number"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                placeholder="Max Amount"
              />
            </div>
          </div>

          {/* Apply and Reset Buttons */}
          <div className="filter-buttons">
            
            <button className="button reset" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-container">
        {/* Line Chart */}
        <div className="chart-container line-chart">
          <h3>Income vs. Outcome Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#008000" name="Income" />
              <Line type="monotone" dataKey="outcome" stroke="#dc3545" name="Outcome" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="chart-container pie-chart">
          <h3>Income and Outcome Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <div className="loading">Loading transactions...</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Transactions Table */}
      <table>
        <thead>
          <tr>
            <th>TRANSACTION NAME</th>
            <th>DATE & TIME</th>
            <th>AMOUNT</th>
            <th>TYPE</th>
            <th>REFERENCE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 && !loading ? (
            <tr>
              <td colSpan="6" className="no-data">No transactions found</td>
            </tr>
          ) : (
            transactions.map((transaction, index) => (
              <tr key={transaction._id || index}>
                <td>{transaction.name}</td>
                <td>{new Date(transaction.date).toLocaleString()}</td>
                <td>Rs.{transaction.amount.toLocaleString()}</td>
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
            ))
          )}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {deleteConfirmation !== null && (
        <div className="modal">
          <div className="modal-content">
            <h3>Are you sure you want to delete this transaction?</h3>
            <div className="modal-buttons">
              <button className="button delete" onClick={handleDelete}>
                Delete
              </button>
              <button className="button cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;