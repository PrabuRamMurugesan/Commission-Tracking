// src/components/Agent/ViewAgentModal.jsx
import React from "react";

const ViewAgentModal = ({ show, onClose, agent }) => {
  if (!show || !agent) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Agent Details</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* Basic Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Basic Information</h6>
                <div className="mb-2">
                  <strong>Name:</strong> {agent.name || "-"}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {agent.email || "-"}
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {agent.phone || "-"}
                </div>
                <div className="mb-2">
                  <strong>WhatsApp:</strong> {agent.whatsappNumber || "-"}
                </div>
                <div className="mb-2">
                  <strong>Platform:</strong>{" "}
                  <span className="badge bg-info">{agent.platform || "-"}</span>
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge bg-${
                      agent.accountStatus === "active"
                        ? "success"
                        : agent.accountStatus === "suspended"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {agent.accountStatus || "inactive"}
                  </span>
                </div>
              </div>

              {/* Business Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Business Information</h6>
                <div className="mb-2">
                  <strong>Business Partner Code:</strong> {agent.businessPartnerCode || "-"}
                </div>
                <div className="mb-2">
                  <strong>PAN:</strong> {agent.pan || "-"}
                </div>
                <div className="mb-2">
                  <strong>GSTIN:</strong> {agent.gstin || "-"}
                </div>
                <div className="mb-2">
                  <strong>Designation:</strong> {agent.designation || "-"}
                </div>
                <div className="mb-2">
                  <strong>Zone:</strong> {agent.zone || "-"}
                </div>
                <div className="mb-2">
                  <strong>Franchise ID:</strong> {agent.franchiseeId || "-"}
                </div>
              </div>

              {/* Address Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Address Information</h6>
                <div className="mb-2">
                  <strong>District:</strong> {agent.district || "-"}
                </div>
                <div className="mb-2">
                  <strong>State:</strong> {agent.state || "-"}
                </div>
                <div className="mb-2">
                  <strong>City:</strong> {agent.city || "-"}
                </div>
                <div className="mb-2">
                  <strong>Pincode:</strong> {agent.pincode || "-"}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Performance Metrics</h6>
                <div className="mb-2">
                  <strong>Total Customers:</strong> {agent.totalCustomers || 0}
                </div>
                <div className="mb-2">
                  <strong>Total Transactions:</strong> {agent.totalTransactions || 0}
                </div>
                <div className="mb-2">
                  <strong>Commission Earned:</strong> ₹{agent.commissionEarned?.toLocaleString() || 0}
                </div>
                <div className="mb-2">
                  <strong>Commission Pending:</strong> ₹{agent.commissionPending?.toLocaleString() || 0}
                </div>
                <div className="mb-2">
                  <strong>Joined Date:</strong>{" "}
                  {agent.joinedDate
                    ? new Date(agent.joinedDate).toLocaleDateString()
                    : agent.createdAt
                    ? new Date(agent.createdAt).toLocaleDateString()
                    : "-"}
                </div>
              </div>

              {/* Additional Information (for BBSCART agents) */}
              {(agent.vendor_fname ||
                agent.pan_number ||
                agent.gst_number ||
                agent.outlet_contact_no ||
                agent.gst_address ||
                agent.outlet_location) && (
                <div className="col-12 mb-3">
                  <h6 className="text-primary border-bottom pb-2">Additional BBSCART Information</h6>
                  <div className="row">
                    {agent.vendor_fname && (
                      <div className="col-md-6 mb-2">
                        <strong>Vendor First Name:</strong> {agent.vendor_fname}
                      </div>
                    )}
                    {agent.vendor_lname && (
                      <div className="col-md-6 mb-2">
                        <strong>Vendor Last Name:</strong> {agent.vendor_lname}
                      </div>
                    )}
                    {agent.outlet_manager_name && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Manager:</strong> {agent.outlet_manager_name}
                      </div>
                    )}
                    {agent.outlet_contact_no && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Contact:</strong> {agent.outlet_contact_no}
                      </div>
                    )}
                    {agent.application_status && (
                      <div className="col-md-6 mb-2">
                        <strong>Application Status:</strong>{" "}
                        <span className="badge bg-info">{agent.application_status}</span>
                      </div>
                    )}
                    {agent.gst_legal_name && (
                      <div className="col-md-6 mb-2">
                        <strong>GST Legal Name:</strong> {agent.gst_legal_name}
                      </div>
                    )}
                    {agent.gst_constitution && (
                      <div className="col-md-6 mb-2">
                        <strong>GST Constitution:</strong> {agent.gst_constitution}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="col-12 mb-3">
                <h6 className="text-primary border-bottom pb-2">Permissions</h6>
                <div className="mb-2">
                  <strong>Can Promote:</strong>{" "}
                  <span className={`badge bg-${agent.actions?.canPromote ? "success" : "secondary"}`}>
                    {agent.actions?.canPromote ? "Yes" : "No"}
                  </span>
                </div>
                <div className="mb-2">
                  <strong>Can Deactivate:</strong>{" "}
                  <span className={`badge bg-${agent.actions?.canDeactivate ? "success" : "secondary"}`}>
                    {agent.actions?.canDeactivate ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* ID Information */}
              <div className="col-12">
                <h6 className="text-primary border-bottom pb-2">System Information</h6>
                <div className="mb-2">
                  <strong>Agent ID:</strong> <code>{agent._id}</code>
                </div>
                {agent._source && (
                  <div className="mb-2">
                    <strong>Source:</strong>{" "}
                    <span className="badge bg-secondary">{agent._source}</span>
                  </div>
                )}
                {agent.createdAt && (
                  <div className="mb-2">
                    <strong>Created:</strong> {new Date(agent.createdAt).toLocaleString()}
                  </div>
                )}
                {agent.updatedAt && (
                  <div className="mb-2">
                    <strong>Last Updated:</strong> {new Date(agent.updatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAgentModal;
