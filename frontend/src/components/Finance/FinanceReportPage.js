import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import "./Finance.css";

document.title = "Financial Report";

const FinanceReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize the navigate function

  // Access the data passed via the `state` prop
  const { transactions, report } = location.state || {
    transactions: [],
    report: {},
  };

  // Function to handle going back to the Finance page
  const handleGoBack = () => {
    navigate("/finance"); // Replace '/finance' with the actual route of your Finance page
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="finance-dashboard">
      {/* Title and Buttons Section */}
      <div className="buttons-section report-buttons">
        <button className="button export-pdf no-print" onClick={printReport}>
          Export PDF
        </button>
        <button className="button back-button no-print" onClick={handleGoBack}>
          Back
        </button>
      </div>

      {/* Metrics Section */}
      <div className="report-page">
        <div>
      <h1>Financial Transactions</h1>

          {/* Transactions Table */}
          <table>
            <thead>
              <tr>
                <th>NAME</th>
                <th>DATE & TIME</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>REFERENCE</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.name}</td>
                  <td>{new Date(transaction.date).toLocaleString()}</td>
                  <td>Rs.{transaction.amount.toLocaleString()}</td>
                  <td data-status={transaction.status}>{transaction.status}</td>
                  <td>{transaction.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>

        <div className="metrics">
          <div className="metric">
            <h3>Total Income</h3>
            <p>Rs.{report.totalIncome?.toLocaleString()}</p>
          </div>
          <div className="metric">
            <h3>Total Outcome</h3>
            <p>Rs.{report.totalOutcome?.toLocaleString()}</p>
          </div>
          <div className="metric">
            <h3>Profit</h3>
            <p>Rs.{report.profit?.toLocaleString()}</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceReportPage;
