// src/components/TerritoryHead/ViewTerritoryModal.jsx
import React from "react";

const ViewTerritoryModal = ({ show, onClose, territory }) => {
  if (!show || !territory) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Territory Details</h5>
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
                  <strong>Name:</strong> {territory.name || "-"}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {territory.email || "-"}
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {territory.phone || "-"}
                </div>
                <div className="mb-2">
                  <strong>WhatsApp:</strong> {territory.whatsappNumber || "-"}
                </div>
                <div className="mb-2">
                  <strong>Platform:</strong>{" "}
                  <span className="badge bg-info">{territory.platform || "-"}</span>
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge bg-${
                      territory.accountStatus === "active"
                        ? "success"
                        : territory.accountStatus === "suspended"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {territory.accountStatus || "inactive"}
                  </span>
                </div>
              </div>

              {/* Business Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Business Information</h6>
                <div className="mb-2">
                  <strong>Business Partner Code:</strong> {territory.businessPartnerCode || "-"}
                </div>
                <div className="mb-2">
                  <strong>PAN:</strong> {territory.pan || "-"}
                </div>
                <div className="mb-2">
                  <strong>GSTIN:</strong> {territory.gstin || "-"}
                </div>
                <div className="mb-2">
                  <strong>Designation:</strong> {territory.designation || "-"}
                </div>
                <div className="mb-2">
                  <strong>Zone:</strong> {territory.zone || "-"}
                </div>
                <div className="mb-2">
                  <strong>Franchise ID:</strong> {territory.franchiseeId || "-"}
                </div>
              </div>

              {/* Address Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Address Information</h6>
                <div className="mb-2">
                  <strong>District:</strong> {territory.district || "-"}
                </div>
                <div className="mb-2">
                  <strong>State:</strong> {territory.state || "-"}
                </div>
                <div className="mb-2">
                  <strong>City:</strong> {territory.city || "-"}
                </div>
                <div className="mb-2">
                  <strong>Pincode:</strong> {territory.pincode || "-"}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Performance Metrics</h6>
                <div className="mb-2">
                  <strong>Total Customers:</strong> {territory.totalCustomers || 0}
                </div>
                <div className="mb-2">
                  <strong>Total Transactions:</strong> {territory.totalTransactions || 0}
                </div>
                <div className="mb-2">
                  <strong>Commission Earned:</strong> ₹{territory.commissionEarned?.toLocaleString() || 0}
                </div>
                <div className="mb-2">
                  <strong>Commission Pending:</strong> ₹{territory.commissionPending?.toLocaleString() || 0}
                </div>
                <div className="mb-2">
                  <strong>Joined Date:</strong>{" "}
                  {territory.joinedDate
                    ? new Date(territory.joinedDate).toLocaleDateString()
                    : territory.createdAt
                    ? new Date(territory.createdAt).toLocaleDateString()
                    : "-"}
                </div>
              </div>

              {/* Additional Information (for BBSCART territories) */}
              {(territory.vendor_fname ||
                territory.pan_number ||
                territory.gst_number ||
                territory.outlet_contact_no ||
                territory.gst_address ||
                territory.outlet_location) && (
                <div className="col-12 mb-3">
                  <h6 className="text-primary border-bottom pb-2">Additional BBSCART Information</h6>
                  <div className="row">
                    {territory.vendor_fname && (
                      <div className="col-md-6 mb-2">
                        <strong>Vendor First Name:</strong> {territory.vendor_fname}
                      </div>
                    )}
                    {territory.vendor_lname && (
                      <div className="col-md-6 mb-2">
                        <strong>Vendor Last Name:</strong> {territory.vendor_lname}
                      </div>
                    )}
                    {territory.outlet_manager_name && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Manager:</strong> {territory.outlet_manager_name}
                      </div>
                    )}
                    {territory.outlet_contact_no && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Contact:</strong> {territory.outlet_contact_no}
                      </div>
                    )}
                    {territory.application_status && (
                      <div className="col-md-6 mb-2">
                        <strong>Application Status:</strong>{" "}
                        <span className="badge bg-info">{territory.application_status}</span>
                      </div>
                    )}
                    {territory.gst_legal_name && (
                      <div className="col-md-6 mb-2">
                        <strong>GST Legal Name:</strong> {territory.gst_legal_name}
                      </div>
                    )}
                    {territory.gst_constitution && (
                      <div className="col-md-6 mb-2">
                        <strong>GST Constitution:</strong> {territory.gst_constitution}
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
                  <span className={`badge bg-${territory.actions?.canPromote ? "success" : "secondary"}`}>
                    {territory.actions?.canPromote ? "Yes" : "No"}
                  </span>
                </div>
                <div className="mb-2">
                  <strong>Can Deactivate:</strong>{" "}
                  <span className={`badge bg-${territory.actions?.canDeactivate ? "success" : "secondary"}`}>
                    {territory.actions?.canDeactivate ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* ID Information */}
              <div className="col-12">
                <h6 className="text-primary border-bottom pb-2">System Information</h6>
                <div className="mb-2">
                  <strong>Territory ID:</strong> <code>{territory._id}</code>
                </div>
                {territory._source && (
                  <div className="mb-2">
                    <strong>Source:</strong>{" "}
                    <span className="badge bg-secondary">{territory._source}</span>
                  </div>
                )}
                {territory.createdAt && (
                  <div className="mb-2">
                    <strong>Created:</strong> {new Date(territory.createdAt).toLocaleString()}
                  </div>
                )}
                {territory.updatedAt && (
                  <div className="mb-2">
                    <strong>Last Updated:</strong> {new Date(territory.updatedAt).toLocaleString()}
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

export default ViewTerritoryModal;
