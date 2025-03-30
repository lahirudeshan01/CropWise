import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { processSalaries, getSalaries, markSalaryAsPaid } from '../../api/financeApi';
import './SalaryManagement.css';

const SalaryManagement = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    month: '',
    year: '',
    status: ''
  });
  const [processMonth, setProcessMonth] = useState('');
  const [processYear, setProcessYear] = useState('');

  // Fetch salaries based on filters
  useEffect(() => {
    const fetchSalaries = async () => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const data = await getSalaries(filters);
        setSalaries(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch salaries');
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, [filters]);

  const handleProcessSalaries = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      await processSalaries(parseInt(processMonth), parseInt(processYear));
      const updated = await getSalaries({
        month: processMonth,
        year: processYear
      });
      setSalaries(updated);
      setSuccess('Salaries processed successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process salaries');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await markSalaryAsPaid(id);
      
      // Check if response exists and has data
      if (!response || !response.data) {
        throw new Error('Invalid server response');
      }
  
      // Update local state
      setSalaries(salaries.map(s => 
        s._id === id ? { 
          ...s, 
          status: 'Paid',
          paymentDate: new Date().toISOString()
        } : s
      ));
      
      // Set success message - make sure to check for nested properties safely
      const deduction = response.data.deduction || {};
      const breakdown = deduction.breakdown || {};
      
      setSuccess(
        `Payment successful!`
      );
  
    } catch (err) {
      // More comprehensive error handling
      const errorMessage = err.message || 
                          (err.error && err.error.message) || 
                          'Payment failed';
      setError(`Payment Failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="salary-management">
      {/* Back Button */}
      <button 
        className="back-button"
        onClick={() => navigate('/finance')}
        style={{
          backgroundColor: 'red',
          color: 'white',
          padding: '8px 16px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}
      >
        ← Back to Finance
      </button>
      
      <h1>Salary Management</h1>
      
      {/* Success Message */}
      {success && <div className="success-message">{success}</div>}
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Process Salaries Section */}
      <div className="process-section">
        <h2>Process Salaries</h2>
        <div className="process-controls">
          <select 
            value={processMonth} 
            onChange={(e) => setProcessMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i+1} value={i+1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select 
            value={processYear} 
            onChange={(e) => setProcessYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - 5 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
          <button 
            onClick={handleProcessSalaries}
            disabled={!processMonth || !processYear || loading}
          >
            {loading ? 'Processing...' : 'Process Salaries'}
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h2>Filter Salaries</h2>
        <div className="filters">
          <select 
            value={filters.month} 
            onChange={(e) => setFilters({...filters, month: e.target.value})}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i+1} value={i+1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
          <select 
            value={filters.year} 
            onChange={(e) => setFilters({...filters, year: e.target.value})}
          >
            <option value="">All Years</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = new Date().getFullYear() - 5 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && <div className="loading">Loading...</div>}

      {/* Salaries Table */}
      <table className="salaries-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Month</th>
            <th>Basic Salary</th>
            <th>EPF (12%)</th>
            <th>ETF (3%)</th>
            <th>Net Salary</th>
            <th>Status</th>
            <th>Payment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salaries.length === 0 ? (
            <tr>
              <td colSpan="9">No salary records found</td>
            </tr>
          ) : (
            salaries.map((salary) => {
              const [year, month] = salary.monthYear.split('-');
              const monthName = new Date(year, month-1).toLocaleString('default', { month: 'long' });
              
              return (
                <tr key={salary._id}>
                  <td>{salary.employeeId}</td>
                  <td>{`${monthName} ${year}`}</td>
                  <td>Rs. {salary.basicSalary?.toFixed(2) || '0.00'}</td>
                  <td>Rs. {salary.epf?.toFixed(2) || '0.00'}</td>
                  <td>Rs. {salary.etf?.toFixed(2) || '0.00'}</td>
                  <td>Rs. {salary.netSalary?.toFixed(2) || '0.00'}</td>
                  <td className={`status-${salary.status.toLowerCase()}`}>
                    {salary.status}
                  </td>
                  <td>
                    {salary.paymentDate 
                      ? new Date(salary.paymentDate).toLocaleDateString() 
                      : '-'}
                  </td>
                  <td>
                    {salary.status === 'Pending' && (
                      <button 
                        onClick={() => handleMarkAsPaid(salary._id)}
                        disabled={loading}
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalaryManagement;