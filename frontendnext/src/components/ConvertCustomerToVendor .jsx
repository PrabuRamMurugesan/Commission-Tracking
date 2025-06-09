// ConvertCustomerToVendor.js

import React, { useState } from 'react';
import axios from 'axios';

const ConvertCustomerToVendor = () => {
  const [customerId, setCustomerId] = useState('');

  const handleConvert = async () => {
    try {
      const response = await axios.post(`/api/customer/convertToVendor/${customerId}`);
      alert('Customer converted to vendor successfully!');
    } catch (error) {
      console.error(error);
      alert('Error converting customer to vendor');
    }
  };

  return (
    <div>
      <h1>Convert Customer to Vendor</h1>
      <input
        type="text"
        placeholder="Enter Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        required
      />
      <button onClick={handleConvert}>Convert</button>
    </div>
  );
};

export default ConvertCustomerToVendor;
