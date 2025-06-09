// // src/components/CustomerFilterBar.jsx
// import React, { useState } from "react";

// const CustomerFilterBar = ({ customers, setFilteredCustomers }) => {
//   const [search, setSearch] = useState("");
//   const [platform, setPlatform] = useState("");
//   const [status, setStatus] = useState("");
//   const [zone, setZone] = useState("");

//   const uniquePlatforms = [...new Set(customers.map((a) => a.platform))];
//   const uniqueZones = [...new Set(customers.map((a) => a.zone).filter(Boolean))];

//   const handleFilter = () => {
//     let filtered = [...customers];

//     if (search) {
//       filtered = filtered.filter(
//         (customer) =>
//           customer.name.toLowerCase().includes(search.toLowerCase()) ||
//           customer.email.toLowerCase().includes(search.toLowerCase()) ||
//           customer.phone.includes(search)
//       );
//     }

//     if (platform) {
//       filtered = filtered.filter((customer) => customer.platform === platform);
//     }

//     if (status) {
//       filtered = filtered.filter((customer) => customer.accountStatus === status);
//     }

//     if (zone) {
//       filtered = filtered.filter((customer) => customer.zone === zone);
//     }

//     setFilteredCustomers(filtered);
//   };

//   return (
//     <div className="row mb-3">
//       <div className="col-md-3 mb-2">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search name/email/phone"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       <div className="col-md-2 mb-2">
//         <select
//           className="form-select"
//           value={platform}
//           onChange={(e) => setPlatform(e.target.value)}
//         >
//           <option key="all-platforms" value="">
//             All Platforms
//           </option>{" "}
//           {uniquePlatforms.map((p) => (
//             <option key={p} value={p}>
//               {p}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="col-md-2 mb-2">
//         <select
//           className="form-select"
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//         >
//           <option key="all-status" value="">
//             All Status
//           </option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//           <option value="suspended">Suspended</option>
//         </select>
//       </div>

//       <div className="col-md-2 mb-2">
//         <select
//           className="form-select"
//           value={zone}
//           onChange={(e) => setZone(e.target.value)}
//         >
//           <option key="all-zones" value="">
//             All Zones
//           </option>{" "}
//           {uniqueZones.map((z) => (
//             <option key={z} value={z}>
//               {z}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="col-md-3 mb-2">
//         <button className="btn btn-secondary w-100" onClick={handleFilter}>
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CustomerFilterBar;
// CustomerFilterBar.jsx
import React, { useState } from "react";

const CustomerFilterBar = ({ customers, setFilteredCustomers }) => {
  const [search,   setSearch]   = useState("");
  const [platform, setPlatform] = useState("");
  const [status,   setStatus]   = useState("");
  const [zone,     setZone]     = useState("");

  // 1) Gather only truthy, unique platform & zone values
  const uniquePlatforms = Array.from(
    new Set(customers.map((c) => c.platform).filter((p) => !!p))
  );
  const uniqueZones = Array.from(
    new Set(customers.map((c) => c.zone).filter((z) => !!z))
  );

  const handleFilter = () => {
    let filtered = [...customers];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(search)
      );
    }
    if (platform) filtered = filtered.filter((c) => c.platform === platform);
    if (status)   filtered = filtered.filter((c) => c.accountStatus === status);
    if (zone)     filtered = filtered.filter((c) => c.zone === zone);

    setFilteredCustomers(filtered);
  };

  return (
    <div className="row mb-3">
      {/* Search Box */}
      <div className="col-md-3 mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search name/email/phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Platform Filter */}
      <div className="col-md-2 mb-2">
        <select
          className="form-select"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option key="all-platforms" value="">
            All Platforms
          </option>
          {uniquePlatforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="col-md-2 mb-2">
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option key="all-status" value="">
            All Status
          </option>
          <option key="status-active"   value="active">Active</option>
          <option key="status-inactive" value="inactive">Inactive</option>
          <option key="status-suspended" value="suspended">Suspended</option>
        </select>
      </div>

      {/* Zone Filter */}
      <div className="col-md-2 mb-2">
        <select
          className="form-select"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        >
          <option key="all-zones" value="">
            All Zones
          </option>
          {uniqueZones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>
      </div>

      {/* Apply */}
      <div className="col-md-3 mb-2">
        <button className="btn btn-secondary w-100" onClick={handleFilter}>
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default CustomerFilterBar;
