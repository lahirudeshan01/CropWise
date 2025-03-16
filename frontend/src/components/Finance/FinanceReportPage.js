import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Finance.css";

document.title = "Financial Report";

const FinanceReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Access the data passed via the `state` prop
  const { transactions, report } = location.state || {
    transactions: [],
    report: {},
  };

  // Function to handle going back to the Finance page
  const handleGoBack = () => {
    navigate("/finance");
  };

  const printReport = () => {
    window.print();
  };

  // Get the current date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = currentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="finance-dashboard">
      {/* Title and Buttons Section */}
      <div className="buttons-section report-buttons no-print">
        <button className="button back-button" onClick={handleGoBack}>
          Back
        </button>
        <button className="button export-pdf" onClick={printReport}>
          Export PDF
        </button>
      </div>

      {/* Metrics Section */}
      <div className="report-page">
        <div>
          <h1>Financial Report</h1>

          {/* Display Date and Time Below the Title and Above the Table */}
          <div className="date-time">
            <p>Date - {formattedDate}</p>
            <p>Time - {formattedTime}</p>
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
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.name}</td>
                  <td>{new Date(transaction.date).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}</td>
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