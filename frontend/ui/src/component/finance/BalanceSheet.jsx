import React, { useEffect, useState } from "react";
import { getTransactions } from "../../api/financeApi";
import axios from "axios";
import "./Finance.css";

const BalanceSheet = ({ onBack }) => {
  const [transactions, setTransactions] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch transactions
      const filters = selectedDate ? { endDate: selectedDate } : {};
      const transactionsData = await getTransactions(filters);
      setTransactions(transactionsData);

      // Fetch inventory data
      const inventoryResponse = await axios.get("http://localhost:3000/api/inventory");
      setInventory(inventoryResponse.data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const clearDate = () => {
    setSelectedDate("");
  };

  const calculateAssets = () => {
    // Current Assets
    const cashAndBank = transactions
      .filter(t => t.status === 'Income' && t.reference === 'Sales Income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Calculate inventory value from actual inventory data for Farm Machinery & Tools
    const farmMachineryValue = inventory
      .filter(item => item.category === "Farm Machinery & Tools")
      .reduce((sum, item) => {
        const amount = parseFloat(item.availableAmount) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        return sum + (amount * unitPrice);
      }, 0);

    const accountsReceivable = transactions
      .filter(t => t.reference === 'Accounts Receivable')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Fixed Assets
    const equipment = transactions
      .filter(t => t.reference === 'Equipment')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      currentAssets: {
        cashAndBank,
        inventory: farmMachineryValue,
        accountsReceivable,
        total: cashAndBank + farmMachineryValue + accountsReceivable
      },
      fixedAssets: {
        equipment,
        total: equipment
      },
      totalAssets: cashAndBank + farmMachineryValue + accountsReceivable + equipment
    };
  };

  const calculateLiabilities = () => {
    // Current Liabilities
    const accountsPayable = transactions
      .filter(t => t.reference === 'Accounts Payable')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const salariesPayable = transactions
      .filter(t => t.reference === 'Salary Payment' && t.status === 'Outcome')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Long-term Liabilities
    const loans = transactions
      .filter(t => t.reference === 'Loan')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return {
      currentLiabilities: {
        accountsPayable,
        salariesPayable,
        total: accountsPayable + salariesPayable
      },
      longTermLiabilities: {
        loans,
        total: loans
      },
      totalLiabilities: accountsPayable + salariesPayable + loans
    };
  };

  const calculateEquity = () => {
    const assets = calculateAssets();
    const liabilities = calculateLiabilities();
    
    // Owner's Equity components
    const ownerCapital = transactions
      .filter(t => t.reference === 'Owner Capital')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const retainedEarnings = assets.totalAssets - liabilities.totalLiabilities - ownerCapital;

    return {
      ownerCapital,
      retainedEarnings,
      totalEquity: ownerCapital + retainedEarnings
    };
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const assets = calculateAssets();
  const liabilities = calculateLiabilities();
  const equity = calculateEquity();

  return (
    <div className="balance-sheet-container">
      {/* Print-only header */}
      <div className="print-header print-only">
        <div className="company-logo">
          <img src="/images/croplogo.jpg" alt="CropWise Logo" />
        </div>
        <div className="company-info">
          <h1>CropWise</h1>
          <p>Smart Agriculture Solutions</p>
        </div>
        <div className="document-title">
          <h2>Balance Sheet</h2>
          <p className="balance-date">As of: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Screen-only header */}
      <div className="screen-header no-print">
        <div className="balance-sheet-header">
          <div className="header-left">
            <button className="button back-button" onClick={onBack}>
              Back to Finance
            </button>
          </div>
          <h2>Balance Sheet</h2>
          <div className="header-right">
            <button className="button print-button" onClick={handlePrint}>
              Print Balance Sheet
            </button>
          </div>
        </div>

        <div className="date-selector">
          <label htmlFor="balance-sheet-date">As of:</label>
          <input
            type="date"
            id="balance-sheet-date"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
          />
          {selectedDate && (
            <button className="button clear-date-button" onClick={clearDate}>
              Clear Date
            </button>
          )}
        </div>
      </div>

      <div className="balance-sheet-report">
        <table className="report-table">
          <tbody>
            <tr className="table-header">
              <td colSpan="2"><strong>Assets</strong></td>
              <td colSpan="2"><strong>Liabilities</strong></td>
              <td colSpan="2"><strong>Owner's Equity</strong></td>
            </tr>
            
            {/* Current Assets and Current Liabilities row */}
            <tr>
              <td colSpan="2" className="section-header">Current Assets</td>
              <td colSpan="2" className="section-header">Current Liabilities</td>
              <td colSpan="2"></td>
            </tr>
            
            <tr>
              <td>Cash and Bank</td>
              <td className="amount">Rs. {assets.currentAssets.cashAndBank.toLocaleString()}</td>
              <td>Accounts Payable</td>
              <td className="amount">Rs. {liabilities.currentLiabilities.accountsPayable.toLocaleString()}</td>
              <td>Owner's Capital</td>
              <td className="amount">Rs. {equity.ownerCapital.toLocaleString()}</td>
            </tr>
            
            <tr>
              <td>Inventory</td>
              <td className="amount">Rs. {assets.currentAssets.inventory.toLocaleString()}</td>
              <td>Salaries Payable</td>
              <td className="amount">Rs. {liabilities.currentLiabilities.salariesPayable.toLocaleString()}</td>
              <td>Retained Earnings</td>
              <td className="amount">Rs. {equity.retainedEarnings.toLocaleString()}</td>
            </tr>
            
            <tr>
              <td>Accounts Receivable</td>
              <td className="amount">Rs. {assets.currentAssets.accountsReceivable.toLocaleString()}</td>
              <td colSpan="2"></td>
              <td colSpan="2"></td>
            </tr>
            
            <tr className="subtotal">
              <td>Total Current Assets</td>
              <td className="amount">Rs. {assets.currentAssets.total.toLocaleString()}</td>
              <td>Total Current Liabilities</td>
              <td className="amount">Rs. {liabilities.currentLiabilities.total.toLocaleString()}</td>
              <td>Total Equity</td>
              <td className="amount">Rs. {equity.totalEquity.toLocaleString()}</td>
            </tr>
            
            {/* Fixed Assets and Long-term Liabilities */}
            <tr>
              <td colSpan="2" className="section-header">Fixed Assets</td>
              <td colSpan="2" className="section-header">Long-term Liabilities</td>
              <td colSpan="2"></td>
            </tr>
            
            <tr>
              <td>Equipment</td>
              <td className="amount">Rs. {assets.fixedAssets.equipment.toLocaleString()}</td>
              <td>Loans</td>
              <td className="amount">Rs. {liabilities.longTermLiabilities.loans.toLocaleString()}</td>
              <td colSpan="2"></td>
            </tr>
            
            <tr className="subtotal">
              <td>Total Fixed Assets</td>
              <td className="amount">Rs. {assets.fixedAssets.total.toLocaleString()}</td>
              <td>Total Long-term Liabilities</td>
              <td className="amount">Rs. {liabilities.longTermLiabilities.total.toLocaleString()}</td>
              <td colSpan="2"></td>
            </tr>
            
            {/* Grand Totals */}
            <tr className="grand-total">
              <td>Total Assets</td>
              <td className="amount">Rs. {assets.totalAssets.toLocaleString()}</td>
              <td>Total Liabilities</td>
              <td className="amount">Rs. {liabilities.totalLiabilities.toLocaleString()}</td>
              <td colSpan="2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Print-only footer */}
      <div className="print-footer">
      </div>
    </div>
  );
};

export default BalanceSheet; 