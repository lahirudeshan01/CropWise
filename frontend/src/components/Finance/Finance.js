import React, { useEffect, useState } from 'react';
import { getTransactions, generateReport } from '../../api/financeApi';
import './Finance.css';

const Finance = () => {
  const [transactions, setTransactions] = useState([]);
  const [report, setReport] = useState({ totalIncome: 0, totalOutcome: 0, profit: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const transactions = await getTransactions();
      const report = await generateReport();
      setTransactions(transactions);
      setReport(report);
    };
    fetchData();
  }, []);

  return (
    <div className="finance-dashboard">
      <h2>Financial Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>NAME</th>
            <th>DATE & TIME</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.name}</td>
              <td>{new Date(transaction.date).toLocaleString()}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Financial Report</h2>
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
    </div>
  );
};

export default Finance;