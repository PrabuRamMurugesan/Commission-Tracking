import React from "react";

const AgentCustomerTable = ({ agents, loading, refreshList, setToast }) => {
  return (
    <div className="flex gap-2">
      <button
        className="px-2 py-1 bg-primary text-white rounded text-xs"
        onClick={() =>
          setToast({
            show: true,
            message: "View clicked",
            type: "info",
          })
        }
      >
        👁 View
      </button>
      <button
        className="px-2 py-1 bg-warning text-white rounded text-xs"
        onClick={() =>
          setToast({
            show: true,
            message: "Promote clicked",
            type: "warning",
          })
        }
      >
        ⬆ Promote
      </button>
      <button
        className="px-2 py-1 bg-danger text-white rounded text-xs"
        onClick={() =>
          setToast({
            show: true,
            message: "Deactivated",
            type: "error",
          })
        }
      >
        🛑 Deactivate
      </button>
    </div>
  );
};

export default AgentCustomerTable;
