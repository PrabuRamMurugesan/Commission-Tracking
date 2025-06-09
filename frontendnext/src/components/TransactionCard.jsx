// src/components/TransactionCard.jsx

import React from 'react';
import PropTypes from 'prop-types';

const TransactionCard = ({ transaction }) => {
  const {
    _id,
    amount,
    agentName,
    customerName,
    date,
    status,
  } = transaction;

  return (
    <div className="transaction-card">
      <div className="transaction-card-header">
        <h3>Transaction ID: {_id}</h3>
      </div>
      <div className="transaction-card-body">
        <p><strong>Amount:</strong> ₹{amount.toFixed(2)}</p>
        <p><strong>Agent:</strong> {agentName}</p>
        <p><strong>Customer:</strong> {customerName}</p>
        <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> <span className={`status ${status.toLowerCase()}`}>{status}</span></p>
      </div>
      <style>
        {`
        .transaction-card {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.transaction-card-header h3 {
  font-size: 1.25rem;
  color: #333;
}

.transaction-card-body p {
  margin: 5px 0;
  font-size: 0.95rem;
}

.status {
  font-weight: bold;
  padding: 5px 8px;
  border-radius: 5px;
}

.status.completed {
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

TransactionCard.propTypes = {
  transaction: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    agentName: PropTypes.string,
    customerName: PropTypes.string,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default TransactionCard;
