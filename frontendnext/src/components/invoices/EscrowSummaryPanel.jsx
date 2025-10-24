import React from "react";

const EscrowSummaryPanel = ({ summary }) => {
  if (!summary) return <div>No summary available.</div>;

  const {
    invoiceId,
    platform,
    reference,
    amount,
    percentage,
    walletLedgerRef,
    startDate,
    expectedReleaseDate,
    status,
  } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <strong>Invoice ID:</strong> {invoiceId || "N/A"}
      </div>
      <div>
        <strong>Platform:</strong> {platform || "N/A"}
      </div>
      <div>
        <strong>Reference:</strong> {reference || "N/A"}
      </div>
      <div>
        <strong>Escrow Amount:</strong> ₹{amount?.toFixed(2) || "0.00"}
      </div>
      <div>
        <strong>Escrow %:</strong> {percentage || "0"}%
      </div>
      <div>
        <strong>Wallet Ledger Ref:</strong> {walletLedgerRef || "N/A"}
      </div>
      <div>
        <strong>Start Date:</strong>{" "}
        {startDate ? new Date(startDate).toLocaleDateString() : "N/A"}
      </div>
      <div>
        <strong>Expected Release:</strong>{" "}
        {expectedReleaseDate
          ? new Date(expectedReleaseDate).toLocaleDateString()
          : "N/A"}
      </div>
      <div className="col-span-full">
        <strong>Status:</strong>{" "}
        <span className="font-semibold text-blue-600">{status || "N/A"}</span>
      </div>
    </div>
  );
};

export default EscrowSummaryPanel;
