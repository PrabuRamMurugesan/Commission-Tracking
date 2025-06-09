import React, { useState } from 'react';
import axios from 'axios';

const ForgotUserIDPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/forgot-user-id', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error retrieving user ID.');
    }
  };

  return (
    <div>
      <h1>Forgot User ID</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Retrieve User ID</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default ForgotUserIDPage;
