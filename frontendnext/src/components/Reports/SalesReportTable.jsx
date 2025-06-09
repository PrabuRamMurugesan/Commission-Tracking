import React, { useEffect, useState } from "react";
import { Table, Button, Collapse } from "react-bootstrap";

const SalesReportTable = ({ data }) => {
  const [expandedRows, setExpandedRows] = useState([]);
  useEffect(() => {
    console.log("🔵 Data passed to table:", data);
  }, [data]);
  const toggleRow = (orderId) => {
    setExpandedRows((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const maskPhone = (phone) => {
    if (!phone) return "-";
    return phone.slice(0, 2) + "****" + phone.slice(-2);
  };

  return (
    <Table striped bordered hover responsive>
      <thead className="thead-dark">
        <tr>
          <th>Date / Time</th>
          <th>Order ID</th>
          <th>Transaction ID</th>
          <th>Platform</th>
          <th>Product(s)</th>
          <th>Seller Name</th>
          <th>Seller Role</th>
          <th>Buyer Name / Phone</th>
          <th>Payment Status</th>
          <th>Order Status</th>
          <th>Payment Method</th>
          <th>GST Type</th>
          <th>CGST ₹</th>
          <th>SGST ₹</th>
          <th>IGST ₹</th>
          <th>TotalGST ₹</th>
          <th>Final Amount</th>
          <th>Commission %</th>
          <th>Payout Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data?.length === 0 ? (
          <tr>
            <td colSpan="15" className="text-center">
              No records found.
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <React.Fragment key={item._id}>
              <tr>
                <td>{item.date || "-"}</td>
                <td>{item.orderId || "-"}</td>
                <td>{item.transactionId || "-"}</td>
                <td>{item.platform || "-"}</td>
                <td>{item.products?.length || 0} item(s)</td>
                <td>{item.sellerName}</td>
                <td>{item.sellerRole}</td>
                <td>{item.buyerPhone}</td>
                <td>{item.paymentStatus || "-"}</td>
                <td>{item.orderStatus || "-"}</td>
                <td>{item.paymentMethod || "-"}</td>
                <td>{item.gstType}</td>
                <td>₹{item.cgst?.toFixed(2) || "0.00"}</td>
                <td>₹{item.sgst?.toFixed(2) || "0.00"}</td>
                <td>₹{item.igst?.toFixed(2) || "0.00"}</td>
                <td>₹{item.totalGSTAmount?.toFixed(2) || "0.00"}</td>
                <td>₹{item.finalAmount?.toFixed(2) || "0.00"}</td>
                <td>{item.commission || "0"}%</td>
                <td>{item.payoutStatus || "-"}</td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => toggleRow(item._id)}
                  >
                    {expandedRows.includes(item._id) ? "Hide" : "Expand"}
                  </Button>{" "}
                  <Button size="sm" variant="outline-primary">
                    Invoice
                  </Button>
                </td>
              </tr>

              {/* Expandable row */}
              <tr>
                <td colSpan="15" className="p-0">
                  <Collapse in={expandedRows.includes(item._id)}>
                    <div className="p-3 bg-light">
                      <strong>Products:</strong>
                      <ul>
                        {item.products?.map((p, index) => (
                          <li key={index}>
                            {p.title} – Qty: {p.quantity} – Price: ₹
                            {p.price.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Collapse>
                </td>
              </tr>
            </React.Fragment>
          ))
        )}
      </tbody>
    </Table>
  );
};

export default SalesReportTable;
