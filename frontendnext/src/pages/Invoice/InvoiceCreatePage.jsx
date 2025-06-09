import React, { useState } from "react";
import axios from "axios";

const InvoiceCreatePage = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: "EB1F8CE8",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date().toISOString().split("T")[0],

    platform: "BBSCART",
    status: "Partial",
    buyer: {
      name: "test",
      gstin: "65656655",
      state: "test",
    },
    seller: {
      name: "test",
      gstin: "test",
      state: "test",
    },
    items: [],
    currentItem: {
      name: "",
      amount: "",
      hsn: "",
      gstType: "",
      cgst: 0,
      sgst: 0,
      igst: 0,
    },
    payment: {
      amountPaid: "455",
      mode: "Cash",
      isEscrow: true,
      isPartialPayment: true,
    },
    notes: "test",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in formData.payment) {
      setFormData((prev) => ({
        ...prev,
        payment: {
          ...prev.payment,
          [name]: value,
        },
      }));
    } else if (name in formData.currentItem) {
      setFormData((prev) => ({
        ...prev,
        currentItem: {
          ...prev.currentItem,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddItem = () => {
    if (
      !formData.currentItem.name ||
      !formData.currentItem.amount ||
      !formData.currentItem.gstType
    ) {
      alert("Item must include name, amount, and GST type.");
      return;
    }
    

    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { ...prev.currentItem }],
      currentItem: {
        name: "",
        amount: "",
        hsn: "",
        gstType: "",
        cgst: 0,
        sgst: 0,
        igst: 0,
      },
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // <-- Prevent page reload

    // Step 1: Calculate totals
    const totalAmount = formData.items.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );
    const totalGST = formData.items.reduce(
      (sum, item) =>
        sum +
        (Number(item.amount || 0) *
          (Number(item.cgst || 0) +
            Number(item.sgst || 0) +
            Number(item.igst || 0))) /
          100,
      0
    );
    const grandTotal = totalAmount + totalGST;

    // Step 2: Validate core required fields
    if (
      !formData.platform ||
      !formData.invoiceNumber ||
      !formData.invoiceDate
    ) {
      alert("Missing required invoice fields.");
      return;
    }
    // if (res.data.success) {
    //   alert("✅ Invoice created successfully!");
    //   setShowSuccess(true);
    //   setTimeout(() => setShowSuccess(false), 3000);
    // }
    if (formData.items.length === 0) {
      alert("At least one item is required.");
      return;
    }

    // Step 3: Prepare payload
    const payload = {
      ...formData,
      totalAmount,
      totalGST,
      grandTotal,
      createdBy: {
        userId: "663e65002a5873c8a987e333", // replace with real session data
        role: "admin",
      },
    };

    delete payload.currentItem; // not needed in DB

    // console.log("Sending to backend:", payload);

    try {
      console.log("Sending invoice to backend:", payload);
      const res = await axios.post("/api/invoices", payload);
      console.log("Server Response:", res.data);
      
      if (res.data.success) {
        alert("Invoice created successfully!");
      }
    } catch (error) {
      console.error(
        "Error creating invoice:",
        error.response?.data || error.message
      );
      alert(
        `Server Error: ${error.response?.data?.message || "Unknown error"}`
      );
    }
  };
  

  return (
    <div className="container mt-4">
      <h2>Create Invoice</h2>
      {showSuccess && (
        <div className="alert alert-success" role="alert">
          ✅ Invoice created successfully!
        </div>
      )}
      <form>
        <div className="row mb-3">
          <div className="col">
            <label>Invoice Number</label>
            <input
              className="form-control"
              name="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label>Invoice Date</label>
            <input
              type="date"
              className="form-control"
              name="invoiceDate"
              value={formData.invoiceDate}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <label>Due Date</label>
            <input
              type="date"
              className="form-control"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="col">
            <label>Platform</label>
            <select
              className="form-select"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
            >
              <option>BBSCART</option>
              <option>Thiaworld</option>
              <option>Golldex</option>
            </select>
          </div>
        </div>
        {/* Buyer and Seller Info */}
        <h5>Buyer Info</h5>
        <input
          className="form-control mb-2"
          placeholder="Buyer Name"
          value={formData.buyer.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              buyer: { ...formData.buyer, name: e.target.value },
            })
          }
        />
        <input
          className="form-control mb-2"
          placeholder="Buyer GSTIN"
          value={formData.buyer.gstin}
          onChange={(e) =>
            setFormData({
              ...formData,
              buyer: { ...formData.buyer, gstin: e.target.value },
            })
          }
        />
        <input
          className="form-control mb-2"
          placeholder="Buyer State"
          value={formData.buyer.state}
          onChange={(e) =>
            setFormData({
              ...formData,
              buyer: { ...formData.buyer, state: e.target.value },
            })
          }
        />
        <h5>Seller Info</h5>
        <input
          className="form-control mb-2"
          placeholder="Seller Name"
          value={formData.seller.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              seller: { ...formData.seller, name: e.target.value },
            })
          }
        />
        <input
          className="form-control mb-2"
          placeholder="Seller GSTIN"
          value={formData.seller.gstin}
          onChange={(e) =>
            setFormData({
              ...formData,
              seller: { ...formData.seller, gstin: e.target.value },
            })
          }
        />
        <input
          className="form-control mb-2"
          placeholder="Seller State"
          value={formData.seller.state}
          onChange={(e) =>
            setFormData({
              ...formData,
              seller: { ...formData.seller, state: e.target.value },
            })
          }
        />
        {/* Item Add */}
        <h5>Invoice Items</h5>
        <div className="row mb-2">
          <div className="col">
            <input
              name="name"
              placeholder="Item Name"
              className="form-control"
              value={formData.currentItem.name}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              name="amount"
              placeholder="Amount"
              className="form-control"
              value={formData.currentItem.amount}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              name="hsn"
              placeholder="HSN"
              className="form-control"
              value={formData.currentItem.hsn}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col">
            <select
              name="gstType"
              className="form-select"
              value={formData.currentItem.gstType}
              onChange={handleChange}
            >
              <option value="">GST Type</option>
              <option value="GST">GST</option>
              <option value="Non-GST">Non-GST</option>
            </select>
          </div>
          <div className="col">
            <input
              name="cgst"
              placeholder="CGST %"
              className="form-control"
              value={formData.currentItem.cgst}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              name="sgst"
              placeholder="SGST %"
              className="form-control"
              value={formData.currentItem.sgst}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              name="igst"
              placeholder="IGST %"
              className="form-control"
              value={formData.currentItem.igst}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <button
              type="button"
              className="btn btn-success"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>
        </div>
        {/* Items List */}
        <ul className="list-group mb-3">
          {formData.items.map((item, idx) => (
            <li className="list-group-item" key={idx}>
              {item.name} — ₹{item.amount} | GST: {item.gstType} (CGST:{" "}
              {item.cgst}%, SGST: {item.sgst}%, IGST: {item.igst}%)
            </li>
          ))}
        </ul>
        {/* Payment */}
        <h5>Payment Info</h5>
        <input
          className="form-control mb-2"
          name="amountPaid"
          placeholder="Amount Paid"
          value={formData.payment.amountPaid}
          onChange={handleChange}
        />
        <select
          className="form-select mb-2"
          name="mode"
          value={formData.payment.mode}
          onChange={handleChange}
        >
          <option>Cash</option>
          <option>Card</option>
          <option>Wallet</option>
        </select>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={formData.payment.isEscrow}
            onChange={(e) =>
              setFormData({
                ...formData,
                payment: { ...formData.payment, isEscrow: e.target.checked },
              })
            }
          />
          <label className="form-check-label">Use Escrow</label>
        </div>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={formData.payment.isPartialPayment}
            onChange={(e) =>
              setFormData({
                ...formData,
                payment: {
                  ...formData.payment,
                  isPartialPayment: e.target.checked,
                },
              })
            }
          />
          <label className="form-check-label">Partial Payment</label>
        </div>
        {/* Notes */}
        <textarea
          className="form-control mb-3"
          name="notes"
          placeholder="Additional notes"
          value={formData.notes}
          onChange={handleChange}
        />
        {/* === Invoice Summary Section === */}
        <div className="mt-4">
          <h5>Invoice Summary</h5>

          <ul className="list-group mb-3">
            <li className="list-group-item d-flex justify-content-between">
              <span>Subtotal</span>
              <span>
                ₹
                {formData.items.reduce(
                  (sum, item) => sum + Number(item.amount || 0),
                  0
                )}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              <span>Total GST</span>
              <span>
                ₹
                {formData.items
                  .reduce(
                    (sum, item) =>
                      sum +
                      (Number(item.amount || 0) *
                        (Number(item.cgst || 0) +
                          Number(item.sgst || 0) +
                          Number(item.igst || 0))) /
                        100,
                    0
                  )
                  .toFixed(2)}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between fw-bold">
              <span>Grand Total</span>
              <span>
                ₹
                {formData.items
                  .reduce((sum, item) => {
                    const amt = Number(item.amount || 0);
                    const gst =
                      (amt *
                        (Number(item.cgst || 0) +
                          Number(item.sgst || 0) +
                          Number(item.igst || 0))) /
                      100;
                    return sum + amt + gst;
                  }, 0)
                  .toFixed(2)}
              </span>
            </li>
          </ul>
        </div>

        {/* Submit */}
      </form>
      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
        Submit Invoice
      </button>
    </div>
  );
};

export default InvoiceCreatePage;
