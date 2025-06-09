// // File: frontend/pages/AdminTaxSettingsPage.jsx

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AdminTaxSettingsPage = () => {
//   const [taxRates, setTaxRates] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     categorySlug: "",
//     gstRate: "",
//     type: "Fixed",
//     applicableTo: [],
//     cgst: 0,
//     sgst: 0,
//     igst: 0,
//   });

//   const fetchTaxRates = async () => {
//     const res = await axios.get("/api/tax-rates");
//     setTaxRates(res.data.data);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     if (type === "checkbox") {
//       const updated = checked
//         ? [...form.applicableTo, value]
//         : form.applicableTo.filter((v) => v !== value);
//       setForm({ ...form, applicableTo: updated });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("/api/tax-rates", form);
//       setForm({
//         name: "",
//         categorySlug: "",
//         gstRate: "",
//         type: "Fixed",
//         applicableTo: [],
//         cgst: 0,
//         sgst: 0,
//         igst: 0,
//       });
//       fetchTaxRates();
//     } catch (error) {
//       alert(error.response?.data?.message || "Something went wrong");
//     }
//   };

//   useEffect(() => {
//     fetchTaxRates();
//   }, []);

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">GST Tax Settings</h2>
//       <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded">
//         <div className="mb-2">
//           <label>Category Name</label>
//           <select
//             className="form-control"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Category</option>
//             <option>Gold</option>
//             <option>Grocery</option>
//             <option>Electronics</option>
//             <option>Commission</option>
//             <option>Delivery</option>
//             <option>Spa</option>
//             <option>Food</option>
//             <option>Subscription</option>
//             <option>ResumeService</option>
//             <option>Other</option>
//           </select>
//         </div>

//         <div className="mb-2">
//           <label>Slug</label>
//           <input
//             className="form-control"
//             name="categorySlug"
//             value={form.categorySlug}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-2">
//           <label>GST Rate (%)</label>
//           <input
//             type="number"
//             className="form-control"
//             name="gstRate"
//             value={form.gstRate}
//             onChange={handleChange}
//             required
//           />
//         </div>

//         <div className="mb-2">
//           <label>Type</label>
//           <br />
//           <select
//             name="type"
//             className="form-control"
//             value={form.type}
//             onChange={handleChange}
//           >
//             <option value="Fixed">Fixed</option>
//             <option value="Dynamic">Dynamic</option>
//           </select>
//         </div>

//         <div className="mb-2">
//           <label>Applicable To:</label>
//           <br />
//           {["Product", "Service", "Commission", "Delivery"].map((item) => (
//             <div key={item} className="form-check form-check-inline">
//               <input
//                 className="form-check-input"
//                 type="checkbox"
//                 value={item}
//                 checked={form.applicableTo.includes(item)}
//                 onChange={handleChange}
//               />
//               <label className="form-check-label">{item}</label>
//             </div>
//           ))}
//         </div>

//         <button className="btn btn-primary mt-3" type="submit">
//           Save Tax Rate
//         </button>
//       </form>

//       <h4>All GST Entries</h4>
//       <table className="table table-bordered">
//         <thead>
//           <tr>
//             <th>Category</th>
//             <th>Slug</th>
//             <th>Rate (%)</th>
//             <th>Type</th>
//             <th>Applicable To</th>
//             <th>Created At</th>
//           </tr>
//         </thead>
//         <tbody>
//           {taxRates.map((rate) => (
//             <tr key={rate._id}>
//               <td>{rate.name}</td>
//               <td>{rate.categorySlug}</td>
//               <td>{rate.gstRate}</td>
//               <td>{rate.type}</td>
//               <td>{rate.applicableTo.join(", ")}</td>
//               <td>{new Date(rate.createdAt).toLocaleDateString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminTaxSettingsPage;
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTaxSettingsPage = () => {
  const [taxRates, setTaxRates] = useState([]);
  const [filteredRates, setFilteredRates] = useState([]);
  const [form, setForm] = useState({
    name: "",
    categorySlug: "",
    gstRate: "",
    type: "Fixed",
    applicableTo: [],
    cgst: 0,
    sgst: 0,
    igst: 0,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchTaxRates = async () => {
    const res = await axios.get("/api/tax-rates");
    setTaxRates(res.data.data);
    setFilteredRates(res.data.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const updated = checked
        ? [...form.applicableTo, value]
        : form.applicableTo.filter((v) => v !== value);
      setForm({ ...form, applicableTo: updated });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedId) {
        await axios.put(`/api/tax-rates?id=${selectedId}`, form);
      } else {
        await axios.post("/api/tax-rates", form);
      }
      resetForm();
      fetchTaxRates();
    } catch (error) {
      alert(error.response?.data?.message || "Error saving GST");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      categorySlug: "",
      gstRate: "",
      type: "Fixed",
      applicableTo: [],
      cgst: 0,
      sgst: 0,
      igst: 0,
    });
    setSelectedId(null);
  };

  const handleEdit = (rate) => {
    setForm({
      name: rate.name,
      categorySlug: rate.categorySlug,
      gstRate: rate.gstRate,
      type: rate.type,
      applicableTo: rate.applicableTo,
      cgst: rate.cgst || 0,
      sgst: rate.sgst || 0,
      igst: rate.igst || 0,
    });
    setSelectedId(rate._id);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this GST rate?")) {
      await axios.delete(`/api/tax-rates?id=${id}`);
      fetchTaxRates();
    }
  };

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearch(keyword);
    const filtered = taxRates.filter(
      (rate) =>
        rate.name.toLowerCase().includes(keyword) ||
        rate.categorySlug.toLowerCase().includes(keyword)
    );
    setFilteredRates(filtered);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredRates.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredRates.length / itemsPerPage);

  useEffect(() => {
    fetchTaxRates();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">GST Tax Settings</h2>
      <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded">
        <div className="mb-2">
          <label>Category Name</label>
          <select
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option>Gold</option>
            <option>Grocery</option>
            <option>Electronics</option>
            <option>Commission</option>
            <option>Delivery</option>
            <option>Spa</option>
            <option>Food</option>
            <option>Subscription</option>
            <option>ResumeService</option>
            <option>Other</option>
          </select>
        </div>

        <div className="mb-2">
          <label>Slug</label>
          <input
            className="form-control"
            name="categorySlug"
            value={form.categorySlug}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label>GST Rate (%)</label>
          <input
            type="number"
            className="form-control"
            name="gstRate"
            value={form.gstRate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-2">
          <label>Type</label>
          <select
            name="type"
            className="form-control"
            value={form.type}
            onChange={handleChange}
          >
            <option value="Fixed">Fixed</option>
            <option value="Dynamic">Dynamic</option>
          </select>
        </div>

        <div className="mb-2">
          <label>Applicable To:</label>
          <br />
          {["Product", "Service", "Commission", "Delivery"].map((item) => (
            <div key={item} className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                value={item}
                checked={form.applicableTo.includes(item)}
                onChange={handleChange}
              />
              <label className="form-check-label">{item}</label>
            </div>
          ))}
        </div>

        <button className="btn btn-primary mt-3" type="submit">
          {selectedId ? "Update Tax Rate" : "Save Tax Rate"}
        </button>
        {selectedId && (
          <button className="btn btn-secondary mt-3 ms-3" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by category or slug"
        value={search}
        onChange={handleSearch}
      />

      <h4>All GST Entries</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Category</th>
            <th>Slug</th>
            <th>Rate (%)</th>
            <th>Type</th>
            <th>Applicable To</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((rate) => (
            <tr key={rate._id}>
              <td>{rate.name}</td>
              <td>{rate.categorySlug}</td>
              <td>{rate.gstRate}</td>
              <td>{rate.type}</td>
              <td>{rate.applicableTo.join(", ")}</td>
              <td>{new Date(rate.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(rate)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(rate._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination">
            {[...Array(totalPages)].map((_, idx) => (
              <li
                key={idx}
                className={`page-item ${
                  currentPage === idx + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default AdminTaxSettingsPage;
