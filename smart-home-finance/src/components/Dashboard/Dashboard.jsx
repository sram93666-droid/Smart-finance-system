import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaCalculator, FaRobot } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <h1>Smart Home Finance</h1>
        <div className="user-info">
          <span>Welcome, {userData?.name || currentUser?.email}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <h2>Choose Your Finance Management System</h2>
        
        <div className="mode-cards">
          <div className="mode-card" onClick={() => navigate('/manual-finance')}>
            <FaCalculator className="mode-icon" />
            <h3>Manual Finance System</h3>
            <p>Take control of your finances with AI assistance. Enter expenses daily and get smart insights.</p>
            <ul className="features">
              <li>✓ Daily expense tracking</li>
              <li>✓ Monthly analysis</li>
              <li>✓ AI-powered insights</li>
              <li>✓ Custom savings plans</li>
            </ul>
          </div>

          <div className="mode-card" onClick={() => navigate('/auto-finance')}>
            <FaRobot className="mode-icon" />
            <h3>Automatic Finance System</h3>
            <p>Let AI handle everything. Get a complete financial plan based on your preferences.</p>
            <ul className="features">
              <li>✓ AI-driven expense prediction</li>
              <li>✓ Automated budget planning</li>
              <li>✓ Smart recommendations</li>
              <li>✓ Product suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;