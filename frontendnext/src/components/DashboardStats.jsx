// src/components/DashboardStats.jsx

import React from 'react';
import PropTypes from 'prop-types';
// import './DashboardStats.css'; // Ensure you have corresponding CSS for styling

const DashboardStats = ({ stats }) => {
  return (
    <div className="dashboard-stats">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card">
          <div className="stat-icon">
            <img src={stat.icon} alt={`${stat.label} icon`} />
          </div>
          <div className="stat-info">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        </div>
      ))}
      <style>
        {`
        .dashboard-stats {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: 20px 0;
}

.stat-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 10px;
  flex: 1 1 200px;
  display: flex;
  align-items: center;
}

.stat-icon img {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.stat-info p {
  margin: 5px 0 0;
  font-size: 1rem;
  color: #666;
}

        `}
      </style>
    </div>
  );
};

DashboardStats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      icon: PropTypes.string, // URL to the icon image
    })
  ).isRequired,
};

export default DashboardStats;
