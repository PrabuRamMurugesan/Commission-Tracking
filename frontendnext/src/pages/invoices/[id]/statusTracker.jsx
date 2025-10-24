import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../src/api/axiosInstance";
const StatusTrackerPage = () => {
  const navigate = useNavigate();

  const { invoiceId } = useParams();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("📦 invoiceId param received:", invoiceId); // ✅ Log

  useEffect(() => {
    const fetchInvoiceStatus = async () => {
      try {
        const res = await axiosInstance.get(
          `/invoices/${invoiceId}/statusTracker`
        );
        console.log("✅ Fetched Status Data:", res.data);

        setInvoiceData(res.data);
      } catch (err) {
        console.error("Error fetching status tracker data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (invoiceId) fetchInvoiceStatus();
  }, [invoiceId]);

  if (loading)
    return <p className="text-center">Loading Invoice Status Tracker...</p>;

  if (!invoiceData)
    return <p className="text-center text-red-500">No data found.</p>;

  const {
    invoiceNumber,
    platform,
    customerName,
    invoiceDate,
    total,
    escrowStatus,
    paymentStatus,
    overallProgress,
    statusTimeline,
    gstBreakdown,
  } = invoiceData;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Invoice Status Tracker</h2>

      {/* Top Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border p-4 rounded">
        <div>
          <strong>Invoice ID:</strong> {invoiceNumber}
        </div>
        <div>
          <strong>Platform:</strong> {platform}
        </div>
        <div>
          <strong>Customer:</strong> {customerName}
        </div>
        <div>
          <strong>Invoice Date:</strong>{" "}
          {new Date(invoiceDate).toLocaleDateString()}
        </div>
        <div>
          <strong>Total:</strong> ₹{total}
        </div>
        <div>
          <strong>Escrow Status:</strong> {escrowStatus}
        </div>
        <div>
          <strong>Payment Status:</strong> {paymentStatus}
        </div>
        <div className="col-span-full">
          <strong>Progress:</strong>
          <div className="w-full bg-gray-300 h-3 rounded mt-1">
            <div
              className="bg-green-500 h-3 rounded"
              style={{ width: `${overallProgress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Status Timeline</h3>
        <ul className="space-y-2 border-l-2 border-blue-500 pl-4">
          {statusTimeline.map((step, idx) => (
            <li key={idx}>
              <p>
                <strong>{step.status}</strong> —{" "}
                <span className="text-gray-600">
                  {new Date(step.date).toLocaleDateString()}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* GST Breakdown */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">GST Tax Breakdown</h3>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Item</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">CGST</th>
              <th className="border p-2">SGST</th>
              <th className="border p-2">IGST</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {gstBreakdown?.items?.length > 0 &&
              gstBreakdown.items.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.quantity}</td>
                  <td className="border p-2">₹{item.rate}</td>
                  <td className="border p-2">₹{item.cgst || 0}</td>
                  <td className="border p-2">₹{item.sgst || 0}</td>
                  <td className="border p-2">₹{item.igst || 0}</td>
                  <td className="border p-2">
                    ₹
                    {item.quantity * item.rate +
                      (item.cgst || 0) +
                      (item.sgst || 0) +
                      (item.igst || 0)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="text-right mt-4 space-y-1">
          <p>
            <strong>Subtotal:</strong> ₹{gstBreakdown.subtotal}
          </p>
          <p>
            <strong>CGST:</strong> ₹{gstBreakdown.cgst}
          </p>
          <p>
            <strong>SGST:</strong> ₹{gstBreakdown.sgst}
          </p>
          <p>
            <strong>IGST:</strong> ₹{gstBreakdown.igst}
          </p>
          <p className="font-bold text-lg">
            <strong>Grand Total:</strong> ₹{gstBreakdown.grandTotal}
          </p>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Export Timeline (PDF)
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Send to WhatsApp
        </button>
        <button className="bg-gray-700 text-white px-4 py-2 rounded">
          Open Invoice
        </button>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => navigate(`/invoices/${id}/escrowInfo`)}
        >
          View Escrow Info
        </button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded">
          AI Summary
        </button>
      </div>
    </div>
  );
};

export default StatusTrackerPage;
