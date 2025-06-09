import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // Or use router.query if using Next.js routing

const InvoiceDetailsPage = () => {
  const [invoice, setInvoice] = useState(null);
  const { id } = useParams(); // Or const { id } = router.query;

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`/api/invoices/${id}`);
        
        if (res.data.success) {
          setInvoice(res.data.data);
          console.log(res.data.data, "response for the Details");

        }
      } catch (err) {
        console.error("Error loading invoice:", err.message);
      }
    };

    fetchInvoice();
  }, [id]);

  if (!invoice)
    return <div className="container mt-5">Loading invoice details...</div>;

  const {
    buyer,
    seller,
    items,
    payment,
    totalAmount,
    totalGST,
    grandTotal,
    createdBy,
    notes,
    invoiceNumber,
    invoiceDate,
    platform,
    status,
  } = invoice;

  return (
    <div className="container mt-5">
      <h3>
        Invoice ID: {invoiceNumber}{" "}
        <span className="badge bg-warning text-dark">{status}</span>
      </h3>

      <div className="row mt-3">
        <div className="col-md-6">
          <h5>Invoice Info</h5>
          <p>
            <strong>Date:</strong> {invoiceDate}
          </p>
          <p>
            <strong>Platform:</strong> {platform}
          </p>
          <p>
            <strong>Created By:</strong> {createdBy?.role || "Admin"}
          </p>
        </div>

        <div className="col-md-6">
          <h5>Customer & Vendor Details</h5>
          <p>
            <strong>Buyer:</strong> {buyer?.name}
          </p>
          <p>
            <strong>GSTIN:</strong> {buyer?.gstin}
          </p>
          <p>
            <strong>State:</strong> {buyer?.state}
          </p>
          <p>
            <strong>Seller:</strong> {seller?.name}
          </p>
          <p>
            <strong>GSTIN:</strong> {seller?.gstin}
          </p>
          <p>
            <strong>State:</strong> {seller?.state}
          </p>
        </div>
      </div>

      <hr />

      <h5>Items / Services</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>HSN Code</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Tax %</th>
            <th>Tax ₹</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const gstPercent =
              (item.cgst || 0) + (item.sgst || 0) + (item.igst || 0);
            const gstAmount = (item.amount * gstPercent) / 100;
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.name}</td>
                <td>{item.hsn}</td>
                <td>1</td>
                <td>₹{item.amount}</td>
                <td>{gstPercent}%</td>
                <td>₹{gstAmount.toFixed(2)}</td>
                <td>₹{(item.amount + gstAmount).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <hr />
      <h5>Payment Summary & GST Breakdown</h5>
      <ul className="list-group mb-3">
        <li className="list-group-item d-flex justify-content-between">
          <strong>Subtotal</strong> ₹{totalAmount}
        </li>
        <li className="list-group-item d-flex justify-content-between">
          Total GST ₹{totalGST}
        </li>
        <li className="list-group-item d-flex justify-content-between fw-bold">
          Grand Total ₹{grandTotal}
        </li>
        <li className="list-group-item d-flex justify-content-between">
          Paid ₹{payment?.amountPaid}
        </li>
        <li className="list-group-item d-flex justify-content-between">
          Escrow: {payment?.isEscrow ? "Yes" : "No"} | Partial:{" "}
          {payment?.isPartialPayment ? "Yes" : "No"}
        </li>
      </ul>

      <h5>Terms & Notes</h5>
      <p>{notes || "No additional notes."}</p>

      <div className="mt-4">
        <button className="btn btn-outline-primary me-2">
          View GST Breakdown
        </button>
        <button className="btn btn-outline-info me-2">Wallet History</button>
        <button className="btn btn-outline-success me-2">
          Customer Invoice
        </button>
        <button className="btn btn-warning me-2">AI Suggest Action</button>
        <button className="btn btn-danger">Cancel / Refund</button>
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;
