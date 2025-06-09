// InvoicePagination.jsx (Page 16 of 18)
import React, { useState, useEffect } from "react";
import { Button, Dropdown, ButtonGroup, Form } from "react-bootstrap";

const InvoicePagination = ({ totalItems = 130 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [infiniteScroll, setInfiniteScroll] = useState(false);

  const totalPages = Math.ceil(totalItems / pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleExport = () => {
    alert(`Exporting Page ${currentPage} (${pageSize} records)...`);
  };

  const handleBulkVerify = () => {
    alert(`Verifying all ${pageSize} invoices on page ${currentPage}`);
  };

  return (
    <div className="d-flex flex-column gap-3 p-3 bg-white shadow-sm rounded">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <strong>
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
            results
          </strong>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <Form.Check
            type="switch"
            id="auto-refresh-switch"
            label="Auto-Refresh"
            checked={autoRefresh}
            onChange={() => setAutoRefresh(!autoRefresh)}
          />
          <Form.Check
            type="switch"
            id="infinite-scroll-switch"
            label="Infinite Scroll"
            checked={infiniteScroll}
            onChange={() => setInfiniteScroll(!infiniteScroll)}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between flex-wrap gap-2">
        <div className="d-flex gap-2 align-items-center">
          <Dropdown as={ButtonGroup}>
            <Button variant="outline-primary" onClick={handleExport}>
              Export (CSV / PDF)
            </Button>
          </Dropdown>
          <Button variant="outline-success" onClick={handleBulkVerify}>
            ✅ Bulk Verify (Page)
          </Button>
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span>Rows per page:</span>
          <Form.Select
            style={{ width: "100px" }}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          « First
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹ Prev
        </Button>

        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "primary" : "outline-secondary"}
            size="sm"
            onClick={() => handlePageChange(page)}
          >
            {page}
          </Button>
        ))}

        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next ›
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last »
        </Button>
      </div>
    </div>
  );
};

export default InvoicePagination;
