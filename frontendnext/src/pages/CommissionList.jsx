// src/pages/CommissionList.jsx

import React, { useState, useEffect } from 'react';
import CommissionCard from '../components/CommissionCard';

const CommissionList = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const response = await fetch('/api/commissions');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCommissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, []);

  if (loading) {
    return <p>Loading commissions...</p>;
  }

  if (error) {
    return <p>Error loading commissions: {error}</p>;
  }

  return (
    <div className="commission-list">
      {commissions.length > 0 ? (
        commissions.map((commission) => (
          <CommissionCard key={commission._id} commission={commission} />
        ))
      ) : (
        <p>No commissions available.</p>
      )}
      <style>
        {`
        .commission-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}
`}
      </style>
    </div>
  );
};

export default CommissionList;
