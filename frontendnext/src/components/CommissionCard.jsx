
// src/components/CommissionCard.jsx

import React from 'react';
import PropTypes from 'prop-types';

const CommissionCard = ({ commission }) => {
  return (
    <div className="commission-card">
      <div className="commission-card-header">
        <h3>Commission ID: {commission._id}</h3>
      </div>

      <div className="commission-card-body">
        <p><strong>Amount:</strong> ₹{commission.amount.toFixed(2)}</p>
        <p><strong>Agent/Franchise:</strong> {commission.agentName || commission.franchiseName}</p>
        <p><strong>Date:</strong> {new Date(commission.date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span className={`status ${commission.status.toLowerCase()}`}>{commission.status}</span></p>
      </div>
      <style>
        {`
        .commission-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.commission-card-header h3 {
  font-size: 1.25rem;
  color: #333;
}

.commission-card-body p {
  margin: 5px 0;
  font-size: 0.95rem;
}

.status {
  font-weight: bold;
  padding: 5px 8px;
  border-radius: 5px;
}

.status.paid {
  color: #4caf50;
}

.status.pending {
  color: #ff9800;
}

.status.failed {
  color: #f44336;
}
`}
      </style>
    </div>
  );
};

// Prop types validation for safety
CommissionCard.propTypes = {
  commission: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    agentName: PropTypes.string,
    franchiseName: PropTypes.string,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default CommissionCard;
