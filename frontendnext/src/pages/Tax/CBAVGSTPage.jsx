import React, { useEffect, useState } from "react";
import axios from "axios";

const CBAVGSTPage = () => {
  const [gstData, setGstData] = useState([]);
  const [selectedType, setSelectedType] = useState("sold");
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `/api/gst-reports?role=cbav&type=${selectedType}`
      );
      setGstData(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedType]);

  useEffect(() => {
    let temp = [...gstData];
    if (search) {
      temp = temp.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    if (selectedMonth) {
      temp = temp.filter(
        (item) =>
          new Date(item.date).toISOString().slice(0, 7) === selectedMonth
      );
    }
    setFilteredData(temp);
  }, [search, selectedMonth, gstData]);

  const exportToCSV = () => {
    const rows = filteredData.map((item) => ({
      Name: item.customerName || item.vendorName || "-",
      Amount: item.amount,
      "GST %": item.gstRate,
      "GST ₹": item.gstAmount,
      Date: item.date,
      Type: item.type,
    }));

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += Object.keys(rows[0]).join(",") + "\n";
    rows.forEach((row) => {
      csvContent += Object.values(row).join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "CBAV_GST_Report.csv");
    document.body.appendChild(link);
    link.click();
  };

  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const totalGST = filteredData.reduce((sum, item) => sum + item.gstAmount, 0);

  return (
    <div className="container mt-4">
      <h4>CBAV GST Report</h4>

      <div className="d-flex gap-3 my-3">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="form-select w-auto"
        >
          <option value="sold">Sold Products</option>
          <option value="commission">Commission Earned</option>
        </select>

        <input
          type="month"
          className="form-control w-auto"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <input
          type="text"
          placeholder="Search anything..."
          className="form-control w-auto"
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn btn-outline-success" onClick={exportToCSV}>
          Export CSV
        </button>
      </div>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>SL</th>
            <th>Customer/Vendor</th>
            <th>Amount (₹)</th>
            <th>GST %</th>
            <th>GST Amount (₹)</th>
            <th>Date</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.customerName || item.vendorName}</td>
              <td>₹{item.amount}</td>
              <td>{item.gstRate}%</td>
              <td>₹{item.gstAmount}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>
                {item.invoiceUrl ? (
                  <a href={item.invoiceUrl} target="_blank" rel="noreferrer">
                    Download
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-light">
          <tr>
            <td colSpan="2">
              <strong>Total</strong>
            </td>
            <td>
              <strong>₹{totalAmount.toFixed(2)}</strong>
            </td>
            <td></td>
            <td>
              <strong>₹{totalGST.toFixed(2)}</strong>
            </td>
            <td colSpan="2"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CBAVGSTPage;
