// src/components/Vendor/ViewVendorModal.jsx
import React from "react";

const ViewVendorModal = ({ show, onClose, vendor }) => {
  if (!show || !vendor) return null;

  return (
    <div className="modal show fade d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Vendor Details</h5>
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
                  <strong>Name:</strong> {vendor.name || "-"}
                </div>
                <div className="mb-2">
                  <strong>Email:</strong> {vendor.email || "-"}
                </div>
                <div className="mb-2">
                  <strong>Phone:</strong> {vendor.phone || "-"}
                </div>
                <div className="mb-2">
                  <strong>WhatsApp:</strong> {vendor.whatsappNumber || "-"}
                </div>
                <div className="mb-2">
                  <strong>Platform:</strong>{" "}
                  <span className="badge bg-info">{vendor.platform || "-"}</span>
                </div>
                <div className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge bg-${
                      vendor.accountStatus === "active"
                        ? "success"
                        : vendor.accountStatus === "suspended"
                        ? "warning"
                        : "secondary"
                    }`}
                  >
                    {vendor.accountStatus || "inactive"}
                  </span>
                </div>
              </div>

              {/* Business Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Business Information</h6>
                <div className="mb-2">
                  <strong>Business Partner Code:</strong> {vendor.businessPartnerCode || "-"}
                </div>
                <div className="mb-2">
                  <strong>PAN:</strong> {vendor.pan || "-"}
                </div>
                <div className="mb-2">
                  <strong>GSTIN:</strong> {vendor.gstin || "-"}
                </div>
                <div className="mb-2">
                  <strong>Designation:</strong> {vendor.designation || "-"}
                </div>
                <div className="mb-2">
                  <strong>Zone:</strong> {vendor.zone || "-"}
                </div>
                <div className="mb-2">
                  <strong>Franchise ID:</strong> {vendor.franchiseeId || "-"}
                </div>
              </div>

              {/* Address Information */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Address Information</h6>
                <div className="mb-2">
                  <strong>District:</strong> {vendor.district || "-"}
                </div>
                <div className="mb-2">
                  <strong>State:</strong> {vendor.state || "-"}
                </div>
                <div className="mb-2">
                  <strong>City:</strong> {vendor.city || "-"}
                </div>
                <div className="mb-2">
                  <strong>Pincode:</strong> {vendor.pincode || "-"}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="col-md-6 mb-3">
                <h6 className="text-primary border-bottom pb-2">Performance Metrics</h6>
                <div className="mb-2">
                  <strong>Total Customers:</strong> {vendor.totalCustomers || 0}
                </div>
                <div className="mb-2">
                  <strong>Total Transactions:</strong> {vendor.totalTransactions || 0}
                </div>
                <div className="mb-2">
                  <strong>Commission Earned:</strong> ₹{vendor.commissionEarned?.toLocaleString() || 0}
                </div>
                <div className="mb-2">
                  <strong>Commission Pending:</strong> ₹{vendor.commissionPending?.toLocaleString() || 0}
                </div>
                <div className="mb-2">
                  <strong>Joined Date:</strong>{" "}
                  {vendor.joinedDate
                    ? new Date(vendor.joinedDate).toLocaleDateString()
                    : vendor.createdAt
                    ? new Date(vendor.createdAt).toLocaleDateString()
                    : "-"}
                </div>
              </div>

              {/* Additional Information (for BBSCART vendors) */}
              {(vendor.vendor_fname ||
                vendor.pan_number ||
                vendor.gst_number ||
                vendor.outlet_contact_no ||
                vendor.gst_address ||
                vendor.outlet_location) && (
                <div className="col-12 mb-3">
                  <h6 className="text-primary border-bottom pb-2">Additional BBSCART Information</h6>
                  <div className="row">
                    {vendor.vendor_fname && (
                      <div className="col-md-6 mb-2">
                        <strong>Vendor First Name:</strong> {vendor.vendor_fname}
                      </div>
                    )}
                    {vendor.vendor_lname && (
                      <div className="col-md-6 mb-2">
                        <strong>Vendor Last Name:</strong> {vendor.vendor_lname}
                      </div>
                    )}
                    {vendor.outlet_manager_name && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Manager:</strong> {vendor.outlet_manager_name}
                      </div>
                    )}
                    {vendor.outlet_contact_no && (
                      <div className="col-md-6 mb-2">
                        <strong>Outlet Contact:</strong> {vendor.outlet_contact_no}
                      </div>
                    )}
                    {vendor.application_status && (
                      <div className="col-md-6 mb-2">
                        <strong>Application Status:</strong>{" "}
                        <span className="badge bg-info">{vendor.application_status}</span>
                      </div>
                    )}
                    {vendor.gst_legal_name && (
                      <div className="col-md-6 mb-2">
                        <strong>GST Legal Name:</strong> {vendor.gst_legal_name}
                      </div>
                    )}
                    {vendor.gst_constitution && (
                      <div className="col-md-6 mb-2">
                        <strong>GST Constitution:</strong> {vendor.gst_constitution}
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
                  <span className={`badge bg-${vendor.actions?.canPromote ? "success" : "secondary"}`}>
                    {vendor.actions?.canPromote ? "Yes" : "No"}
                  </span>
                </div>
                <div className="mb-2">
                  <strong>Can Deactivate:</strong>{" "}
                  <span className={`badge bg-${vendor.actions?.canDeactivate ? "success" : "secondary"}`}>
                    {vendor.actions?.canDeactivate ? "Yes" : "No"}
                  </span>
                </div>
              </div>

              {/* ID Information */}
              <div className="col-12">
                <h6 className="text-primary border-bottom pb-2">System Information</h6>
                <div className="mb-2">
                  <strong>Vendor ID:</strong> <code>{vendor._id}</code>
                </div>
                {vendor._source && (
                  <div className="mb-2">
                    <strong>Source:</strong>{" "}
                    <span className="badge bg-secondary">{vendor._source}</span>
                  </div>
                )}
                {vendor.createdAt && (
                  <div className="mb-2">
                    <strong>Created:</strong> {new Date(vendor.createdAt).toLocaleString()}
                  </div>
                )}
                {vendor.updatedAt && (
                  <div className="mb-2">
                    <strong>Last Updated:</strong> {new Date(vendor.updatedAt).toLocaleString()}
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

export default ViewVendorModal;
