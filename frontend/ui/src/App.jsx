import { useState } from 'react'
import Sidebar from './component/sidebar/Sidebar'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import Home from './component/Homepage/Home'
import Addharvest from './component/AddHarvest/Addharvest'
// import Showlist from './component/Showdetails/Showlist'
import Showall from './component/Showdetails/showall'
import './App.css'
import Detailsview from './component/viewdetails_farmers/Detailsview'
import Updatedetails from './component/viewdetails_farmers/Updatedetails'
import HomePage from './component/UserUi/HomePage'
import AboutUs from './component/UserUi/AboutUs'
import Buyers from './component/UserUi/Buyers'
import FarmerList from './component/Showdetails/FarmerList'
import Userfee from './component/UserUi2/Userfee'
import PaymentPage from './component/Payment_order/PaymentPage'
import AddInventoryItem from './component/Inventory/AddInventoryItem'
import InventoryList from './component/InventoryList/InventoryList'
import SeeDetails from './component/SeeDetails/SeeDetails'
import UpdateInventoryItem from './component/UpdateInventory/UpdateInventoryItem'
import IncomeForm from './component/finance/IncomeForm'
import OutcomeForm from './component/finance/OutcomeForm'
import SalaryManagement from './component/finance/SalaryManagement'
import UpdateForm from './component/finance/UpdateForm'
import FinanceReportPage from './component/finance/FinanceReportPage'
import Register from './component/Register/Register'
import Login from './component/Login/Login'
import EditUserDetails from './component/edit/EditUserDetails'
import Finance from './component/finance/Finance'

// import Dashboard01 from './component/dashboard01/Dashboard01'

// import ShowDetails from './component/ShowDetailsemployee/ShowDetailsemployee'

// Create a layout component for dashboard pages
function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app-container">
        <Router>
          <div className="content-area">
            <Routes>
              {/* Public routes */}
              <Route path="/about" element={<AboutUs/>} />
               <Route path="/" element={<HomePage/>} /> 
              <Route path="/buy" element={<Buyers/>} />
              <Route path="/userfee" element={<Userfee/>} />
              <Route path="/PaymentPage" element={<PaymentPage/>} />
              <Route path="/item/:id" element={<SeeDetails/>} />
              <Route path="/edit-item/:id" element={<UpdateInventoryItem/>} />
              <Route path="/income-form" element={<IncomeForm/>} />
              <Route path="/outcome-form" element={<OutcomeForm/>} />
              <Route path="/salary-management" element={<SalaryManagement/>} />
              <Route path="/update-form" element={<UpdateForm/>} />
              <Route path="/finance-report" element={<FinanceReportPage/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/log" element={<Login/>} />
              <Route path="/edit-details" element={<EditUserDetails/>} />
             

              {/* <Route path="/register" element={<Register/>} /> */}



              
             
              
              
              
              {/* Dashboard routes with sidebar */}
              <Route path="/dashboard" element={<DashboardLayout><Home /></DashboardLayout>} />
              <Route path="/home" element={<DashboardLayout><Home /></DashboardLayout>} />
              <Route path="/harvest" element={<DashboardLayout><Addharvest /></DashboardLayout>} />
              <Route path="/showall" element={<DashboardLayout><Showall /></DashboardLayout>} />
              <Route path="/Show/:id" element={<DashboardLayout><Detailsview /></DashboardLayout>} />
              <Route path="/updatedetails/:id" element={<DashboardLayout><Updatedetails /></DashboardLayout>} />                          
              <Route path="/inventryshow" element={<DashboardLayout><InventoryList/></DashboardLayout>} />
              <Route path="/addinventry" element={<DashboardLayout><AddInventoryItem/></DashboardLayout>} />
              <Route path="/inventryshow" element={<DashboardLayout><InventoryList/></DashboardLayout>} />
              
              {<Route path="/financeshow" element={<DashboardLayout><Finance/></DashboardLayout>} /> }
              {/* <Route path="/dash" element={<DashboardLayout><Dashboard01/></DashboardLayout>} />
              */}
            

             
           
              
            </Routes>
          </div>
        </Router>
      </div>
    </>
  )
}

export default App