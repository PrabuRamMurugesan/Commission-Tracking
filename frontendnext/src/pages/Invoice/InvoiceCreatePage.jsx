// File: InvoiceCreatePage.jsx

import React, { useState ,useEffect} from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";

const InvoiceCreatePage = () => {
  // State for all non-item fields
  const [formData, setFormData] = useState({
    invoiceDate: "",
    dueDate: "",
    platform: "BBSCART",
    invoiceType: "Manual",
    poNumber: "",
    deliveryDate: "",
    invoiceTags: "",
    buyerName: "",
    buyerGSTIN: "",
    buyerState: "",
    sellerName: "",
    sellerGSTIN: "",
    sellerState: "",
    gstType: "Intra-State",
    globalCGST: 0,
    globalSGST: 0,
    globalIGST: 0,
    billingAddress: "",
    shippingAddress: "",
    sameAsBilling: false,
    amountPaid: 0,
    walletPaid: 0,
    escrowHeld: 0,
    paymentMode: "Cash",
    paymentReferenceId: "",
    paymentDate: "",
    useEscrow: false,
    partialPayment: false,
    shippingCharges: 0,
    roundOff: 0,
    otherCharges: 0,
    notes: "",
    terms: "",
    // attachmentUrl: "", // handle file upload separately if needed
    subtotal: 0,
    totalDiscount: 0,
    totalGST: 0,
    grandTotal: 0,
    walletAdjustment: 0,
    finalPayable: 0,
  });

  
  // State for dynamic items table
  const [items, setItems] = useState([
    {
      itemName: "",
      hsn: "",
      quantity: 1,
      rate: 0,
      discount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
    },
  ]);

  // Handle change on any simple form field
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle change in items table
  const handleItemChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx][field] = value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        itemName: "",
        hsn: "",
        quantity: 1,
        rate: 0,
        discount: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
      },
    ]);
  };

  const removeItemRow = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };
  useEffect(() => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalGST = 0;

    items.forEach((item) => {
      // force numeric values
      const rate = parseFloat(item.rate) || 0;
      const qty = parseFloat(item.quantity) || 0;
      const discPerc = parseFloat(item.discount) || 0;
      const cgstPerc = parseFloat(item.cgst) || 0;
      const sgstPerc = parseFloat(item.sgst) || 0;
      const igstPerc = parseFloat(item.igst) || 0;

      const gross = rate * qty;
      const discountAmt = gross * (discPerc / 100);
      const taxable = gross - discountAmt;

      subtotal += taxable;
      totalDiscount += discountAmt;

      // now numeric addition
      const gstAmt = taxable * ((cgstPerc + sgstPerc + igstPerc) / 100);
      totalGST += gstAmt;
    });

    // extra charges
    const shipping = parseFloat(formData.shippingCharges) || 0;
    const roundOff = parseFloat(formData.roundOff) || 0;
    const other = parseFloat(formData.otherCharges) || 0;
    const wallet = parseFloat(formData.walletPaid) || 0;

    // grand total and final payable
    const grandTotal = subtotal + totalGST + shipping + other + roundOff;
    const walletAdjust = wallet;
    const finalPayable = grandTotal;

    setFormData((fd) => ({
      ...fd,
      subtotal,
      totalDiscount,
      totalGST,
      grandTotal,
      walletAdjustment: walletAdjust,
      finalPayable,
    }));
  }, [
    items,
    formData.shippingCharges,
    formData.otherCharges,
    formData.roundOff,
    formData.walletPaid,
  ]);
  
  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic front-end validation
    const missing = [];
    if (!formData.buyerName) missing.push("Buyer Name");
    if (!formData.sellerName) missing.push("Seller Name");
    if (items.length === 0) missing.push("At least one item");
    if (!formData.invoiceDate) missing.push("Invoice Date");
    if (!formData.platform) missing.push("Platform");
    if (missing.length) {
      console.error("Validation error, missing:", missing);
      alert("Please fill: " + missing.join(", "));
      return;
    }

    const payload = { ...formData, items, createdBy: "Admin" };
    console.log("Submitting invoice payload:", payload);

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        console.error("Server error:", data);
        alert("Error: " + (data.message || "Unable to create invoice"));
      } else {
        console.log("Invoice created successfully:", data);
        alert("Invoice created successfully!");
        // Optionally reset form or redirect here
      }
    } catch (err) {
      console.error("Network / unexpected error:", err);
      alert("Unexpected error: " + err.message);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Create Invoice</h3>
      <Form onSubmit={handleSubmit}>
        {/* Invoice Header */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control type="text" value="AUTO-GENERATED" readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Invoice Date</Form.Label>
              <Form.Control
                name="invoiceDate"
                type="date"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                name="dueDate"
                type="date"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Platform</Form.Label>
              <Form.Select
                name="platform"
                onChange={handleChange}
                value={formData.platform}
              >
                <option>BBSCART</option>
                <option>Golddex</option>
                <option>EmerJobs</option>
                <option>Thiaworld</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Invoice Type</Form.Label>
              <Form.Select
                name="invoiceType"
                onChange={handleChange}
                value={formData.invoiceType}
              >
                <option>Manual</option>
                <option>Auto</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>PO Number</Form.Label>
              <Form.Control
                name="poNumber"
                type="text"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Delivery Date</Form.Label>
              <Form.Control
                name="deliveryDate"
                type="date"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group>
              <Form.Label>Invoice Tags</Form.Label>
              <Form.Control
                name="invoiceTags"
                type="text"
                placeholder="Add tags separated by comma"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Buyer & Seller Info */}
        <h5 className="mt-4">Buyer Information</h5>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Buyer Name</Form.Label>
              <Form.Control
                name="buyerName"
                type="text"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Buyer GSTIN</Form.Label>
              <Form.Control
                name="buyerGSTIN"
                type="text"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Buyer State</Form.Label>
              <Form.Control
                name="buyerState"
                type="text"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <h5 className="mt-4">Seller Information</h5>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Seller Name</Form.Label>
              <Form.Control
                name="sellerName"
                type="text"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Seller GSTIN</Form.Label>
              <Form.Control
                name="sellerGSTIN"
                type="text"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Seller State</Form.Label>
              <Form.Control
                name="sellerState"
                type="text"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* GST Configuration */}
        <h5 className="mt-4">GST Configuration</h5>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>GST Type</Form.Label>
              <Form.Select
                name="gstType"
                onChange={handleChange}
                value={formData.gstType}
              >
                <option>Intra-State</option>
                <option>Inter-State</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Global CGST %</Form.Label>
              <Form.Control
                name="globalCGST"
                type="number"
                onChange={handleChange}
                value={formData.globalCGST}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Global SGST %</Form.Label>
              <Form.Control
                name="globalSGST"
                type="number"
                onChange={handleChange}
                value={formData.globalSGST}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Global IGST %</Form.Label>
              <Form.Control
                name="globalIGST"
                type="number"
                onChange={handleChange}
                value={formData.globalIGST}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Invoice Items */}
        <h5 className="mt-4">Invoice Items</h5>
        <Table bordered responsive className="mb-3">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>HSN</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Discount %</th>
              <th>CGST %</th>
              <th>SGST %</th>
              <th>IGST %</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((itm, i) => (
              <tr key={i}>
                <td>
                  <Form.Control
                    type="text"
                    value={itm.itemName}
                    onChange={(e) =>
                      handleItemChange(i, "itemName", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="text"
                    value={itm.hsn}
                    onChange={(e) => handleItemChange(i, "hsn", e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={itm.quantity}
                    onChange={(e) =>
                      handleItemChange(i, "quantity", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={itm.rate}
                    onChange={(e) =>
                      handleItemChange(i, "rate", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={itm.discount}
                    onChange={(e) =>
                      handleItemChange(i, "discount", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={itm.cgst}
                    onChange={(e) =>
                      handleItemChange(i, "cgst", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={itm.sgst}
                    onChange={(e) =>
                      handleItemChange(i, "sgst", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Form.Control
                    type="number"
                    value={itm.igst}
                    onChange={(e) =>
                      handleItemChange(i, "igst", e.target.value)
                    }
                  />
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeItemRow(i)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="secondary" onClick={addItemRow}>
          + Add Item
        </Button>

        {/* Billing & Shipping */}
        <h5 className="mt-4">Billing & Shipping</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Billing Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="billingAddress"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Shipping Address</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="shippingAddress"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Check
              label="Same as Billing Address"
              name="sameAsBilling"
              onChange={handleChange}
              checked={formData.sameAsBilling}
              className="mt-2"
            />
          </Col>
        </Row>

        {/* Payment Information */}
        <h5 className="mt-4">Payment Information</h5>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Amount Paid</Form.Label>
              <Form.Control
                name="amountPaid"
                type="number"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Wallet Paid</Form.Label>
              <Form.Control
                name="walletPaid"
                type="number"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Escrow Held</Form.Label>
              <Form.Control
                name="escrowHeld"
                type="number"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Payment Mode</Form.Label>
              <Form.Select
                name="paymentMode"
                onChange={handleChange}
                value={formData.paymentMode}
              >
                <option>Cash</option>
                <option>Bank</option>
                <option>Wallet</option>
                <option>UPI</option>
                <option>NEFT/RTGS</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Payment Reference ID</Form.Label>
              <Form.Control
                name="paymentReferenceId"
                type="text"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Payment Date</Form.Label>
              <Form.Control
                name="paymentDate"
                type="date"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Check
              label="Use Escrow"
              name="useEscrow"
              onChange={handleChange}
              checked={formData.useEscrow}
            />
          </Col>
          <Col md={6}>
            <Form.Check
              label="Partial Payment"
              name="partialPayment"
              onChange={handleChange}
              checked={formData.partialPayment}
            />
          </Col>
        </Row>

        {/* Additional Charges */}
        <h5 className="mt-4">Additional Charges & Adjustments</h5>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Shipping Charges</Form.Label>
              <Form.Control
                name="shippingCharges"
                type="number"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Round-Off (+/-)</Form.Label>
              <Form.Control
                name="roundOff"
                type="number"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Other Charges</Form.Label>
              <Form.Control
                name="otherCharges"
                type="number"
                onChange={handleChange}
                placeholder="Enter any extra charge"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Notes & Terms */}
        <h5 className="mt-4">Notes & Terms</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="notes"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Terms & Conditions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="terms"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Invoice Summary */}
        <h5 className="mt-4">Invoice Summary</h5>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Subtotal</Form.Label>
              <Form.Control
                type="text"
                value={`₹${formData.subtotal}`}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Total GST</Form.Label>
              <Form.Control
                type="text"
                value={`₹${formData.totalGST}`}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Grand Total</Form.Label>
              <Form.Control
                type="text"
                value={`₹${formData.grandTotal}`}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Wallet Adjustment</Form.Label>
              <Form.Control
                type="text"
                value={`₹${formData.walletAdjustment}`}
                readOnly
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Final Payable Amount</Form.Label>
              <Form.Control
                type="text"
                value={`₹${formData.finalPayable}`}
                readOnly
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-3">
          <Button
            variant="secondary"
            type="button"
            onClick={() => window.location.reload()}
          >
            Reset
          </Button>
          <Button variant="primary" type="submit">
            Create Invoice
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default InvoiceCreatePage;
