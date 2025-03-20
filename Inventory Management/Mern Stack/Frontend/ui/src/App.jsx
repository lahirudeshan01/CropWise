import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import InventoryList from './components/InventoryList'
import AddInventoryItem from './components/AddInventoryItem'
import SeeDetails from './components/Seedetails';
import UpdateInventoryItem from './components/UpdateInventoryItem';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InventoryList />} />
        <Route path="/add-item" element={<AddInventoryItem />} />
        <Route path="/item/:id" element={<SeeDetails />} />
        <Route path="/edit-item/:id" element={< UpdateInventoryItem/>} />
      </Routes>
    </Router>
  );
}

export default App
