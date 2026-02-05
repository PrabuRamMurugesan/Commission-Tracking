import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EscrowInfo = () => {
  const { id } = useParams();
  console.log(id, "invoiceId");

  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvoice = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const res = await axios.get(`/api/invoices/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInvoice(res.data.invoice);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("Failed to load invoice data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading)
    return <div className="text-center mt-5">Loading escrow info...</div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  if (!invoice)
    return <div className="alert alert-warning mt-5">No invoice found.</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="card">
        <div className="card-header bg-dark text-white">
          <h4>Invoice Escrow Information</h4>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Invoice Number:</strong> {invoice.invoiceNumber}
            </div>
            <div className="col-md-6">
              <strong>Invoice Date:</strong>{" "}
              {new Date(invoice.invoiceDate).toLocaleDateString()}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Buyer Name:</strong> {invoice.buyerName}
            </div>
            <div className="col-md-6">
              <strong>Seller Name:</strong> {invoice.sellerName}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Use Escrow:</strong>{" "}
              <span
                className={invoice.useEscrow ? "text-success" : "text-danger"}
              >
                {invoice.useEscrow ? "Yes" : "No"}
              </span>
            </div>
            <div className="col-md-6">
              <strong>Payment Mode:</strong> {invoice.paymentMode}
            </div>
          </div>

          {invoice.useEscrow && (
            <>
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>Escrow Held Amount:</strong> ₹{invoice.escrowHeld}
                </div>
                <div className="col-md-6">
                  <strong>Escrow Released:</strong> No (or fetch from Escrow
                  collection if needed)
                </div>
              </div>
            </>
          )}

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Amount Paid:</strong> ₹{invoice.amountPaid}
            </div>
            <div className="col-md-6">
              <strong>Wallet Paid:</strong> ₹{invoice.walletPaid}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Payment Ref. ID:</strong>{" "}
              {invoice.paymentReferenceId || "-"}
            </div>
            <div className="col-md-6">
              <strong>Payment Date:</strong>{" "}
              {new Date(invoice.paymentDate).toLocaleDateString()}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Notes:</strong> {invoice.notes || "-"}
            </div>
            <div className="col-md-6">
              <strong>Terms:</strong> {invoice.terms || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscrowInfo;
