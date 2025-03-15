import React, { useEffect, useState } from 'react';
import { getTransactions, generateReport } from '../../api/financeApi';
import './Finance.css';

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState({ totalIncome: 0, totalOutcome: 0, profit: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactions = await getTransactions();
        const report = await generateReport();
        setTransactions(transactions);
        setReport(report);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle Export PDF Button Click
  const handleExportPDF = () => {
    window.print();
    return;
   
  };

  const handleIncome = () => {
    console.log('Income button clicked');
  };

  const handleOutcome = () => {
    console.log('Outcome button clicked');
  };

  return (
    <div className="finance-dashboard">
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
    </div>
  );
};

export default Finance;