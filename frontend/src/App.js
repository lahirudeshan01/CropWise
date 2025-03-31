import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Finance from './components/Finance/Finance';
import FinanceReportPage from './components/Finance/FinanceReportPage';
import IncomeForm from './components/Finance/IncomeForm';
import OutcomeForm from './components/Finance/OutcomeForm';
import UpdateForm from './components/Finance/UpdateForm'; 
import SalaryManagement from './components/Finance/SalaryManagement';


function App() {
  return (
    <Router>
      <Routes>
    
          <Route index element={<Finance />} />
          <Route path="finance-report" element={<FinanceReportPage />} />
          <Route path="finance" element={<Finance />} />
          <Route path="income-form" element={<IncomeForm />} />
          <Route path="outcome-form" element={<OutcomeForm />} />
          <Route path="update-form" element={<UpdateForm />} />
          <Route path="salary-management" element={<SalaryManagement />} />
      
      </Routes>
    </Router>
  );
}

export default App;
