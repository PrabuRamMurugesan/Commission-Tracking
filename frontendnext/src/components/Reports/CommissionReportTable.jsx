import React, { useState } from "react";
import { Table, Button, Collapse } from "react-bootstrap";

const CommissionReportTable = ({ data, pagination, setFilters }) => {
  const [expandedRows, setExpandedRows] = useState([]);

  const toggleRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };
  console.log("🔍 Table Props: ", data);
  return (
    <>
      <Table striped bordered hover responsive>
        <thead className="thead-dark">
          <tr>
            <th>Date</th>
            <th>Platform</th>
            <th>Seller Name</th>
            <th>Seller Role</th>
            <th>Commission Amount</th>
            <th>Commission %</th>
            <th>Transaction ID</th>
            <th>Order ID</th>
            <th>Payout Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data?.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center">
                No records found.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <React.Fragment key={item._id}>
                <tr>
                  <td>{item.date?.slice(0, 10) || "-"}</td>
                  <td>{item.platform || "-"}</td>
                  <td>{item.sellerName || "-"}</td>
                  <td>{item.role|| "-"}</td>
                  {/* <td>{item.role?.toUpperCase() || "-"}</td> */}
                  <td>₹{item.commissionAmount?.toFixed(2) || "0.00"}</td>
                  <td>{item.commissionPercent || "0"}%</td>
                  <td>{item.transactionId || "-"}</td>
                  <td>{item.orderId || "-"}</td>
                  <td>{item.payoutStatus || "-"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => toggleRow(item._id)}
                    >
                      {expandedRows.includes(item._id) ? "Hide" : "Details"}
                    </Button>
                  </td>
                </tr>

                {/* Expandable Row */}
                <tr>
                  <td colSpan="10" className="p-0">
                    <Collapse in={expandedRows.includes(item._id)}>
                      <div className="p-3 bg-light">
                        <strong>Additional Details:</strong>
                        <p>Order Status: {item.orderStatus || "-"}</p>
                        <p>Payment Method: {item.paymentMethod || "-"}</p>
                        <p>
                          Final Amount: ₹
                          {item.finalAmount?.toFixed(2) || "0.00"}
                        </p>
                      </div>
                    </Collapse>
                  </td>
                </tr>
              </React.Fragment>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      {pagination?.total > pagination?.limit && (
        <div className="d-flex justify-content-center mt-3">
          <Button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="me-2"
          >
            Prev
          </Button>
          <Button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={
              pagination.page === Math.ceil(pagination.total / pagination.limit)
            }
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default CommissionReportTable;
