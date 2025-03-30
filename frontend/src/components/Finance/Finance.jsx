import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEllipsisV } from "react-icons/fa";
import { getTransactions, generateReport, deleteTransaction } from "../../api/financeApi";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./Finance.css";

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState({ totalIncome: 0, totalOutcome: 0, profit: 0 });
  const [showMenu, setShowMenu] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    type: "",
    reference: "",
    minAmount: "",
    maxAmount: "",
  });
  const [applyFiltersTrigger, setApplyFiltersTrigger] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState("");
  const [minTransactionDate, setMinTransactionDate] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // Get current date in YYYY-MM-DD format
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split('T')[0];

  // Fetch transactions and report data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const cleanFilters = {};
        Object.keys(filters).forEach(key => {
          if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
            cleanFilters[key] = filters[key];
          }
        });

        const transactions = await getTransactions(cleanFilters);

        // Find the earliest transaction date
        if (transactions.length > 0) {
          const dates = transactions.map(t => new Date(t.date));
          const minDate = new Date(Math.min(...dates)).toISOString().split('T')[0];
          setMinTransactionDate(minDate);
        }

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
  }, [filters, applyFiltersTrigger]);

  // Handle new transaction from form pages
  useEffect(() => {
    if (location.state?.newTransaction) {
      setTransactions((prevTransactions) => [...prevTransactions, location.state.newTransaction]);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // For date fields, validate they're within valid range
    if (name === "startDate" || name === "endDate") {
      // Check if date is in the future
      if (value > currentDateString) {
        setDateError(`Cannot select future dates. Today is ${currentDateString}`);
        return;
      }
      
      // Check if date is before first transaction
      if (minTransactionDate && value < minTransactionDate) {
        setDateError(`No transactions available before ${minTransactionDate}`);
        return;
      }
      
      setDateError("");
    }
    
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
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
    setDateError("");
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

  const generateAiReport = () => {
    const csvData = generateCSV(transactions);
    sendRequest(csvData);
  };

  function sendRequest(data) {
    const ai_pdf_button = document.getElementById("ai-pdf-button");
    ai_pdf_button.setAttribute("disabled", "true");
    ai_pdf_button.innerHTML = "Generating...";

    const prompt = `Create a financial report. Follow these rules. 1.Put the topic 'Financial Report' on the head of document. 2.Use bullet lists, paragraphs, headings and sub-headings. 3.Need 1 page report. 4.Use simple grammar. 5.Use html formatting for create the report(pharagraphs, headings and sub-headings). 6.Use below financial transactions for create the report. 7.Don't calculate income, outcome and profit. Those data mentioned below. Document format 1.Introduction 2.Financial Profits and losses 3.How to increase profit. 4.How to recover financial loss (Budget Plan) 5.SummaryInstructions 1.Use some transaction data in report content when explaining how to increase profit and how to recover loss. 2.In response don't give any other sentences which are not relevant to the report(examples:-This is your repot, need other help) 3.In response give only report content. 4.Give paragraph for each topic in document format with 70 words for each paragraph (Need 5 paragraphs for 5 topics also create paragraph for Financial Profits and losses).|` + 
      `|| Total Income=Rs.${report.totalIncome} ||| Total Outcome=Rs.${report.totalOutcome}  ||| Profit=Rs.${report.profit} |||` +
      data;

    const requestBody = {
      "contents": [{
        "parts":[{"text": prompt}]
      }]
    };

    fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCyJK4KvR31gC1a3jUU9p3BrIIIDexOPrY', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    .then(response => response.json())
    .then(data => {
      const content = data.candidates[0].content.parts[0].text;
      const contentStyles = `
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f9;
          }
          h1, h2 {
            color: #333;
            margin-bottom: 10px;
          }
          h1 {
            font-size: 32px;
            text-align: center;
          }
          h2 {
            font-size: 24px;
            margin-top: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          th, td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #4CAF50;
            color: white;
            font-weight: bold;
          }
          td {
            background-color: #f9f9f9;
          }
          tr:hover td {
            background-color: #f1f1f1;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
          }
          .button.back-button {
            background-color: #dc3545;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin-right: 10px;
            transition: background-color 0.3s ease;
          }
          .button.back-button:hover {
            background-color: #c82333;
          }
          .btn-print {
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
            margin-left: 50px;
          }
          .btn-print:hover {
            background-color: #0056b3;
          }
          .accesbility-controls {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
          }
          @media (max-width: 768px) {
            table, th, td {
              font-size: 14px;
            }
            th, td {
              padding: 10px 12px;
            }
          }
          @media print {
            .no-print, .no-print * {
              display: none !important;
            }
            .metrics {
              display: flex !important;
              flex-direction: row !important;
            }
          }
        </style>
      `;
      
      const accesbilityControls = ` 
        <button class="button back-button" onclick="window.close()">
          Back
        </button>
        <button onclick="window.print()" class="btn-print">Print</button><hr>
      </div>`;

      const reportContent = accesbilityControls + contentStyles + content.replace("```html", "").replace("```", "").replace("Losses", `
        Losses<table>
          <tbody><tr>
            <th>Total Income</th>
            <th>Total Outcome</th>
            <th>Total Profit</th>
          </tr>
          <tr>
            <td>Rs. ${report.totalIncome}</td>
            <td>Rs. ${report.totalOutcome}</td>
            <td>Rs. ${report.profit}</td>
          </tr>
        </tbody></table>`);

      let newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(reportContent);
        newWindow.document.close();
      } else {
        console.error('Failed to open the new window. It might be blocked by the browser.');
      }
      ai_pdf_button.removeAttribute("disabled");
      ai_pdf_button.innerHTML = "Generate AI Report";
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while sending the request.');
    });
  }

  // Generate CSV content
  const generateCSV = (transactions) => {
    const header = ["TRANSACTION NAME", "DATE & TIME", "AMOUNT", "TYPE", "REFERENCE"];
    const rows = transactions.map(transaction => [
      transaction.name,
      new Date(transaction.date).toLocaleString(),
      `Rs.${transaction.amount.toLocaleString()}`,
      transaction.status,
      transaction.reference,
    ]);
    return [header, ...rows].map(row => row.join(',')).join('|');
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
    e.stopPropagation();
    setShowMenu(showMenu === index ? null : index);
  };

  // Handle Update Transaction
  const handleUpdate = (index) => {
    const transaction = transactions[index];
    navigate("/update-form", { state: { transaction } });
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
      await deleteTransaction(transaction._id);

      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
          cleanFilters[key] = filters[key];
        }
      });

      const updatedTransactions = await getTransactions(cleanFilters);

      const totalIncome = updatedTransactions
        .filter(t => t.status === "Income")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalOutcome = updatedTransactions
        .filter(t => t.status === "Outcome")
        .reduce((sum, t) => sum + t.amount, 0);

      const profit = totalIncome - totalOutcome;

      setTransactions(updatedTransactions);
      setReport({ totalIncome, totalOutcome, profit });
      setDeleteConfirmation(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError("Failed to delete transaction. Please try again.");
    }
  };

  // Handle Cancel Action
  const handleCancel = () => {
    setDeleteConfirmation(null);
  };

  // Prepare data for the line chart
  const prepareLineChartData = () => {
    const dataMap = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date).toISOString().split("T")[0];
      if (!dataMap[date]) {
        dataMap[date] = { date, income: 0, outcome: 0 };
      }
      if (transaction.status === "Income") {
        dataMap[date].income += transaction.amount;
      } else if (transaction.status === "Outcome") {
        dataMap[date].outcome += transaction.amount;
      }
    });

    return Object.values(dataMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const lineChartData = prepareLineChartData();

  // Prepare data for the pie chart
  const pieChartData = [
    { name: "Income", value: report.totalIncome },
    { name: "Outcome", value: report.totalOutcome },
  ];

  const COLORS = ["#008000", "#dc3545"];

  return (
    <div className="finance-dashboard" onClick={handleClickOutside}>
      {/* Buttons Section at the Top */}
      <div className="buttons-section">
        <div className="button-group-left">
          <button className="button income" onClick={handleIncome}>
            Income
          </button>
          <button className="button outcome" onClick={handleOutcome}>
            Outcome
          </button>
          <button 
  className="button salary-management" 
  onClick={() => navigate('/salary-management')}
>
  Salaries
</button>
        </div>
        <div className="button-group-right">
         <button id="ai-pdf-button" className="button ai-pdf" onClick={generateAiReport}>  
            Generate AI Report
          </button>  
          <button className="button export-pdf" onClick={handleExportPDF}>
            Generate Report
          </button>
        </div>
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
        {dateError && <div className="error-message">{dateError}</div>}
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
                min={minTransactionDate}
                max={filters.endDate || currentDateString}
              />
              <span>to</span>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                placeholder="End Date"
                min={filters.startDate || minTransactionDate}
                max={currentDateString}
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
              <option value="Salary Deductions">Salary Deductions</option>
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
        </div>

        {/* Apply and Reset Buttons */}
        <div className="filter-buttons">
          <button className="button reset" onClick={resetFilters}>
            Reset Filters
          </button>
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
                    <button className="three-dots-button" onClick={(e) => handleMenuClick(index, e)}>
                      <FaEllipsisV />
                    </button>
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