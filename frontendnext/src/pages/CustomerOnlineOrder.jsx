// update

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/Sidebar";

const CustomerOnlineOrderPage = () => {
  const [orders] = useState([
    {
      id: "ORD1023",
      name: "22K Gold Chain",
      platform: "BBSCART",
      refferal: "CustomerBecomeAVendor Meena",
      type: "Product Purchase",
      date: "2025-03-18",
      amount: 18200,
      status: "Delivered",
      payment: "Wallet",
    },
    {
      id: "ORD2045",
      name: "Golden Harvest Plan",
      platform: "Golldex",
      refferal: "Agent Ravi",
      type: "Investment",
      date: "2025-03-22",
      amount: 10000,
      status: "Active",
      payment: "UPI",
    },
  ]);

  return (
    <>
      <div className="customer-orders-page">
        <Sidebar />
        {/* Main Content Column */}
        <div className="main-coo">
          <h2 className="mb-4">My Online Orders</h2>

          <div className="card shadow sub-main">
            <div className="card-header bg-primary text-white">
              <h5>Order Summary</h5>
            </div>
            <div className="card-body card1-custom-coo">
              <table className="table table-bordered table-hover">
                <thead >
                  <tr>
                    <th>Order ID</th>
                    <th>Product / Plan</th>
                    <th>Platform</th>
                    <th>Refferal</th>
                    <th>Order Type</th>
                    <th>Order Date</th>
                    <th>Total (₹)</th>
                    <th>Status</th>
                    <th>Payment Mode</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.name}</td>
                      <td>{order.platform}</td>
                      <td>{order.refferal}</td>
                      <td>{order.type}</td>
                      <td>{order.date}</td>
                      <td>₹{order.amount}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            order.status === "Delivered" ||
                            order.status === "Active"
                              ? "success"
                              : "warning"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{order.payment}</td>
                      <td>
                        <button className="coo-btn btn btn-sm btn-outline-info me-2">
                          View
                        </button>
                        <button className="coo-btn btn btn-sm btn-outline-secondary">
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <style>{`
        .customer-orders-page {
            display: flex;
            flex-direction:row;
            width: 100vw;
            height: 100vh;
        }
            .main-coo {
              width: 100%;
              padding: 20px;
            }
              
              .coo-btn {
                padding: 10px 20px;
                font-size: 12px;

             @media (max-width:768px){               
             .customer-orders-page {
                 flex-direction: column;
                 padding: 15% 0px;
               }
                   .card1-custom-coo{
                   overflow-x: scroll;
                   width: 100%;
                   background-color: blue;
            
                   }
             }
    `}</style>
      </div>
    </>
  );
};

export default CustomerOnlineOrderPage;
