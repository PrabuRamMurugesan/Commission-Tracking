// import React, { useEffect, useState } from "react";
// import { Table, Spinner, Alert, Form, Button } from "react-bootstrap";
// import axios from "axios";
// import { CSVLink } from "react-csv";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import "../styles/MultiCurrencySupport.css"; // Import CSS

// const MultiCurrencySupport = () => {
//   const [currencies, setCurrencies] = useState([]);
//   const [selectedCurrency, setSelectedCurrency] = useState("USD");
//   const [exchangeRate, setExchangeRate] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [commissionData, setCommissionData] = useState([]);

//   useEffect(() => {
//     fetchCurrencies();
//     fetchCommissionData();
//   }, []);

//   const fetchCurrencies = async () => {
//     try {
//       const response = await axios.get("/api/multi-currency");
//       setCurrencies(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching currencies:", error);
//       setError("Failed to load currencies.");
//       setLoading(false);
//     }
//   };

//   const fetchCommissionData = async () => {
//     try {
//       const response = await axios.get(`/api/commission-data?currency=${selectedCurrency}`);
//       setCommissionData(response.data);
//     } catch (error) {
//       console.error("Error fetching commission data:", error);
//       setError("Failed to load commission data.");
//     }
//   };

//   const handleCurrencyChange = async (e) => {
//     setSelectedCurrency(e.target.value);
//     const response = await axios.get(`/api/exchange-rate?currency=${e.target.value}`);
//     setExchangeRate(response.data.rate);
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.text(`Commission Report in ${selectedCurrency}`, 20, 10);
//     doc.autoTable({
//       head: [["Date", "User", "Commission Amount", "Converted Amount"]],
//       body: commissionData.map(data => [
//         data.date,
//         data.user,
//         `$${data.commissionAmount}`,
//         `${(data.commissionAmount * exchangeRate).toFixed(2)} ${selectedCurrency}`
//       ]),
//     });
//     doc.save(`commission-report-${selectedCurrency}.pdf`);
//   };

//   return (
//     <div className="multi-currency-container">
//       <h2 className="text-primary mb-4">💱 Multi-Currency Support</h2>

//       <div className="filters">
//         <Form.Control as="select" onChange={handleCurrencyChange}>
//           {currencies.map((currency, index) => (
//             <option key={index} value={currency.code}>{currency.name} ({currency.code})</option>
//           ))}
//         </Form.Control>

//         <Button variant="primary" onClick={fetchCommissionData}>Fetch Data</Button>
//       </div>

//       <div className="export-buttons">
//         <CSVLink data={commissionData} filename={`commission-data-${selectedCurrency}.csv`} className="btn btn-success">
//           Export CSV
//         </CSVLink>
//         <Button variant="danger" onClick={exportPDF}>Export PDF</Button>
//       </div>

//       {loading ? (
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">Loading currency data...</span>
//         </Spinner>
//       ) : error ? (
//         <Alert variant="danger">{error}</Alert>
//       ) : (
//         <Table striped bordered hover responsive>
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>User</th>
//               <th>Commission ($)</th>
//               <th>Converted Amount ({selectedCurrency})</th>
//             </tr>
//           </thead>
//           <tbody>
//             {commissionData.map((data, index) => (
//               <tr key={index}>
//                 <td>{new Date(data.date).toLocaleString()}</td>
//                 <td>{data.user}</td>
//                 <td>${data.commissionAmount}</td>
//                 <td>{(data.commissionAmount * exchangeRate).toFixed(2)} {selectedCurrency}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//       <style>
//         {`
//         /* Multi-Currency Support Styling */
// .multi-currency-container {
//   padding: 20px;
//   max-width: 90%;
//   margin: auto;
//   background-color: #f8f9fa;
//   border-radius: 10px;
// }

// .filters {
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 20px;
// }

// .filters select {
//   width: 30%;
//   padding: 10px;
//   border-radius: 5px;
// }

// .export-buttons {
//   margin: 20px 0;
// }

// .btn-success {
//   background-color: #28a745;
//   border: none;
// }

// .btn-danger {
//   background-color: #dc3545;
//   border: none;
// }

// @media (max-width: 768px) {
//   .filters {
//     flex-direction: column;
//   }

//   .filters select {
//     width: 100%;
//     margin-bottom: 10px;
//   }
// }
// `}
//       </style>
//     </div>
//   );
// };

// export default MultiCurrencySupport;

//update
import React, { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "../components/Sidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MultiCurrencySupportPage = () => {
  const [currencies, setCurrencies] = useState([
    {
      name: "Indian Rupee",
      code: "INR",
      rate: 1.0,
      status: "Active",
      updated: "2025-04-01",
    },
    {
      name: "US Dollar",
      code: "USD",
      rate: 83.12,
      status: "Active",
      updated: "2025-04-01",
    },
    {
      name: "Euro",
      code: "EUR",
      rate: 89.45,
      status: "Inactive",
      updated: "2025-03-15",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    rate: "",
    status: "Active",
    updated: "",
  });

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(currencies[index]);
    setShowModal(true);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this currency?")) {
      const updated = [...currencies];
      updated.splice(index, 1);
      setCurrencies(updated);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedList = [...currencies];
    const entry = {
      ...formData,
      updated: new Date().toISOString().split("T")[0],
    };
    if (editIndex !== null) {
      updatedList[editIndex] = entry;
    } else {
      updatedList.push(entry);
    }
    setCurrencies(updatedList);
    setShowModal(false);
    setEditIndex(null);
    setFormData({
      name: "",
      code: "",
      rate: "",
      status: "Active",
      updated: "",
    });
  };

  const chartData = {
    labels: currencies.map((cur) => cur.code),
    datasets: [
      {
        label: "Exchange Rate to INR",
        data: currencies.map((cur) => cur.rate),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Currency Exchange Rates Overview",
      },
    },
  };

  return (
    <div className="multi-currency-support ">
      <div className="d-flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-grow-1 multi-currency-support-main">
          {/* Header */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center  mcs-header">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
              <h2 className="me-md-3 mb-2 mb-md-0">Multi-Currency Support</h2>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                + Add Currency
              </Button>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mb-5">
            <Bar data={chartData} options={chartOptions}  />
          </div>

          {/* Table Section */}
          <div className="table-responsive">
            <Table bordered hover className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Exchange Rate</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currencies.map((cur, i) => (
                  <tr key={i}>
                    <td>{cur.name}</td>
                    <td>{cur.code}</td>
                    <td>
                      <span
                        className={`badge ${
                          cur.status === "Active"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {cur.status}
                      </span>
                    </td>
                    <td>{cur.rate}</td>
                    <td>{cur.updated}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => handleEdit(i)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(i)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Modal */}
          <Modal
            show={showModal}
            onHide={() => {
              setShowModal(false);
              setEditIndex(null);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {editIndex !== null ? "Edit" : "Add"} Currency
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSave}>
                <Form.Group className="mb-3">
                  <Form.Label>Currency Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Exchange Rate</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.rate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rate: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>
                <Button type="submit" variant="primary">
                  {editIndex !== null ? "Update" : "Save"}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>

          {/* Custom Style */}
          <style>{`
         .multi-currency-support{
         width:100vw;
         height:100vh;
         }
         .multi-currency-support-main{
         padding:8%;
         }
         @media (max-width: 768px) {
          .multi-currency-support-main{
            padding:22% 8%;
          }
          
        `}</style>
        </div>
      </div>
    </div>
  );
};

export default MultiCurrencySupportPage;
