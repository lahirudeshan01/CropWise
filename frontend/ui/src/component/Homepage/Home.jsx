import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/apiUtils';
import './Dashboard01.css';

function Dashboard01() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [harvestDate, setHarvestDate] = useState('');
  const [generatedTime, setGeneratedTime] = useState(new Date());
  const [cropDates, setCropDates] = useState({
    landPrep: '',
    planting: '',
    growth: '',
    harvesting: ''
  });
  const [currentState, setCurrentState] = useState('');
  const [expectedYield, setExpectedYield] = useState(0);
  const [taskDates, setTaskDates] = useState({
    complete: '',
    ongoing: '',
    upcoming: ''
  });

  useEffect(() => {
    setGeneratedTime(new Date());
  }, []);

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatTaskDate = (date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    setTaskDates({
      complete: formatTaskDate(yesterday),
      ongoing: formatTaskDate(today),
      upcoming: formatTaskDate(tomorrow)
    });

    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userData'));
        if (user && user._id) {
          const response = await api.get(`/users/${user._id}`);
          if (response.data && response.data.user) {
            setUserData(response.data.user);
            
            if (response.data.user.startDate) {
            const startDate = new Date(response.data.user.startDate);
            
            // Calculate harvest date (start date + 6 months)
            const harvestDate = new Date(startDate);
            harvestDate.setMonth(harvestDate.getMonth() + 6);
            setHarvestDate(formatDate(harvestDate));
            
            // Calculate expected yield (area * 2.5)
            if (response.data.user.area) {
              setExpectedYield((response.data.user.area * 2.5).toFixed(1));
            }

            // Calculate crop tracker dates
            const landPrepDate = new Date(startDate);
            const plantingDate = new Date(startDate);
            plantingDate.setMonth(plantingDate.getMonth() + 1);
            const growthDate = new Date(plantingDate);
            growthDate.setDate(growthDate.getDate() + 14);
            
            setCropDates({
              landPrep: formatDate(landPrepDate, 'short'),
              planting: formatDate(plantingDate, 'short'),
              growth: formatDate(growthDate, 'short'),
              harvesting: formatDate(harvestDate, 'short')
            });

            // Determine current state based on dates
            if (today < landPrepDate) {
              setCurrentState('Land Preparation');
            } else if (today >= landPrepDate && today < plantingDate) {
              setCurrentState('Land Preparation');
            } else if (today >= plantingDate && today < growthDate) {
              setCurrentState('Planting');
            } else if (today >= growthDate && today < harvestDate) {
              setCurrentState('Growth');
            } else if (today >= harvestDate) {
              setCurrentState('Harvesting');
            }
          }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Helper function to format dates
  const formatDate = (date, format = 'long') => {
    if (!date) return '';
    
    const options = format === 'long' 
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { month: 'short', day: 'numeric' };
    
    return date.toLocaleDateString('en-US', options);
  };

  const handleEditClick = () => {
    if (userData) {
      navigate('/edit-details', { state: { userData } });
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Logo and Title for Print */}
      {/* Logo and Title for Print */}
<div className="print-header">
  <img src="/images/croplogo.jpg" alt="CropWise Logo" className="print-logo" />
  <h1 className="print-title">CropWise</h1>
  <div className="print-divider"></div>
  <p className="generation-time">
    Generated on: {generatedTime.toLocaleDateString()} at {generatedTime.toLocaleTimeString()}
  </p>
  <h2 className="print-report-title">Crop Prediction Report</h2>
</div>

      {/* Header Section */}
      <div className="header">
        <h1>Farm and Crop Management</h1>
        <div className="header-buttons">
          <button className="print-button" onClick={() => window.print()}>Generate Report</button>
          <button className="edit-button" onClick={handleEditClick}>Profile</button>
        </div>
      </div>

      {/* Current State Section */}
      <div className="planting-section">
        <div className="current-states">
          <h2>Current States</h2>
          <span className={`planting-text ${currentState.toLowerCase().replace(' ', '-')}`}>
            {currentState}
          </span>
        </div>
      </div>

      {/* Harvest Day Section */}
      <div className="harvest-day">
        <h2>{harvestDate}</h2>
        <span>Harvest Day</span>
      </div>

      {/* Crop Tracker Section */}
      <div className="crop-tracker">
        <h2>Crop Tracker</h2>
        <table>
          <thead>
            <tr>
              <th>Land Preparation</th>
              <th>Planting</th>
              <th>Growth</th>
              <th>Harvesting</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{cropDates.landPrep}</td>
              <td>{cropDates.planting}</td>
              <td>{cropDates.growth}</td>
              <td>{cropDates.harvesting}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Current Tasks Section */}
      <div className="current-tasks">
        <h2>Current Tasks</h2>
        <div className="task-list">
          <div className="task-header">
            <span>TITLE</span>
            <span>DATE</span>
            <span>CATAGORY</span>
            <span>STATUS</span>
          </div>
          <div className="task-item">
            <span>planting - Block D</span>
            <span>{taskDates.complete}</span>
            <span>Routine</span>
            <span className="status complete">Complete</span>
          </div>
          <div className="task-item">
            <span>planting - Block E</span>
            <span>{taskDates.ongoing}</span>
            <span>Routine</span>
            <span className="status ongoing">Ongoing</span>
          </div>
          <div className="task-item">
            <span>planting - Block F</span>
            <span>{taskDates.upcoming}</span>
            <span>Routine</span>
            <span className="status upcoming">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Harvest Prediction Section */}
      <div className="harvest-prediction">
        <h2>Harvest Prediction</h2>
        <div className="prediction-card">
          <div className="prediction-item">
            <span className="prediction-label">Estimated Date</span>
            <span className="prediction-value">{harvestDate}</span>
          </div>
          <div className="prediction-item">
            <span className="prediction-label">Expected Yield</span>
            <span className="prediction-value">{expectedYield} tons</span>
          </div>
        </div>
        
        
      </div>
    </div>
  );
}

export default Dashboard01;