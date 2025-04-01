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

  // Get current date for validation
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-indexed in JS

  // Check if a month/year is in the future
  const isFutureMonthYear = (month, year) => {
    if (year > currentYear) return true;
    if (year === currentYear && month > currentMonth) return true;
    return false;
  };

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
      
      // Additional client-side validation
      if (isFutureMonthYear(parseInt(processMonth), parseInt(processYear))) {
        throw new Error('Cannot process salaries for future months');
      }

      await processSalaries(parseInt(processMonth), parseInt(processYear));
      const updated = await getSalaries({
        month: processMonth,
        year: processYear
      });
      setSalaries(updated);
      setSuccess('Salaries processed successfully');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to process salaries');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await markSalaryAsPaid(id);
      
      // Update local state
      setSalaries(salaries.map(s => 
        s._id === id ? { 
          ...s, 
          status: 'Paid',
          paymentDate: new Date().toISOString()
        } : s
      ));
      
      setSuccess('Salary marked as paid successfully');
  
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes with validation
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // For month/year filters, validate they're not in the future
    if ((name === 'month' || name === 'year') && value) {
      const month = name === 'month' ? parseInt(value) : parseInt(filters.month || '0');
      const year = name === 'year' ? parseInt(value) : parseInt(filters.year || '0');
      
      if (month && year && isFutureMonthYear(month, year)) {
        setError(`Cannot filter future months (${month}/${year})`);
        return;
      }
    }
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  return (
    <div className="salary-management">
      {/* Back Button */}
      <button 
        className="back-button"
        onClick={() => navigate('/financeshow')}
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
            {Array.from({ length: 12 }, (_, i) => {
              const monthValue = i + 1;
              const isFuture = processYear && isFutureMonthYear(monthValue, parseInt(processYear));
              return (
                <option 
                  key={monthValue} 
                  value={monthValue}
                  disabled={isFuture}
                >
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  {isFuture}
                </option>
              );
            })}
          </select>
          <select 
            value={processYear} 
            onChange={(e) => setProcessYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = currentYear - 5 + i;
              const isFutureYear = year > currentYear;
              return (
                <option 
                  key={year} 
                  value={year}
                  disabled={isFutureYear}
                >
                  {year}
                  {isFutureYear}
                </option>
              );
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
            name="month"
            value={filters.month} 
            onChange={handleFilterChange}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => {
              const monthValue = i + 1;
              const isFuture = filters.year && isFutureMonthYear(monthValue, parseInt(filters.year));
              return (
                <option 
                  key={monthValue} 
                  value={monthValue}
                  disabled={isFuture}
                >
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  {isFuture}
                </option>
              );
            })}
          </select>
          <select 
            name="year"
            value={filters.year} 
            onChange={handleFilterChange}
          >
            <option value="">All Years</option>
            {Array.from({ length: 10 }, (_, i) => {
              const year = currentYear - 5 + i;
              const isFutureYear = year > currentYear;
              return (
                <option 
                  key={year} 
                  value={year}
                  disabled={isFutureYear}
                >
                  {year}
                  {isFutureYear}
                </option>
              );
            })}
          </select>
          <select 
            name="status"
            value={filters.status} 
            onChange={handleFilterChange}
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
            <th>EPF (8%)</th>
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