import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminRewardPage = () => {
  const [rewards, setRewards] = useState([]);
  const [role, setRole] = useState('Agent');
  const [period, setPeriod] = useState('daily');

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get(`/api/rewards/${role}/${period}`);
        setRewards(response.data);
      } catch (error) {
        console.error('Error fetching rewards:', error);
      }
    };
    fetchRewards();
  }, [role, period]);

  return (
    <div>
      <h1>Admin Rewards Dashboard</h1>
      <label>Role: </label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="Agent">Agent</option>
        <option value="Franchise">Franchise</option>
        <option value="TerritoryHead">Territory Head</option>
        <option value="Vendor">Vendor</option>
        <option value="CustomerVendor">Customer Vendor</option>
      </select>

      <label>Period: </label>
      <select value={period} onChange={(e) => setPeriod(e.target.value)}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="yearly">Yearly</option>
      </select>

      <ul>
        {rewards.map((reward, index) => (
          <li key={index}>
            {reward.userId} - {reward.rewardAmount} (Reward Amount)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRewardPage;
