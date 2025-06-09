// src/pages/AddCommission.jsx

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../components/Sidebar';

// const AddCommission = () => {
//   const [formData, setFormData] = useState({
//     amount: '',
//     agentName: '',
//     franchiseName: '',
//     date: '',
//     status: 'Pending',
//   });
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('/api/commissions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       navigate('/commissions');
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//    <div className="container mt-5">
//     <Sidebar/>
//        <div className="add-commission">
//       <h2>Add New Commission</h2>
//       {error && <p className="error">Error: {error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="amount">Amount (₹):</label>
//           <input
//             type="number"
//             id="amount"
//             name="amount"
//             value={formData.amount}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="agentName">Agent Name:</label>
//           <input
//             type="text"
//             id="agentName"
//             name="agentName"
//             value={formData.agentName}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="franchiseName">Franchise Name:</label>
//           <input
//             type="text"
//             id="franchiseName"
//             name="franchiseName"
//             value={formData.franchiseName}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="date">Date:</label>
//           <input
//             type="date"
//             id="date"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="status">Status:</label>
//           <select
//             id="status"
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             required
//           >
//             <option value="Pending">Pending</option>
//             <option value="Paid">Paid</option>
//             <option value="Failed">Failed</option>
//           </select>
//         </div>
//         <button type="submit">Add Commission</button>
//       </form>
//       <style>
//         {`
//         .container {  
//         wdth: 100%;
//         height: 100vh;
//                     display: flex;
//                  flex-direction: row;
//         }
//          .sidebar {
//          flex-basis: 250px; /* changed to flex-basis */
//          background-color: #333;
//          color: #fff;
//          padding: 20px;
//          border-right: 1px solid #ddd;
      
//        }

//         .add-commission {
//    flex: 1;
//    padding: 20px;

//    align-items: center;
//    justify-content: center;
//    column-gap: 10px;
//    background-color: #ffffff;
//    border: 1px solid #e0e0e0;
//    border-radius: 8px;
//    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
// }

// .add-commission h2 {
//   text-align: center;
//   margin-bottom: 20px;
// }

// .form-group {
//   margin-bottom: 15px;
// }

// .form-group label {
//   display: block;
//   margin-bottom: 5px;
//   font-weight: bold;
// }

// .form-group input,
// .form-group select {
//   width: 100%;
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
// }

// button {
//   width: 100%;
//   padding: 10px;
//   background-color: #4caf50;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   font-size: 16px;
//   cursor: pointer;
// }

// button:hover {
//   background-color: #45a049;
// }

// .error {
//   color: #f44336;
//   text-align: center;
//   margin-bottom: 15px;
// }
// `}
//       </style>
//     </div>
//    </div>
//   );
// };

// export default AddCommission;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AddCommission = () => {
  const [formData, setFormData] = useState({
    amount: '',
    agentName: '',
    franchiseName: '',
    date: '',
    status: 'Pending',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/commissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      navigate('/commissions');
    } catch (err) {
      setError(err.message);
    }
  };   
    return (
      <div className="container-add-commission">
        <Sidebar />
   
      <div className="add-commission">
        <h2>Add New Commission</h2>
        {error && <p className="error">Error: {error}</p>}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="amount">Amount (₹):</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="agentName">Agent Name:</label>
              <input
                type="text"
                id="agentName"
                name="agentName"
                value={formData.agentName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="franchiseName">Franchise Name:</label>
              <input
                type="text"
                id="franchiseName"
                name="franchiseName"
                value={formData.franchiseName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <button type="submit">Add Commission</button>
          </form>
        </div>
      </div>

      <style>{`
  .container-add-commission {
    display: flex;
    height: 100vh;
    width: 100vw;
    background-color: #f9f9f9;
  }

  .add-commission {
    flex: 1;
    padding: 80px 40px;
    padding-bottom: 150px;
    overflow-y: auto;
  }

  .add-commission h2 {
    font-size: 28px;
    margin-bottom: 30px;
    color: #333;
  }

  .form-container {
    background-color: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    max-width: 600px;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    font-weight: 600;
    margin-bottom: 8px;
    color: #555;
  }

  .form-group input,
  .form-group select {
    padding: 10px 12px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s;
  }

  .form-group input:focus,
  .form-group select:focus {
    border-color: #007bff;
  }

  button[type="submit"] {
    background-color: #007bff;
    color: #fff;
    padding: 12px 24px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s ease;
  }

  button[type="submit"]:hover {
    background-color: #0056b3;
  }

  .error {
    color: red;
    font-weight: bold;
    margin-bottom: 15px;
  }

  @media (max-width: 768px) {
    .add-commission {
      padding: 30% 20px;
    }

    .form-container {
      padding: 20px;
    }
  }
`}</style>

    </div>
  );
//       <div className="container-add-commission">
//         <div className="sidebar">
//           <Sidebar />
//         </div>
//         <div className="add-commission">
//           <h2>Add New Commission</h2>
//           {error && <p className="error">Error: {error}</p>}
//           <div className="form-container">
//             <form onSubmit={handleSubmit}>
//               <div className="form-group">
//                 <label htmlFor="amount">Amount (₹):</label>
//                 <input
//                   type="number"
//                   id="amount"
//                   name="amount"
//                   value={formData.amount}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="agentName">Agent Name:</label>
//                 <input
//                   type="text"
//                   id="agentName"
//                   name="agentName"
//                   value={formData.agentName}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="franchiseName">Franchise Name:</label>
//                 <input
//                   type="text"
//                   id="franchiseName"
//                   name="franchiseName"
//                   value={formData.franchiseName}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="date">Date:</label>
//                 <input
//                   type="date"
//                   id="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="form-group">
//                 <label htmlFor="status">Status:</label>
//                 <select
//                   id="status"
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="Pending">Pending</option>
//                   <option value="Paid">Paid</option>
//                   <option value="Failed">Failed</option>
//                 </select>
//               </div>
//               <button type="submit">Add Commission</button>
//             </form>
//           </div>
//         </div>

//         <style>
//           {`
//     .container-add-commission {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: row;
//     align-items: flex-start;
//          justify-content: space-between;
// }
   

// .sidebar {
//   flex-basis: 250px;
//   color: #fff;
//    width: 100vw;
//   height: 100vh;
//   padding: 20px;
// }

// .add-commission {
//   flex-basis: 650px;
//   flex: 1;
//   padding: 40px;
//   background-color: #f9f9f9;
//   box-sizing: border-box;
//   overflow-y: auto;
//   width: 50%;
// }

// .add-commission h2 {
//   font-size: 24px;
//   color: #333;
//   margin-bottom: 30px;
// }

// .form-container {
//   background: white;
//   padding: 25px;
//   border-radius: 10px;
//   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
// }

// .form-group {
//   margin-bottom: 20px;
// }

// .form-group label {
//   display: block;
//   margin-bottom: 8px;
//   font-weight: 600;
// }

// .form-group input,
// .form-group select {
//   width: 100%;
//   padding: 10px;
//   border-radius: 5px;
//   border: 1px solid #ccc;
//   font-size: 16px;
// }

// button[type="submit"] {
//   padding: 12px 25px;
//   background-color: #28a745;
//   color: white;
//   font-size: 16px;
//   border: none;
//   border-radius: 6px;
//   cursor: pointer;
//   transition: background-color 0.3s ease;
// }

// button[type="submit"]:hover {
//   background-color: #218838;
// }

// .error {
//   color: red;
//   font-size: 14px;
//   margin-bottom: 15px;
// }

// `}
//         </style>
//  </div>

//   );
};

export default AddCommission;
 

