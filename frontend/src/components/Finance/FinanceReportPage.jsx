import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Finance.css";

const FinanceReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [dailyReport, setDailyReport] = useState(null);

  const { transactions, report } = location.state || {
    transactions: [],
    report: {},
  };

  const handleGoBack = () => {
    navigate("/finance");
  };

  const printReport = () => {
    window.print();
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const generateMonthlyReport = async () => {
    if (!selectedMonth) {
      alert("Please select a month.");
      return;
    }

    const [year, month] = selectedMonth.split("-");
    try {
      const response = await axios.get(`http://localhost:5002/api/monthly-report`, {
        params: { month, year },
      });
      setMonthlyReport(response.data);
      setDailyReport(null); // Clear daily report when generating monthly
    } catch (error) {
      console.error("Error generating monthly report:", error);
    }
  };

  const generateDailyReport = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5002/api/daily-report`, {
        params: { date: selectedDate },
      });
      setDailyReport(response.data);
      setMonthlyReport(null); // Clear monthly report when generating daily
    } catch (error) {
      console.error("Error generating daily report:", error);
    }
  };

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
      <div className="buttons-section report-buttons no-print">
        <button className="button back-button" onClick={handleGoBack}>
          Back
        </button>
        <button className="button export-pdf" onClick={printReport}>
          Export PDF
        </button>
      </div>

      <div className="report-page">
        <div>
          <h1>Financial Report</h1>

          {/* Month Selection */}
          <div className="report-selection no-print">
            <label htmlFor="monthSelect">Select Month:</label>
            <input
              type="month"
              id="monthSelect"
              value={selectedMonth}
              onChange={handleMonthChange}
            />
            <button className="generate-report-btn monthly" onClick={generateMonthlyReport}>
              Generate Monthly Report
            </button>
          </div>

          {/* Date Selection for Daily Report */}
          <div className="report-selection no-print">
            <label htmlFor="dateSelect">Select Date:</label>
            <input
              type="date"
              id="dateSelect"
              value={selectedDate}
              onChange={handleDateChange}
            />
            <button className="generate-report-btn daily" onClick={generateDailyReport}>
              Generate Daily Report
            </button>
          </div>

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
              {(monthlyReport ? monthlyReport.transactions : dailyReport ? dailyReport.transactions : transactions).map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.name}</td>
                  <td>
                    {new Date(transaction.date).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td>Rs.{transaction.amount.toLocaleString()}</td>
                  <td data-status={transaction.status}>{transaction.status}</td>
                  <td>{transaction.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Metrics Section */}
          <div className="metrics">
            <div className="metric">
              <h3>Total Income</h3>
              <p>Rs.{(monthlyReport ? monthlyReport.totalIncome : dailyReport ? dailyReport.totalIncome : report.totalIncome)?.toLocaleString()}</p>
            </div>
            <div className="metric">
              <h3>Total Outcome</h3>
              <p>Rs.{(monthlyReport ? monthlyReport.totalOutcome : dailyReport ? dailyReport.totalOutcome : report.totalOutcome)?.toLocaleString()}</p>
            </div>
            <div className="metric">
              <h3>Profit</h3>
              <p>Rs.{(monthlyReport ? monthlyReport.profit : dailyReport ? dailyReport.profit : report.profit)?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceReportPage;
