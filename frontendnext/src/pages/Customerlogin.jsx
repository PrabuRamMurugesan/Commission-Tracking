//update
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const CustomerLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Logging in as ${email}`);
    // TODO: Add API call and role-based redirect logic here
  };

  return (
   <>
    <div className="customer-login-page">
        <Sidebar/>

      
      <div className="container-login">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card card-login">
              <div className="card-header bg-primary text-white text-center">
                <h4>Customer Login</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email or Mobile</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter email or mobile"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" />
                    <label className="form-check-label" htmlFor="rememberMe">Remember Me</label>
                  </div>

                  <button type="submit" className="btn btn-primary w-100">Login</button>

                  <div className="mt-3 d-flex justify-content-between">
                    <a href="#">Forgot Password?</a>
                    <a href="#">New User? Register</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      <style>{`
         .customer-login-page{
         display: flex;
         flex-direction: row;
         justify-content: space-between;  
        gap: 25%;
        width: 100%;
        height: 100vh;
       }

       .container-login {
   
         display: flex;
         justify-content: center;
         align-items: center;
         width: 100%;
         height: 100vh;
      }
         .card-login{
         width: 400px;
         box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
         border-radius: 10px;
         padding: 30px;
         margin-right: 50px;
         margin-bottom: 50px;}

         @media (max-width: 768px) {
         .customer-login-page {
           flex-direction: column;
           justify-content: center;
           align-items: center;
         }
         .container-login {
           width: 100%;
           height: auto;
           padding: 20px 40px;
         }

        
      `}</style>
    </div></>
  );
};

export default CustomerLoginPage;