// File: InvoiceEditPage.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Table, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const InvoiceEditPage = () => {
  const { id } = useParams(); // invoice ID from URL
  console.log(id,"id");
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      alert("Invalid invoice ID.");
      navigate("/invoice-list");
      return;
    }
    // …fetch logic
  }, [id, navigate]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  
  const [formData, setFormData] = useState({
    invoiceDate: "",
    dueDate: "",
    platform: "",
    invoiceType: "",
    poNumber: "",
    deliveryDate: "",
    invoiceTags: [],

    buyerName: "",
    buyerGSTIN: "",
    buyerState: "",
    sellerName: "",
    sellerGSTIN: "",
    sellerState: "",

    gstType: "",
    globalCGST: 0,
    globalSGST: 0,
    globalIGST: 0,

    billingAddress: "",
    shippingAddress: "",
    sameAsBilling: false,

    amountPaid: 0,
    walletPaid: 0,
    escrowHeld: 0,
    paymentMode: "",
    paymentReferenceId: "",
    paymentDate: "",
    useEscrow: false,
    partialPayment: false,

    shippingCharges: 0,
    roundOff: 0,
    otherCharges: 0,

    notes: "",
    terms: "",
    attachmentUrl: "",

    subtotal: 0,
    totalDiscount: 0,
    totalGST: 0,
    grandTotal: 0,
    walletAdjustment: 0,
    finalPayable: 0,
  });
  const [items, setItems] = useState([]);

  // Fetch invoice on mount
  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((res) => res.json())
      .then(({ success, invoice }) => {
        if (!success) throw new Error("Not found");
        setInvoiceData(invoice);
        // Populate formData
        setFormData({
          invoiceDate: invoice.invoiceDate?.slice(0, 10) || "",
          dueDate: invoice.dueDate?.slice(0, 10) || "",
          platform: invoice.platform,
          invoiceType: invoice.invoiceType,
          poNumber: invoice.poNumber || "",
          deliveryDate: invoice.deliveryDate?.slice(0, 10) || "",
          invoiceTags: (invoice.invoiceTags || []).join(", "),

          buyerName: invoice.buyerName,
          buyerGSTIN: invoice.buyerGSTIN,
          buyerState: invoice.buyerState,
          sellerName: invoice.sellerName,
          sellerGSTIN: invoice.sellerGSTIN,
          sellerState: invoice.sellerState,

          gstType: invoice.gstType,
          globalCGST: invoice.globalCGST,
          globalSGST: invoice.globalSGST,
          globalIGST: invoice.globalIGST,

          billingAddress: invoice.billingAddress || "",
          shippingAddress: invoice.shippingAddress || "",
          sameAsBilling: invoice.sameAsBilling,

          amountPaid: invoice.amountPaid,
          walletPaid: invoice.walletPaid,
          escrowHeld: invoice.escrowHeld,
          paymentMode: invoice.paymentMode,
          paymentReferenceId: invoice.paymentReferenceId,
          paymentDate: invoice.paymentDate?.slice(0, 10) || "",
          useEscrow: invoice.useEscrow,
          partialPayment: invoice.partialPayment,

          shippingCharges: invoice.shippingCharges,
          roundOff: invoice.roundOff,
          otherCharges: invoice.otherCharges,

          notes: invoice.notes,
          terms: invoice.terms,
          attachmentUrl: invoice.attachmentUrl || "",

          subtotal: invoice.subtotal,
          totalDiscount: invoice.totalDiscount,
          totalGST: invoice.totalGST,
          grandTotal: invoice.grandTotal,
          walletAdjustment: invoice.walletAdjustment,
          finalPayable: invoice.finalPayable,
        });
        setItems(invoice.items || []);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load invoice");
        navigate("/invoice-list");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Generic form field change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((fd) => ({
      ...fd,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Item table handlers
  const handleItemChange = (idx, field, val) => {
    setItems((it) =>
      it.map((r, i) => (i === idx ? { ...r, [field]: val } : r))
    );
  };
  const addItem = () => {
    setItems((it) => [
      ...it,
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
  const removeItem = (idx) => setItems((it) => it.filter((_, i) => i !== idx));

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        invoiceTags: formData.invoiceTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        items,
        updatedBy: "Admin",
      };
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Update failed");
      alert("Invoice updated successfully");
      navigate("/invoice-list");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner animation="border" className="m-5" />;

  return (
    <div className="container py-4">
      <h3 className="mb-4">Edit Invoice</h3>
      <Form onSubmit={handleSubmit}>
        {/* Header */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Invoice Number</Form.Label>
              <Form.Control value={invoiceData.invoiceNumber} readOnly />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Invoice Date</Form.Label>
              <Form.Control
                name="invoiceDate"
                type="date"
                value={formData.invoiceDate}
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
                value={formData.dueDate}
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
                value={formData.platform}
                onChange={handleChange}
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
                value={formData.invoiceType}
                onChange={handleChange}
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
                value={formData.poNumber}
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
                value={formData.deliveryDate}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={8}>
            <Form.Group>
              <Form.Label>Invoice Tags</Form.Label>
              <Form.Control
                name="invoiceTags"
                placeholder="tag1, tag2"
                value={formData.invoiceTags}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Buyer & Seller */}
        <h5 className="mt-4">Buyer Information</h5>
        <Row className="mb-3">
          {[
            ["buyerName", "Buyer Name"],
            ["buyerGSTIN", "Buyer GSTIN"],
            ["buyerState", "Buyer State"],
          ].map(([name, label], i) => (
            <Col md={4} key={i}>
              <Form.Group>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          ))}
        </Row>

        <h5 className="mt-4">Seller Information</h5>
        <Row className="mb-3">
          {[
            ["sellerName", "Seller Name"],
            ["sellerGSTIN", "Seller GSTIN"],
            ["sellerState", "Seller State"],
          ].map(([name, label], i) => (
            <Col md={4} key={i}>
              <Form.Group>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          ))}
        </Row>

        {/* GST Config */}
        <h5 className="mt-4">GST Configuration</h5>
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>GST Type</Form.Label>
              <Form.Select
                name="gstType"
                value={formData.gstType}
                onChange={handleChange}
              >
                <option>Intra-State</option>
                <option>Inter-State</option>
              </Form.Select>
            </Form.Group>
          </Col>
          {["globalCGST", "globalSGST", "globalIGST"].map((n, i) => (
            <Col md={3} key={i}>
              <Form.Group>
                <Form.Label>{n.replace("global", "")} %</Form.Label>
                <Form.Control
                  name={n}
                  type="number"
                  value={formData[n]}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          ))}
        </Row>

        {/* Items */}
        <h5 className="mt-4">Invoice Items</h5>
        <Table bordered responsive className="mb-3">
          <thead>
            <tr>
              {[
                "Item Name",
                "HSN",
                "Qty",
                "Rate",
                "Discount %",
                "CGST %",
                "SGST %",
                "IGST %",
                "Action",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((r, idx) => (
              <tr key={idx}>
                {[
                  "itemName",
                  "hsn",
                  "quantity",
                  "rate",
                  "discount",
                  "cgst",
                  "sgst",
                  "igst",
                ].map((field) => (
                  <td key={field}>
                    <Form.Control
                      type={
                        field === "quantity" ||
                        field === "rate" ||
                        field === "discount" ||
                        field === "cgst" ||
                        field === "sgst" ||
                        field === "igst"
                          ? "number"
                          : "text"
                      }
                      value={r[field]}
                      onChange={(e) =>
                        handleItemChange(idx, field, e.target.value)
                      }
                    />
                  </td>
                ))}
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(idx)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={addItem} variant="secondary" className="mb-4">
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
                value={formData.billingAddress}
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
                value={formData.shippingAddress}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Check
              label="Same as Billing Address"
              name="sameAsBilling"
              checked={formData.sameAsBilling}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* Payment Info */}
        <h5 className="mt-4">Payment Information</h5>
        <Row className="mb-3">
          {["amountPaid", "walletPaid", "escrowHeld"].map((n, i) => (
            <Col md={4} key={n}>
              <Form.Group>
                <Form.Label>{n.replace(/([A-Z])/g, " $1")}</Form.Label>
                <Form.Control
                  type="number"
                  name={n}
                  value={formData[n]}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          ))}
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Payment Mode</Form.Label>
              <Form.Select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
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
                value={formData.paymentReferenceId}
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
                value={formData.paymentDate}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Check
              name="useEscrow"
              label="Use Escrow"
              checked={formData.useEscrow}
              onChange={handleChange}
            />
          </Col>
          <Col>
            <Form.Check
              name="partialPayment"
              label="Partial Payment"
              checked={formData.partialPayment}
              onChange={handleChange}
            />
          </Col>
        </Row>

        {/* Additional Charges */}
        <h5 className="mt-4">Additional Charges & Adjustments</h5>
        <Row className="mb-3">
          {["shippingCharges", "roundOff", "otherCharges"].map((n) => (
            <Col md={4} key={n}>
              <Form.Group>
                <Form.Label>{n.replace(/([A-Z])/g, " $1")}</Form.Label>
                <Form.Control
                  type="number"
                  name={n}
                  value={formData[n]}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          ))}
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
                value={formData.notes}
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
                value={formData.terms}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Invoice Summary */}
        <h5 className="mt-4">Invoice Summary</h5>
        <Row className="mb-3">
          {[
            "subtotal",
            "totalGST",
            "grandTotal",
            "walletAdjustment",
            "finalPayable",
          ].map((n, i) => (
            <Col md={i < 3 ? 4 : 4} key={n}>
              <Form.Group>
                <Form.Label>{n.replace(/([A-Z])/g, " $1")}</Form.Label>
                <Form.Control type="text" readOnly value={`₹${formData[n]}`} />
              </Form.Group>
            </Col>
          ))}
        </Row>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-3 mt-4">
          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default InvoiceEditPage;
