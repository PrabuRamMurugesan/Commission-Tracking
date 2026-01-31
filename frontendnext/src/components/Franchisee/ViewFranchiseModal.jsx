// src/components/Franchisee/ViewFranchiseModal.jsx
import React from "react";

const ViewFranchiseModal = ({ show, onClose, franchise }) => {
  if (!show || !franchise) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Franchise Details</h5>
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
                  <strong>Name:</strong> {franchise.name || "-"}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {franchise.email || "-"}
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {franchise.phone || "-"}
                </div>
                <div className="mb-2">
                  <strong>WhatsApp:</strong> {franchise.whatsappNumber || "-"}
                </div>
                <div className="mb-2">
                  <strong>Platform:</strong>{" "}
                  <span className="badge bg-info">{franchise.platform || "-"}</span>
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge bg-${
                      franchise.accountStatus === "active"
                        ? "success"
                        : franchise.accountStatus === "suspended"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {franchise.accountStatus || "inactive"}
                  </span>
                </div>
              </div>

              {/* Business Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Business Information</h6>
                <div className="mb-2">
                  <strong>Business Partner Code:</strong> {franchise.businessPartnerCode || "-"}
                </div>
                <div className="mb-2">
                  <strong>PAN:</strong> {franchise.pan || "-"}
                </div>
                <div className="mb-2">
                  <strong>GSTIN:</strong> {franchise.gstin || "-"}
                </div>
                <div className="mb-2">
                  <strong>Designation:</strong> {franchise.designation || "-"}
                </div>
                <div className="mb-2">
                  <strong>Zone:</strong> {franchise.zone || "-"}
                </div>
                <div className="mb-2">
                  <strong>Franchise ID:</strong> {franchise.franchiseeId || "-"}
                </div>
              </div>

              {/* Address Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Address Information</h6>
                <div className="mb-2">
                  <strong>District:</strong> {franchise.district || "-"}
                </div>
                <div className="mb-2">
                  <strong>State:</strong> {franchise.state || "-"}
                </div>
                <div className="mb-2">
                  <strong>City:</strong> {franchise.city || "-"}
                </div>
                <div className="mb-2">
                  <strong>Pincode:</strong> {franchise.pincode || "-"}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Performance Metrics</h6>
                <div className="mb-2">
                  <strong>Total Customers:</strong> {franchise.totalCustomers || 0}
                </div>
                <div className="mb-2">
                  <strong>Total Transactions:</strong> {franchise.totalTransactions || 0}
                </div>
                <div className="mb-2">
                  <strong>Commission Earned:</strong> ₹{franchise.commissionEarned?.toLocaleString() || 0}
                </div>
                <div className="mb-2">
                  <strong>Commission Pending:</strong> ₹{franchise.commissionPending?.toLocaleString() || 0}
                </div>
                <div className="mb-2">
                  <strong>Joined Date:</strong>{" "}
                  {franchise.joinedDate
                    ? new Date(franchise.joinedDate).toLocaleDateString()
                    : franchise.createdAt
                    ? new Date(franchise.createdAt).toLocaleDateString()
                    : "-"}
                </div>
              </div>

              {/* Additional Information (for BBSCART franchises) */}
              {(franchise.vendor_fname ||
                franchise.pan_number ||
                franchise.gst_number ||
                franchise.outlet_contact_no ||
                franchise.gst_address ||
                franchise.outlet_location) && (
                <div className="col-12 mb-3">
                  <h6 className="text-primary border-bottom pb-2">Additional BBSCART Information</h6>
                  <div className="row">
                    {franchise.vendor_fname && (
                      <div className="col-md-6 mb-2">
                        <strong>Vendor First Name:</strong> {franchise.vendor_fname}
                      </div>
                    )}
                    {franchise.vendor_lname && (
                      <div className="col-md-6 mb-2">
                        <strong>Vendor Last Name:</strong> {franchise.vendor_lname}
                      </div>
                    )}
                    {franchise.outlet_manager_name && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Manager:</strong> {franchise.outlet_manager_name}
                      </div>
                    )}
                    {franchise.outlet_contact_no && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Contact:</strong> {franchise.outlet_contact_no}
                      </div>
                    )}
                    {franchise.application_status && (
                      <div className="col-md-6 mb-2">
                        <strong>Application Status:</strong>{" "}
                        <span className="badge bg-info">{franchise.application_status}</span>
                      </div>
                    )}
                    {franchise.gst_legal_name && (
                      <div className="col-md-6 mb-2">
                        <strong>GST Legal Name:</strong> {franchise.gst_legal_name}
                      </div>
                    )}
                    {franchise.gst_constitution && (
                      <div className="col-md-6 mb-2">
                        <strong>GST Constitution:</strong> {franchise.gst_constitution}
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
                  <span className={`badge bg-${franchise.actions?.canPromote ? "success" : "secondary"}`}>
                    {franchise.actions?.canPromote ? "Yes" : "No"}
                  </span>
                </div>
                <div className="mb-2">
                  <strong>Can Deactivate:</strong>{" "}
                  <span className={`badge bg-${franchise.actions?.canDeactivate ? "success" : "secondary"}`}>
                    {franchise.actions?.canDeactivate ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* ID Information */}
              <div className="col-12">
                <h6 className="text-primary border-bottom pb-2">System Information</h6>
                <div className="mb-2">
                  <strong>Franchise ID:</strong> <code>{franchise._id}</code>
                </div>
                {franchise._source && (
                  <div className="mb-2">
                    <strong>Source:</strong>{" "}
                    <span className="badge bg-secondary">{franchise._source}</span>
                  </div>
                )}
                {franchise.createdAt && (
                  <div className="mb-2">
                    <strong>Created:</strong> {new Date(franchise.createdAt).toLocaleString()}
                  </div>
                )}
                {franchise.updatedAt && (
                  <div className="mb-2">
                    <strong>Last Updated:</strong> {new Date(franchise.updatedAt).toLocaleString()}
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

export default ViewFranchiseModal;
