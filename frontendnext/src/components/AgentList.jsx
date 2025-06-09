import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; // Importing QRCodeCanvas

const AgentDetails = () => {
  const [formData, setFormData] = useState({
    IdentityNo: '',
    Registeras:'',
    FirstName: '',
    LastName:'',
    dob: '',
    email: '',
    mobile: '',
    profileImage: '',
    pan: '',
    aadhaar: '',
    bankName: '',
    accountNo: '',
    ifscNo: '',
    education: '',
    criminalHistory: '',
    language: '',
    aadhaarImage: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };
  
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(10);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  const startTimer = () => {
    setTimer(10);
    setIsResendEnabled(false);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = () => {
    if (formData.mobile) {
      setIsOtpSent(true);
      setIsVerified(false);
      alert(`OTP sent to ${formData.mobile}`);
      startTimer();
    } else {
      alert('Please enter a valid mobile number');
    }
  };

  const handleVerifyOtp = () => {
    if (formData.otp === '1234') {
      setIsVerified(true);
      alert('OTP Verified!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form Data:', formData);
  };

  const handleReset = () => {
    setFormData({
      IdentityNo: '',
      Registeras:'',
      FirstName: '',
      LastName:'',
      dob: '',
      email: '',
      mobile: '',
      profileImage: '',
      pan: '',
      aadhaar: '',
      bankName: '',
      accountNo: '',
      ifscNo: '',
      education: '',
      criminalHistory: '',
      language: '',
      aadhaarImage: '',
    });
  };
  
   

  return (
    <div className="agent-details">
    <h2>Registration Form</h2>
    <form onSubmit={handleSubmit}>
      {/* Identity No field */}
      <div className="form-group identity-group">
  <label>Identity No:</label>
  <div className="identity-container">
    <input
      type="text"
      name="IdentityNo"
      value={formData.IdentityNo}
      onChange={handleInputChange}
      required
    />
    {formData.IdentityNo && (
      <div className="qr-code">
        <QRCodeCanvas value={formData.IdentityNo} size={64} />
      </div>
       )}
       </div>
        </div>
        
        <div className="form-group">
          <label> Register as:</label>
          <select
            name="Registeras"
            value={formData.Registeras}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="yes">Customer</option>
            <option value="no">Vendor</option>
            <option value="no">Agent</option>
            <option value="no">Territory Head</option>
            <option value="no">Franchise</option>
          </select>
         </div>

        <div className="form-group">
          <label> First Name:</label>
          <input
            type="text"
            name="FirstName"
            value={formData.FirstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label> Last Name:</label>
          <input
            type="text"
            name="LastName"
            value={formData.LastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
        <label>Mobile No:</label>
          <div className="mobile-otp-container">
          <input
      type="text"
      value={formData.mobile}
      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
    />
    <button onClick={handleSendOtp} disabled={isOtpSent && !isResendEnabled}>
      {isResendEnabled ? 'Resend OTP' : 'Generate OTP'}
    </button>

    {isOtpSent && !isVerified && (
      <div>
        {!isResendEnabled && <p>Resend OTP in {timer} seconds</p>}
        <input
          type="text"
          placeholder="Enter OTP"
          value={formData.otp}
          onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
        />
        <button onClick={handleVerifyOtp}>Verify OTP</button>
      </div>
     )}
     </div>
     </div>
     

        <div className="form-group">
          <label>PAN No:</label>
          <input
            type="text"
            name="pan"
            value={formData.pan}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Aadhaar No:</label>
          <input
            type="text"
            name="aadhaar"
            value={formData.aadhaar}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Upload Aadhaar Image:</label>
          <input
            type="file"
            name="aadhaarImage"
            onChange={handleFileChange}
            accept="image/*"
            required
          />
        </div>

        <div className="form-group">
          <label>Bank Name:</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Account No:</label>
          <input
            type="text"
            name="accountNo"
            value={formData.accountNo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>IFSC No:</label>
          <input
            type="text"
            name="ifscNo"
            value={formData.ifscNo}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Education Details:</label>
          <textarea
            name="education"
            value={formData.education}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Criminal History:</label>
          <select
            name="criminalHistory"
            value={formData.criminalHistory}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Upload Criminal Image (if applicable):</label>
          <input
            type="file"
            name="criminalImage"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className="form-group">
          <label>Language:</label>
          <input
            type="text"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>



      <style>
        {`
         .agent-details {
            width: 80%;
            margin: 0 auto;
            font-family: Arial, sans-serif;
          }
            .form-group.identity-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.identity-container {
  display: flex;
  align-items: center;
  gap: 15px; /* Space between input and QR code */
  margin-top: 8px;
}

.identity-container input {
  flex: 1;
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.identity-container .qr-code {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px; /* Fixed size for QR code container */
  height: 80px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.identity-container .qr-code canvas {
  width: 64px; /* QR code size */
  height: 64px;
}


          h2 {
            text-align: center;
            color: #232f3e;
            margin-bottom: 30px;
          }

          form {
            background-color:rgb(243, 237, 237);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-group label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .form-group input,
          .form-group textarea,
          .form-group select {
            width: 100%;
            padding: 8px;
            font-size: 1rem;
            border-radius: 4px;
            border: 1px solid #ddd;
          }

          .form-group input[type="file"] {
            padding: 5px;
          }

          .form-actions {
            display: flex;
            justify-content: space-between;
          }

          .form-actions button {
            padding: 10px 20px;
            font-size: 1rem;
            border: none;
            border-radius: 4px;
            background-color:rgb(35, 49, 66);
            color: white;
            cursor: pointer;
          }

          .form-actions button[type="button"] {
            background-color: #f44336;
          }

          .form-actions button:hover {
            background-color: #37475a;
          }

          .form-actions button[type="button"]:hover {
            background-color: #d32f2f;
          }
             .qr-code {
            margin-top: 20px;
            text-align: center;
          }
            .mobile-otp-group {
            display: flex;
            flex-direction: column;
          }

          .mobile-otp-container {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .mobile-otp-container input[type="text"] {
            flex: 1;
            padding: 8px;
            font-size: 1rem;
            border-radius: 4px;
            border: 1px solid #ddd;
          }

          .mobile-otp-container button {
            padding: 8px 10px;
            font-size: 0.9rem;
            border-radius: 4px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .mobile-otp-container button:hover {
            background-color: #0056b3;
          }

          .mobile-otp-container p {
            font-size: 0.9rem;
            color: #555;
            margin: 0;
          }

          .otp-button,
          .verify-button {
            background-color: #232f3e;
            color: white;
            border: none;
            padding: 0px 25px;
            border-radius: 4px;
            cursor: pointer;
          }

          .otp-button:hover,
          .verify-button:hover {
            background-color: #37475a;
          }

          .otp-verification {
            margin-top: 10px;
          }

          .otp-container {
            display: flex;
            gap: 10px;
            align-items: center;
          }

          .verified-mark {
            color: green;
            font-size: 1.2rem;
            font-weight: bold;
          }

          input {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ddd;
          }

          @media (max-width: 768px) {
            .mobile-otp-container,
            .otp-container {
              flex-direction: column;
              gap: 5px;
            }
          }
            @media (max-width: 768px) {
            .agent-details {
             width: 100%;
            padding: 10px;
           }
          }
        `}
      </style>
    </div>
  );
};

export default AgentDetails;
