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
              
              {/* Dashboard routes with sidebar */}
              <Route path="/dashboard" element={<DashboardLayout><Home /></DashboardLayout>} />
              <Route path="/home" element={<DashboardLayout><Home /></DashboardLayout>} />
              <Route path="/harvest" element={<DashboardLayout><Addharvest /></DashboardLayout>} />
              <Route path="/showall" element={<DashboardLayout><Showall /></DashboardLayout>} />
              <Route path="/Show/:id" element={<DashboardLayout><Detailsview /></DashboardLayout>} />
              <Route path="/updatedetails/:id" element={<DashboardLayout><Updatedetails /></DashboardLayout>} />
            </Routes>
          </div>
        </Router>
      </div>
    </>
  )
}

export default App