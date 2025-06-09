// src/pages/CommissionDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import CommissionCard from '../components/CommissionCard';

const CommissionDetails = () => {
  const { id } = useParams();
  const [commission, setCommission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommission = async () => {
      try {
        const response = await fetch(`/api/commissions/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCommission(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommission();
  }, [id]);

  if (loading) {
    return <p>Loading commission details...</p>;
  }

  if (error) {
    return <p>Error loading commission details: {error}</p>;
  }

  return (
    <div className="commission-details">
      {commission ? (
        <>
          <CommissionCard commission={commission} />
          {/* Additional detailed information can be displayed here */}
          <div className="commission-extra-details">
            <p><strong>Description:</strong> {commission.description}</p>
            <p><strong>Associated Transactions:</strong></p>
            <ul>
              {commission.transactions.map((transaction) => (
                <li key={transaction._id}>
                  Transaction ID: {transaction._id}, Amount: ₹{transaction.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>No commission details available.</p>
      )}
      <style>
        {`
        .commission-details {
  padding: 20px;
}

.commission-extra-details {
  margin-top: 20px;
}

.commission-extra-details p {
  font-size: 1rem;
  margin: 5px 0;
}

.commission-extra-details ul {
  list-style-type: disc;
  margin-left: 20px;
}

.commission-extra-details li {
  margin: 5px 0;
}
`}
      </style>
    </div>
  );
};

export default CommissionDetails;
