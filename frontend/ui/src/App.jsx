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


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <div className="app-container">
      <Router>
      
        <div className="content-area">
          <Routes>
          <Route path="/about" element={<AboutUs/>} />
          <Route path="/dashboard" element={<Sidebar/>} />
          <Route path="/userui" element={<HomePage/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/harvest" element={<Addharvest/>} />
          <Route path="/showall" element={<Showall/>} />
          <Route path="/Show/:id" element={<Detailsview/>} />
          <Route path="/updatedetails/:id" element={<Updatedetails/>} />
        
          </Routes>
        </div>
      </Router>
    </div>
    </>
  )
}

export default App
