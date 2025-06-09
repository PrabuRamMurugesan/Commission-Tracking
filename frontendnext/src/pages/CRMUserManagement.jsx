

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';

const CRMUserManagementPage = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Ravi Kumar',
      email: 'ravi@example.com',
      phone: '9876543210',
      role: 'Franchisee',
      status: 'Active',
      kyc: 'Completed',
      joined: '2025-02-15',
      region: 'South',
      city: 'Chennai',
      platform: 'BBSCART'
    },  
    {
      id: 2,
      name: 'Meena Iyer',
      email: 'meena@example.com',
      phone: '9876541234',
      role: 'CustomerBecomeAVendor',
      status: 'Pending Approval',
      kyc: 'Pending',
      joined: '2025-03-10',
      region: 'North',
      city: 'Delhi',
      platform: 'Golldex'
    }
  ]);

  return (
    <div className=" user-mgmt-page bg-light ">
          <div className='side-bar-cum'>
          <Sidebar />
          </div>
      

        {/* Main Content */}
        <div className="  summary-cards">
          <h2 className="m-1 mb-4 p-1">CRM User Management</h2>

          {/* Summary Cards */}
          <div className="summer-card row g-4 mb-4">
            {[
              { title: 'Total Users', value: users.length, color: 'primary' },
              { title: 'Active Users', value: users.filter(u => u.status === 'Active').length, color: 'success' },
              { title: 'Pending Approvals', value: users.filter(u => u.status === 'Pending Approval').length, color: 'warning' }
            ].map((item, idx) => (
              <div className="col-md-4" key={idx}>
                <div className={`card border-${item.color} shadow-sm`}>
                  <div className="card-body text-center">
                    <h6 className="mb-1">{item.title}</h6>
                    <h3 className={`text-${item.color}`}>{item.value}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* User Table */}
          <div className="card shadow-sm table-card-cum ">
            <div className="card-header bg-primary text-white">
              <h5>User List</h5>
              <a href="/"><button className='cumb-btn'><h6>Add User</h6></button></a>
            </div>
            <div className="card-body p-3">
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className='justify-items-between text-center w-100'>
                    <tr >
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email / Phone</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>KYC</th>
                      <th>Joined On</th>
                      <th>Region / City</th>
                      <th>Platform</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email} / {user.phone}</td>
                        <td>{user.role}</td>
                        <td>
                          <span className={`badge bg-${user.status === 'Active' ? 'success' : user.status === 'Pending Approval' ? 'warning' : 'secondary'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>{user.kyc}</td>
                        <td>{user.joined}</td>
                        <td>{user.region}/ {user.city}</td>
                        <td>{user.platform}</td>
                       <td>
                       <div className='d-flex justify-center row p-3 gap-1' >
                          <button className="btn btn-sm btn-outline-info me-2">View</button>
                          <button className="btn btn-sm btn-outline-success me-2">Edit</button>
                          <button className="btn btn-sm btn-outline-danger">Deactivate</button>
                        </div>
                       </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      <style>{`
       .user-mgmt-page{
         display: flex;
         justify-content: space-between;
         width: 100%;
       }
         .summary-cards {
           flex: 1;
           padding: 7% 30px ;
           width: 100%;
         }

         .card-header {
           display: flex;
           justify-content: space-between;  
           align-items: center;
       
         }
           .cumb-btn{
             background-color: #007BFF;
             color: white;
             padding: 3px 20px;
             border-radius: 15px;
             border: none;
             cursor: pointer;
           }

         /* Responsive Design */
        @media (max-width: 992px) {
          .user-mgmt-page {
            flex-direction: row;
         
          }
           
          .summary-cards {
            padding: 20px;
          }

          .card-header {
            flex-direction: column;
            gap: 10px;
            align-items: flex-start;
          }

          .cumb-btn {
            width: 100%;
          }
        }

        @media (max-width: 576px) {
          table th, table td {
            font-size: 12px;
            padding: 20px;
          }

          .btn {
            font-size: 12px;
            padding: 4px 8px;
          }

          .card-body h6 {
            font-size: 14px;
          }

          .card-body h3 {
            font-size: 20px;
          }

          .summary-cards {
            padding: 15px;
          }
        }

        @media (max-width: 768px) {
        .user-mgmt-page {
            flex-direction: row;
          padding: 10% 10px ;
          }
          .summary-cards {
            padding: 15px;
          }

          .table-card-cum
          {
          width: 52%;
          }
          .card-header {
            flex-direction: row;
            gap: 10px;
            align-items: flex-start;
          }
            .summer-card{
            width: 54%;}
        }
      `}</style>
    </div>
  );
};

export default CRMUserManagementPage;