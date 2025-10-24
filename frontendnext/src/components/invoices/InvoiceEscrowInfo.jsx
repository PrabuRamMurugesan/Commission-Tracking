import React from "react";
import useEscrowInfo from "../../hooks/useEscrowInfo";
import EscrowSummaryPanel from "./EscrowSummaryPanel";
import EscrowTimelinePanel from "../../components/escrowinfo/EscrowTimelinePanel";

const InvoiceEscrowInfo = ({ invoiceId }) => {
  const { loading, error, escrowData } = useEscrowInfo(invoiceId);

  if (loading) {
    return <div>Loading escrow info...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">Error fetching escrow info: {error}</div>
    );
  }

  if (!escrowData || !escrowData.summary) {
    return <div>No escrow information available for this invoice.</div>;
  }

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4">
        Escrow Info - Invoice #{escrowData.summary.invoiceId}
      </h2>

      {/* Summary Section */}
      <EscrowSummaryPanel summary={escrowData.summary} />

      <hr className="my-6" />

      {/* Timeline Section */}
      <h3 className="text-xl font-semibold mb-2">Escrow Timeline</h3>
      <EscrowTimelinePanel timeline={escrowData.timeline} />
    </div>
  );
};

export default InvoiceEscrowInfo;
