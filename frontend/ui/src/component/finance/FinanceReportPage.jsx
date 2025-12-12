import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/apiUtils";
import "./Finance.css";

const FinanceReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [dailyReport, setDailyReport] = useState(null);
  const [reportTitle, setReportTitle] = useState("");
  const [dateError, setDateError] = useState("");
  const [monthError, setMonthError] = useState("");
  const [minDate, setMinDate] = useState("");
  const [minMonth, setMinMonth] = useState("");

  const { transactions, report } = location.state || {
    transactions: [],
    report: {},
  };

  // Get current date in required formats
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
  const currentDay = String(currentDate.getDate()).padStart(2, '0');

  // Format for month input (YYYY-MM)
  const maxMonth = `${currentYear}-${currentMonth}`;
  // Format for date input (YYYY-MM-DD)
  const maxDate = `${currentYear}-${currentMonth}-${currentDay}`;

  // Calculate minimum date and month based on transactions
  useEffect(() => {
    if (transactions.length > 0) {
      // Find the earliest transaction date
      const dates = transactions.map(t => new Date(t.date));
      const minTransactionDate = new Date(Math.min(...dates));
      
      // Set minimum date (YYYY-MM-DD)
      const minDateStr = minTransactionDate.toISOString().split('T')[0];
      setMinDate(minDateStr);
      
      // Set minimum month (YYYY-MM)
      const minMonthStr = `${minTransactionDate.getFullYear()}-${String(minTransactionDate.getMonth() + 1).padStart(2, '0')}`;
      setMinMonth(minMonthStr);
    }
  }, [transactions]);

  const handleGoBack = () => {
    navigate("/financeshow");
  };

  const printReport = () => {
    window.print();
  };

  const handleMonthChange = (e) => {
    const [year, month] = e.target.value.split('-').map(Number);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    if (year > currentYear || (year === currentYear && month > currentMonth)) {
      setMonthError("Cannot select future months");
      setSelectedMonth("");
      return;
    }
    
    // Check if selected month is before first transaction
    if (minMonth && e.target.value < minMonth) {
      setMonthError(`No data available before ${minMonth}`);
      setSelectedMonth("");
      return;
    }
    
    setMonthError("");
    setSelectedMonth(e.target.value);
  };

  const handleDateChange = (e) => {
    const selected = new Date(e.target.value);
    const today = new Date();
    
    // Reset time components for accurate comparison
    today.setHours(0, 0, 0, 0);
    selected.setHours(0, 0, 0, 0);
    
    if (selected > today) {
      setDateError("Cannot select future dates");
      setSelectedDate("");
      return;
    }
    
    // Check if selected date is before first transaction
    if (minDate && e.target.value < minDate) {
      setDateError(`No data available before ${minDate}`);
      setSelectedDate("");
      return;
    }
    
    setDateError("");
    setSelectedDate(e.target.value);
  };

  const generateMonthlyReport = async () => {
    if (!selectedMonth) {
      alert("Please select a valid month.");
      return;
    }

    const [year, month] = selectedMonth.split("-");
    try {
      const response = await api.get(`/api/monthly-report`, {
        params: { month, year },
      });
      setMonthlyReport(response.data);
      setDailyReport(null);
      setReportTitle(`${new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })} Financial Report`);
    } catch (error) {
      console.error("Error generating monthly report:", error);
      alert(error.response?.data?.error || "Error generating monthly report");
    }
  };

  const generateDailyReport = async () => {
    if (!selectedDate) {
      alert("Please select a valid date.");
      return;
    }

    try {
      const response = await api.get(`/api/daily-report`, {
        params: { date: selectedDate },
      });
      setDailyReport(response.data);
      setMonthlyReport(null);
      const date = new Date(selectedDate);
      setReportTitle(`${date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} Financial Report`);
    } catch (error) {
      console.error("Error generating daily report:", error);
      alert(error.response?.data?.error || "Error generating daily report");
    }
  };

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
          <div className="print-only-logo">
    <img src="/images/croplogo.jpg" alt="Company Logo" />
    <h1>CropWise</h1>
  </div>
      <div className="buttons-section report-buttons no-print">
        <button className="button back-button" onClick={handleGoBack}>
          Back
        </button>
        <button className="button export-pdf" onClick={printReport}>
          Print
        </button>
      </div>

      <div className="report-page">
        <div>
          <h1 className="no-print">Financial Summary</h1>
          <div className="report-selection-container">
            {/* Month Selection */}
            <div className="report-selection no-print">
              <label htmlFor="monthSelect">Select Month:</label>
              <input
                type="month"
                id="monthSelect"
                value={selectedMonth}
                onChange={handleMonthChange}
                min={minMonth}
                max={maxMonth}
              />
              <button className="generate-report-btn monthly" onClick={generateMonthlyReport}>
                Generate Monthly Report
              </button>
              {monthError && <p className="error-message">{monthError}</p>}
            </div>

            {/* Date Selection for Daily Report */}
            <div className="report-selection no-print">
              <label htmlFor="dateSelect">Select Date:</label>
              <input
                type="date"
                id="dateSelect"
                value={selectedDate}
                onChange={handleDateChange}
                min={minDate}
                max={maxDate}
              />
              <button className="generate-report-btn daily" onClick={generateDailyReport}>
                Generate Daily Report
              </button>
              {dateError && <p className="error-message">{dateError}</p>}
            </div>
          </div>

          {/* Display Report Title */}
          {reportTitle && <h2 className="report-title">{reportTitle}</h2>}
          <div className="date-time">
            <label>Generated on:</label>
            <p>Date - {formattedDate} | Time - {formattedTime}</p>
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

          {/* Summary Section */}
          <div className="report-summary">
            <div className="summary-item income">
              <h4>Total Income</h4>
              <p>Rs.{(monthlyReport ? monthlyReport.totalIncome : dailyReport ? dailyReport.totalIncome : transactions.reduce((sum, t) => t.status === "Income" ? sum + t.amount : sum, 0)).toLocaleString()}</p>
            </div>
            <div className="summary-item outcome">
              <h4>Total Outcome</h4>
              <p>Rs.{(monthlyReport ? monthlyReport.totalOutcome : dailyReport ? dailyReport.totalOutcome : transactions.reduce((sum, t) => t.status === "Outcome" ? sum + t.amount : sum, 0)).toLocaleString()}</p>
            </div>
            <div className="summary-item profit">
              <h4>Net Profit</h4>
              <p>Rs.{(monthlyReport ? monthlyReport.totalIncome - monthlyReport.totalOutcome : dailyReport ? dailyReport.totalIncome - dailyReport.totalOutcome : transactions.reduce((sum, t) => t.status === "Income" ? sum + t.amount : sum - t.amount, 0)).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceReportPage;