//update
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const CustomerPurchasedPage = () => {
  const [purchases] = useState([
    {
      id: 'CP001',
      customer: 'Anjali Verma',
      phone: '9876543210',
      item: '22K Gold Necklace',
      platform: 'BBSCART',
      type: 'Product',
      date: '2025-03-15',
      amount: 18200,
      payment: 'Wallet',
      commission: 900,
      referrer: 'Agent Ravi'
    },
    {
      id: 'CP002',
      customer: 'Ramesh Iyer',
      phone: '9988776655',
      item: 'Golden Harvest Plan',
      platform: 'Golldex',
      type: 'Investment',
      date: '2025-03-20',
      amount: 10000,
      payment: 'UPI',
      commission: 500,
      referrer: 'CustomerBecomeAVendor Meena'
    }
  ]);

  return (
    <>
    <div className="customer-purchased-page">
    <Sidebar />
  
        {/* Main Content Column */}
        <div className="customer-purchased-content">
          <h2 className="customer-purchased-title">Customer Purchases</h2>
  
          <div className="card shadow main-cust">
            <div className="card-header bg-primary text-white">
              <h5>Purchase Summary</h5>
            </div>
            <div className="card-body car-customer-purchased ">
              <table className="table table-bordered table-hover">
                <thead >
                  <tr>
                    <th>Purchase ID</th>
                    <th>Customer Name</th>
                    <th>Phone</th>
                    <th>Item / Plan</th>
                    <th>Platform</th>
                    <th>Type</th>
                    <th>Purchase Date</th>
                    <th>Amount (₹)</th>
                    <th>Payment</th>
                    <th>Commission (₹)</th>
                    <th>Referrer</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map((p) => (
                    <tr  className="table-light" key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.customer}</td>
                      <td>{p.phone}</td>
                      <td>{p.item}</td>
                      <td>{p.platform}</td>
                      <td>{p.type}</td>
                      <td>{p.date}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.payment}</td>
                      <td>₹{p.commission}</td>
                      <td>{p.referrer}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-info me-2">View</button>
                        <button className="btn btn-sm btn-outline-secondary">Invoice</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
      </div>
  
      <style>{`
        .customer-purchased-page {
          display: flex;
          flex-direction: row;
          width: 100vw;
          height: 100vh;
        }
          .customer-purchased-content{
        
          display: flex;
          flex-direction: column;
          justify-content: start;
          width: 100%;
          padding: 7% 20px;
          }
          .car-customer-purchased{
       
          }
          .table-light td, .table-light th {
        font-size: 12px;}

        @media (max-width: 768px){
          .customer-purchased-page{
            flex-direction: column;
              padding: 25% 0px;
          }
          .car-customer-purchased{
            overflow-x: scroll;
            overflow-y: hidden;
                        ;
          }
        }
      `}</style>
    </div>
  </>
  
  );
};

export default CustomerPurchasedPage;