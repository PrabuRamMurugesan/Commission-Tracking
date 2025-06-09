import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import Sidebar from './Sidebar';

const FranchiseCreatePage = () => {
  const [name, setName] = useState('');
  const [territoryId, setTerritoryId] = useState('');
  const [commissionPercentage, setCommissionPercentage] = useState(5);
  const [inventory, setInventory] = useState([{ productId: '', stock: 0 }]);
  const [responseMessage, setResponseMessage] = useState('');

  const handleInventoryChange = (index, event) => {
    const values = [...inventory];
    values[index][event.target.name] = event.target.value;
    setInventory(values);
  };

  const handleAddInventory = () => {
    setInventory([...inventory, { productId: '', stock: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (commissionPercentage <= 0) {
      setResponseMessage('Commission percentage must be greater than 0.');
      return;
    }

    if (inventory.some(item => !item.productId || item.stock < 0)) {
      setResponseMessage('Please provide valid product IDs and stock.');
      return;
    }

    try {
      const { data } = await axiosInstance.post('/api/franchisees/create', {
        name,
        territoryId,
        commissionPercentage,
        inventory,
      });
      setResponseMessage('Franchise created successfully!');
      console.log(data);
    } catch (error) {
      console.error(error);
      setResponseMessage(error.response?.data?.message || 'Error creating franchise.');
    }
  };

  return (
    <div className='franchise-create-page'>
  <Sidebar />
  <div className="franchise-main">
    <h1>Create Franchise</h1>

    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

      <label>Territory ID:</label>
      <input type="text" value={territoryId} onChange={(e) => setTerritoryId(e.target.value)} required />

      <label>Commission Percentage:</label>
      <input
        type="number"
        value={commissionPercentage}
        onChange={(e) => setCommissionPercentage(e.target.value)}
      />

      <h3>Inventory</h3>
      {inventory.map((item, index) => (
        <div key={index} className="inventory-item">
          <label>Product ID:</label>
          <input
            type="text"
            name="productId"
            value={item.productId}
            onChange={(event) => handleInventoryChange(index, event)}
          />
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={item.stock}
            onChange={(event) => handleInventoryChange(index, event)}
          />
        </div>
      ))}
      <button type="button" onClick={handleAddInventory}>Add Inventory</button>
      <button type="submit">Create Franchise</button>
    </form>

    {responseMessage && (
      <p
        style={{
          color: responseMessage.includes('successfully') ? 'green' : 'red',
          fontWeight: 'bold',
        }}
      >
        {responseMessage}
      </p>
    )}

    {/* Preview Section */}
    <div className="preview-section card mt-4 p-3 shadow">
      <h3 className="mb-3">Franchise Preview</h3>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Territory ID:</strong> {territoryId}</p>
      <p><strong>Commission %:</strong> {commissionPercentage}</p>

      <h5>Inventory Items:</h5>
      {inventory.length > 0 ? (
        <ul className="list-group">
          {inventory.map((item, index) => (
            <li key={index} className="list-group-item">
              <strong>Product ID:</strong> {item.productId} | <strong>Stock:</strong> {item.stock}
            </li>
          ))}
        </ul>
      ) : (
        <p>No inventory added yet.</p>
      )}
    </div>

    <style>
      {`
        .franchise-create-page {
          display: flex;
          width: 100vw;
          height: 100vh;
        }

        .franchise-main {
          width: 100%;
          height: 100%;
          padding: 7% 20px;
          overflow-y: auto;
        }

        .franchise-main form {
          display: flex;
          flex-direction: column;
        }

        .franchise-main input {
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .franchise-main button {
          padding: 10px;
          margin-top: 10px;
          border: none;
          background-color: #4CAF50;
          color: white;
          cursor: pointer;
          display: flex;
          align-self: center;
          justify-content: center;
          border-radius: 4px;
          width: 50%;
        }

        .franchise-main button:hover {
          background-color: #45a049;
        }

        .inventory-item {
          margin-bottom: 10px;
        }

        .inventory-item label {
          display: block;
          margin-bottom: 5px;
        }

        .preview-section {
          background-color: #f8f9fa;
          border-radius: 8px;
        }
          @media (max-width: 768px) {
          .franchise-main {
            padding: 7rem 10px;
          }
      `}
    </style>
  </div>
</div>

  );
};

export default FranchiseCreatePage;
