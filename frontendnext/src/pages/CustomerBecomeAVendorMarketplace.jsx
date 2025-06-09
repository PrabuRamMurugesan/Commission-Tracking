  import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const CustomerBecomeAVendorMarketplace = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Gold Pendant',
      price: 12000,
      stock: 10,
      status: 'Published',
      orders: 4
    },
    {
      id: 2,
      name: 'Wallet Recharge Offer Pack',
      price: 500,
      stock: 50,
      status: 'Draft',
      orders: 0
    }
  ]);

  return (
    <>
    <div className="vendor-marketplace-page">
    <div className="side-bar-container">
          <Sidebar />
        </div>

        {/* Main Content - Expands to Full Width on Small Screens */}
        <div className="main-content-vendorMarketplace">
          <div className="container main-content-vendorMarketplace">
            <h2 className="mb-4">Customer Become A Vendor - Marketplace Panel</h2>

            {/* Dashboard Summary */}
            <div className="d-flex flex-wrap justify-content-end gap-3 mb-4">
              {[
                {
                  title: "Total Products",
                  value: products.length,
                  color: "primary",
                },
                {
                  title: "Total Orders",
                  value: products.reduce((sum, p) => sum + p.orders, 0),
                  color: "success",
                },
                {
                  title: "Published Products",
                  value: products.filter((p) => p.status === "Published").length,
                  color: "info",
                },
              ].map((item, idx) => (
                <div key={idx} className="card border shadow text-center px-3 py-2 flex-grow-1">
                  <h6 className="text-muted">{item.title}</h6>
                  <h3 className={`text-${item.color} fw-bold`}>{item.value}</h3>
                </div>
              ))}
            </div>

            {/* Product Management Table */}
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h5>My Product Listings</h5>
              </div>
              <div className="card-body">
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Price (₹)</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Orders</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>₹{product.price}</td>
                        <td>{product.stock}</td>
                        <td>
                          <span className={`badge bg-${product.status === 'Published' ? 'success' : 'secondary'}`}>
                            {product.status}
                          </span>
                        </td>
                        <td>{product.orders}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-info me-2">Edit</button>
                          <button className="btn btn-sm btn-outline-danger">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
     

      {/* Responsive Styles */}
      <style>{`
       .vendor-marketplace-page{
       display: flex;
       flex-direction: row;
       width: 100vw;
       height: 100vh;
       }
       .side-bar-container {
       flex-shrink: 0;      
    
       }
       .main-content-vendorMarketplace {
     display: flex;
     flex-direction: column;
     flex-grow: 1;
     padding: 40px;
     background-color: #f8f9fa; 
    
      }
      @media (max-width: 768px) {
        .main-content-vendorMarketplace {
          padding: 60px 20px;
          background-color: #f8f9fa;
        }
      }
      `}</style>
    </div>
  </>
  );
};

export default CustomerBecomeAVendorMarketplace;