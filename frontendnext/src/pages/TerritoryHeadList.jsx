// // src/pages/TerritoryList.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import TerritoryTable from "../components/TerritoryHead/TerritoryTable";
// import TerritoryFilterBar from "../components/TerritoryHead/TerritoryFilterBar";
// import AddTerritoryModal from "../components/TerritoryHead/AddTerritoryHeadModal";
// import ToastMessage from "../components/ToastMessage";
// import { exportAgentsToCSV } from "../utils/exportHelpers";
// const TerritoryHeadList = () => {
//   const [territory, setTerritory] = useState([]);
//   const [filteredTerritory, setFilteredTerritory] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: "", type: "" });
//   const [loading, setLoading] = useState(true);

//   const currentUser = JSON.parse(localStorage.getItem("user"));

//   const fetchTerritory = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/territory", {
//         params: {
//           franchiseeId:
//             currentUser?.role === "franchise" ? currentUser.id : undefined,
//         },
//       });
//       setTerritory(res.data.territory);
//       setFilteredTerritory(res.data.territory);
//       setLoading(false);
//     } catch (err) {
//       console.error("Error loading Territory:", err);
//       setToast({ show: true, message: "Failed to load Territory", type: "error" });
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTerritory();
//   }, []);

//   const handleAddSuccess = () => {
//     fetchTerritory();
//     setToast({
//       show: true,
//       message: "Territory saved successfully!",
//       type: "success",
//     });
//     setShowModal(false);
//   };

//   return (
//     <div className="container-fluid mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3>Territory List</h3>
//         <div>
//           <button
//             className="btn btn-primary me-2"
//             onClick={() => setShowModal(true)}
//           >
//             ➕ Add Territory
//           </button>
//           <button className="btn btn-outline-secondary" onClick={fetchTerritory}>
//             🔄 Refresh
//           </button>
//           <button
//             className="btn btn-outline-success"
//             onClick={() => exportAgentsToCSV(filteredTerritory)}
//           >
//             📤 Export CSV
//           </button>
//         </div>
//       </div>

//       <TerritoryFilterBar territory={territory} setFilteredTerritory={setFilteredTerritory} />

//       <TerritoryTable
//         territory={filteredTerritory}
//         loading={loading}
//         refreshList={fetchTerritory}
//         setToast={setToast}
//       />

//       <AddTerritoryModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         onSuccess={handleAddSuccess}
//       />

//       {toast.show && (
//         <ToastMessage
//           message={toast.message}
//           type={toast.type}
//           onClose={() => setToast({ ...toast, show: false })}
//         />
//       )}
//     </div>
//   );
// };

// export default TerritoryHeadList;

// components/TerritoryHeadList.jsx
import React, { useEffect, useState } from "react";

// Pass sourceUrl as prop to reuse in both apps.
// CRM:     <TerritoryHeadList sourceUrl="/api/dashboard/territories" />
// BBSCART: <TerritoryHeadList sourceUrl="/api/territory/dashboard/territories" />
export default function TerritoryHeadList({ sourceUrl = "/api/dashboard/territories" }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(sourceUrl);
        const json = await res.json();
        if (alive && json?.ok) setRows(Array.isArray(json.items) ? json.items : []);
      } catch (e) {
        console.error("territories fetch error:", e);
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [sourceUrl]);

  const ActionButtons = () => (
    <div className="flex gap-2">
      <button className="px-2 py-1 border rounded">View</button>
      <button className="px-2 py-1 border rounded">Promote</button>
      <button className="px-2 py-1 border rounded text-red-600">Deactivate</button>
    </div>
  );

  const Row = ({ r, i }) => (
    <tr className="border-t">
      <td className="p-2">{i + 1}</td>
      <td className="p-2">{r.territoryId || ""}</td>
      <td className="p-2">{r.name || ""}</td>
      <td className="p-2">{r.pan || ""}</td>
      <td className="p-2">{r.gst || ""}</td>
      <td className="p-2">{r.email || ""}</td>
      <td className="p-2">{r.phone || ""}</td>
      <td className="p-2">{r.bpc || ""}</td>
      <td className="p-2">{r.platform || "BBSCART"}</td>
      <td className="p-2">{r.state || ""}</td>
      <td className="p-2">{r.district || ""}</td>
      <td className="p-2">{r.city || ""}</td>
      <td className="p-2 text-right">{Number(r.customers || 0)}</td>
      <td className="p-2 text-right">{Number(r.transactions || 0)}</td>
      <td className="p-2 text-right">{r.earnedFmt || "₹0"}</td>
      <td className="p-2 text-right">{r.pendingFmt || "₹0"}</td>
      <td className="p-2">{r.joinedFmt || "Invalid Date"}</td>
      <td className="p-2"><ActionButtons /></td>
    </tr>
  );

  // Always render 6 rows; if fewer real rows, show empty rows with action buttons too.
  const visible = rows.slice(0, 6);
  const fillers = Array.from({ length: Math.max(0, 6 - visible.length) }, (_, k) => ({
    _id: `filler-${k}`, territoryId: "", name: "", pan: "", gst: "",
    email: "", phone: "", bpc: "", platform: "", state: "", district: "",
    city: "", customers: 0, transactions: 0, earnedFmt: "₹0", pendingFmt: "₹0", joinedFmt: "Invalid Date"
  }));

  return (
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Territory ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">PAN</th>
            <th className="p-2 text-left">GSTIN</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Phone</th>
            <th className="p-2 text-left">BPC</th>
            <th className="p-2 text-left">Platform</th>
            <th className="p-2 text-left">State</th>
            <th className="p-2 text-left">District</th>
            <th className="p-2 text-left">City</th>
            <th className="p-2 text-right">Customers</th>
            <th className="p-2 text-right">Transactions</th>
            <th className="p-2 text-right">Earned</th>
            <th className="p-2 text-right">Pending</th>
            <th className="p-2 text-left">Joined</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td className="p-4" colSpan={18}>Loading…</td></tr>
          ) : (
            <>
              {visible.map((r, i) => <Row r={r} i={i} key={r._id || i} />)}
              {fillers.map((r, k) => <Row r={r} i={visible.length + k} key={r._id} />)}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
