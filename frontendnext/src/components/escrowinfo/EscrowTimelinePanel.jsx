// /components/escrowinfo/EscrowTimelinePanel.jsx
import React from "react";

const EscrowTimelinePanel = ({ timeline }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">
        Escrow Timeline
      </h3>

      {timeline?.length > 0 ? (
        <ul className="space-y-4">
          {timeline.map((entry, index) => (
            <li key={index} className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm font-medium">
                ✅ <span className="font-semibold">{entry.status}</span> —{" "}
                <span className="text-gray-600">
                  {new Date(entry.date).toLocaleString()}
                </span>
              </p>
              {entry.notes && (
                <p className="text-sm text-gray-700 mt-1">📝 {entry.notes}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">
          No timeline history available.
        </p>
      )}
    </div>
  );
};

export default EscrowTimelinePanel;
