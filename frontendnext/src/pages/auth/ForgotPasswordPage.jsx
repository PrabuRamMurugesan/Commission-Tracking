import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
      
      // If reset link is provided in development, show it
      if (response.data.resetLink) {
        console.log('Reset link:', response.data.resetLink);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending reset link. Please try again.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2 className="text-center mb-4">Forgot Password</h2>
        <p className="text-center mb-4" style={{ fontSize: '0.9rem', color: '#ddd', marginBottom: '20px' }}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="link-group">
          <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
            Back to Login
          </a>
          <a href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
            Create an Account
          </a>
        </div>
      </div>

      <style>{`
        .login-page {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          width: 100vw;
          font-family: "Poppins", sans-serif;
        }

        .login-box {
          background:#002e2c;
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          color: #fff;
          animation: fadeIn 0.8s ease;
        }

        h2 {
          font-weight: 600;
          font-size: 1.8rem;
        }

        label {
          display: block;
          margin: 12px 0 6px;
          font-size: 0.95rem;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: none;
          outline: none;
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.85);
          color: #333;
          transition: all 0.3s ease;
        }

        input:focus {
          background: #fff;
          box-shadow: 0 0 5px rgba(37, 117, 252, 0.5);
        }

        input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-btn {
          width: 100%;
          margin-top: 20px;
          padding: 12px;
          background: linear-gradient(90deg, #6a11cb, #2575fc);
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #2575fc, #6a11cb);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message {
          color: #ffdddd;
          background: rgba(255, 0, 0, 0.2);
          border-radius: 6px;
          padding: 8px;
          font-weight: 500;
          text-align: center;
          margin-top: 10px;
        }

        .success-message {
          color: #ddffdd;
          background: rgba(0, 255, 0, 0.2);
          border-radius: 6px;
          padding: 8px;
          font-weight: 500;
          text-align: center;
          margin-top: 10px;
        }

        .link-group {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          font-size: 0.9rem;
        }

        .link-group a {
          color: #e0e0e0;
          text-decoration: none;
          transition: 0.3s;
        }

        .link-group a:hover {
          color: #fff;
          text-decoration: underline;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordPage;
