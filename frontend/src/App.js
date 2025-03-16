import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Finance from './components/Finance/Finance';
import FinanceReportPage from './components/Finance/FinanceReportPage';
import IncomeForm from './components/Finance/IncomeForm';
import OutcomeForm from './components/Finance/OutcomeForm';
import UpdateForm from './components/Finance/UpdateForm'; 


function App() {
  return (
    <Router>
      <Routes>
        {/* Main Finance Page */}
        <Route path="/" element={<Finance />} />

        {/* Finance Report Page */}
        <Route path="/finance-report" element={<FinanceReportPage />} />
        <Route path="/finance" element={<Finance/>} />
        <Route path="/income-form" element={<IncomeForm />} />
        <Route path="/outcome-form" element={<OutcomeForm />} />
        <Route path="/update-form" element={<UpdateForm />} />
      </Routes>
    </Router>
  );
}

export default App;