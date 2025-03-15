import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Finance from './components/Finance/Finance';
import FinanceReportPage from './components/Finance/FinanceReportPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Finance Page */}
        <Route path="/" element={<Finance />} />

        {/* Finance Report Page */}
        <Route path="/finance-report" element={<FinanceReportPage />} />
        <Route path="/finance" element={<Finance/>} />
      </Routes>
    </Router>
  );
}

export default App;