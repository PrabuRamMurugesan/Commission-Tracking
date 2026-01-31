// src/components/Cbv/ViewCBVModal.jsx
import React from "react";

const ViewCBVModal = ({ show, onClose, cbv }) => {
  if (!show || !cbv) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">CBV Details</h5>
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
                  <strong>Name:</strong> {cbv.name || "-"}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {cbv.email || "-"}
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {cbv.phone || "-"}
                </div>
                <div className="mb-2">
                  <strong>WhatsApp:</strong> {cbv.whatsappNumber || "-"}
                </div>
                <div className="mb-2">
                  <strong>Platform:</strong>{" "}
                  <span className="badge bg-info">{cbv.platform || "-"}</span>
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge bg-${
                      cbv.accountStatus === "active"
                        ? "success"
                        : cbv.accountStatus === "suspended"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {cbv.accountStatus || "inactive"}
                  </span>
                </div>
              </div>

              {/* Business Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Business Information</h6>
                <div className="mb-2">
                  <strong>Business Partner Code:</strong> {cbv.businessPartnerCode || "-"}
                </div>
                <div className="mb-2">
                  <strong>PAN:</strong> {cbv.pan || "-"}
                </div>
                <div className="mb-2">
                  <strong>GSTIN:</strong> {cbv.gstin || "-"}
                </div>
                <div className="mb-2">
                  <strong>Designation:</strong> {cbv.designation || "-"}
                </div>
                <div className="mb-2">
                  <strong>Zone:</strong> {cbv.zone || "-"}
                </div>
                <div className="mb-2">
                  <strong>Franchise ID:</strong> {cbv.franchiseeId || "-"}
                </div>
              </div>

              {/* Address Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Address Information</h6>
                <div className="mb-2">
                  <strong>District:</strong> {cbv.district || "-"}
                </div>
                <div className="mb-2">
                  <strong>State:</strong> {cbv.state || "-"}
                </div>
                <div className="mb-2">
                  <strong>City:</strong> {cbv.city || "-"}
                </div>
                <div className="mb-2">
                  <strong>Pincode:</strong> {cbv.pincode || "-"}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Performance Metrics</h6>
                <div className="mb-2">
                  <strong>Total Customers:</strong> {cbv.totalCustomers || 0}
                </div>
                <div className="mb-2">
                  <strong>Total Transactions:</strong> {cbv.totalTransactions || 0}
                </div>
                <div className="mb-2">
                  <strong>Commission Earned:</strong> ₹{cbv.commissionEarned?.toLocaleString() || 0}
                </div>
                <div className="mb-2">
                  <strong>Commission Pending:</strong> ₹{cbv.commissionPending?.toLocaleString() || 0}
                </div>
                <div className="mb-2">
                  <strong>Joined Date:</strong>{" "}
                  {cbv.joinedDate
                    ? new Date(cbv.joinedDate).toLocaleDateString()
                    : cbv.createdAt
                    ? new Date(cbv.createdAt).toLocaleDateString()
                    : "-"}
                </div>
              </div>

              {/* Additional Information (for BBSCART CBVs) */}
              {(cbv.vendor_fname ||
                cbv.pan_number ||
                cbv.gst_number ||
                cbv.outlet_contact_no ||
                cbv.gst_address ||
                cbv.outlet_location) && (
                <div className="col-12 mb-3">
                  <h6 className="text-primary border-bottom pb-2">Additional BBSCART Information</h6>
                  <div className="row">
                    {cbv.vendor_fname && (
                      <div className="col-md-6 mb-2">
                        <strong>Vendor First Name:</strong> {cbv.vendor_fname}
                      </div>
                    )}
                    {cbv.vendor_lname && (
                      <div className="col-md-6 mb-2">
                        <strong>Vendor Last Name:</strong> {cbv.vendor_lname}
                      </div>
                    )}
                    {cbv.outlet_manager_name && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Manager:</strong> {cbv.outlet_manager_name}
                      </div>
                    )}
                    {cbv.outlet_name && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Name:</strong> {cbv.outlet_name}
                      </div>
                    )}
                    {cbv.outlet_contact_no && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Contact:</strong> {cbv.outlet_contact_no}
                      </div>
                    )}
                    {cbv.application_status && (
                      <div className="col-md-6 mb-2">
                        <strong>Application Status:</strong>{" "}
                        <span className="badge bg-info">{cbv.application_status}</span>
                      </div>
                    )}
                    {cbv.gst_legal_name && (
                      <div className="col-md-6 mb-2">
                        <strong>GST Legal Name:</strong> {cbv.gst_legal_name}
                      </div>
                    )}
                    {cbv.gst_constitution && (
                      <div className="col-md-6 mb-2">
                        <strong>GST Constitution:</strong> {cbv.gst_constitution}
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
                  <span className={`badge bg-${cbv.actions?.canPromote ? "success" : "secondary"}`}>
                    {cbv.actions?.canPromote ? "Yes" : "No"}
                  </span>
                </div>
                <div className="mb-2">
                  <strong>Can Deactivate:</strong>{" "}
                  <span className={`badge bg-${cbv.actions?.canDeactivate ? "success" : "secondary"}`}>
                    {cbv.actions?.canDeactivate ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* ID Information */}
              <div className="col-12">
                <h6 className="text-primary border-bottom pb-2">System Information</h6>
                <div className="mb-2">
                  <strong>CBV ID:</strong> <code>{cbv._id}</code>
                </div>
                {cbv._source && (
                  <div className="mb-2">
                    <strong>Source:</strong>{" "}
                    <span className="badge bg-secondary">{cbv._source}</span>
                  </div>
                )}
                {cbv.createdAt && (
                  <div className="mb-2">
                    <strong>Created:</strong> {new Date(cbv.createdAt).toLocaleString()}
                  </div>
                )}
                {cbv.updatedAt && (
                  <div className="mb-2">
                    <strong>Last Updated:</strong> {new Date(cbv.updatedAt).toLocaleString()}
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

export default ViewCBVModal;
