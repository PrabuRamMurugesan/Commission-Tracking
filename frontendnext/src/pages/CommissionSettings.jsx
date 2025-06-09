import React, { useState, useEffect } from "react";
import TierModal from "../components/Reports/TierModal";
import axios from "axios";
import {
  Button,
  Form,
  Row,
  Col,
  Accordion,
  Card,
  Table,
} from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const CommissionSettings = () => {
  const [showTierModal, setShowTierModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [slabs, setSlabs] = useState([]);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [commission, setCommission] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [commissionValue, setCommissionValue] = useState("");
  const [slabType, setSlabType] = useState("order_value"); // default or selected
  const [commissionType, setCommissionType] = useState("Flat"); // default or selected
  const [role, setRole] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("BBSCART"); // example
  const [commissionPercentage, setCommissionPercentage] = useState("");
  const [productName, setProductName] = useState("");
  const [productCommissionType, setProductCommissionType] =
    useState("percentage");
  const [productCommissionValue, setProductCommissionValue] = useState("");
  const [productCommissions, setProductCommissions] = useState([]);
  const [targetType, setTargetType] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [bonusType, setBonusType] = useState("");
  const [bonusValue, setBonusValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [settings, setSettings] = useState({
    Franchise: { type: "Percentage", value: 5 },
    TerritoryHead: { type: "Percentage", value: 1.6 },
    Agent: { type: "Percentage", value: 3 },
    Vendor: { type: "Percentage", value: 4 },
    CBAV: { type: "Percentage", value: 2.5 },
    eligibility: { min: 0, max: 10000 },
  });
  const openTierModal = (role) => {
    setSelectedRole(role);
    setShowTierModal(true);
  };
  const handleChange = (role, field, val) => {
    setSettings({ ...settings, [role]: { ...settings[role], [field]: val } });
  };
  // const handleAddAchievementBonus = async () => {
  //   try {
  //     const payload = {
  //       role: role, // e.g., "Agent"
  //       targetType: targetType.toLowerCase(),
  //       targetValue: parseFloat(targetValue),
  //       bonusType: bonusType.toLowerCase(),
  //       bonusValue: parseFloat(bonusValue),
  //       startDate: new Date(startDate),
  //       endDate: new Date(endDate),
  //     };

  //     const res = await axios.post("/api/commission-achievement", payload);
  //     console.log("✅ Bonus Added:", res.data);
  //     toast.success("Achievement bonus saved!");
  //     fetchAllBonuses(); // reload table (optional)
  //   } catch (err) {
  //     console.error("POST error:", err);
  //     toast.error("Failed to save bonus.");
  //   }
  // };

  // ⛳ Add new slab
  const handleAddAchievementBonus = async () => {
    // Validate fields
    if (
      !role ||
      !targetType ||
      !targetValue ||
      !bonusType ||
      !bonusValue ||
      !startDate ||
      !endDate
    ) {
      alert("Please fill out all fields.");
      return;
    }

    const payload = {
      role: role.toLowerCase(),
      targetType: targetType.toLowerCase(),
      targetValue: Number(targetValue),
      bonusType,
      bonusValue: Number(bonusValue),
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
    };

    console.log("🚀 Payload being sent:", payload);

    try {
      const res = await axios.post("/api/commission-achievement", payload);
      console.log("✅ Success:", res.data);

      // Optional: clear form or show toast here
      alert("Achievement Bonus added successfully!");
    } catch (error) {
      console.error("❌ POST error:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.error || "Something went wrong"}`);
    }
  };
  
  const handleAddSlab = async () => {
    try {
      if (!commissionType) {
        toast.error("Commission Type is required.");
        return;
      }

      // Validate based on commissionType
      if (commissionType === "percentage") {
        if (!commissionValue || isNaN(commissionValue)) {
          toast.error(
            "Commission Percentage is required and must be a number."
          );
          return;
        }
      } else if (commissionType === "Flat") {
        if (!commissionValue || isNaN(commissionValue)) {
          toast.error("Commission Value is required and must be a number.");
          return;
        }
      }

      const newSlab = {
        platform: selectedPlatform || "BBSCART",
        role: selectedRole || "Vendor",
        slabType:
          slabType === "order_value"
            ? "OrderValue"
            : slabType === "quantity"
            ? "QuantityBased"
            : "Custom",
        commissionType: commissionType === "percentage" ? "percentage" : "Flat",
        minValue: parseFloat(minValue) || 0,
        maxValue: parseFloat(maxValue) || 0,
      };

      // Attach correct field based on commissionType
      if (commissionType === "percentage") {
        newSlab.commissionPercentage = parseFloat(commissionPercentage);
      } else if (commissionType === "Flat") {
        newSlab.commissionValue = parseFloat(commissionValue);
      }

      const response = await axios.post("/api/commission-slab", newSlab);
      console.log("Slab added:", response.data);
      toast.success("Slab added successfully!");
      fetchSlabs();
    } catch (error) {
      console.error("POST Slab error:", error);
      toast.error("Error adding commission slab");
    }
  };

  useEffect(() => {
    fetchSlabs();
  }, []);

  // 🔁 Fetch slabs from backend
  const fetchSlabs = async () => {
    try {
      const response = await axios.get("/api/commission-slab");
      setSlabs(response.data);
    } catch (error) {
      console.error("❌ Failed to fetch slabs:", error);
    }
  };
  useEffect(() => {
    axios.get("/api/commission-achievement").then((res) => {
      setBonusType(res.data);
    });
  }, []);

  const fetchProductCommissions = async () => {
    try {
      const res = await axios.get(
        `/api/commission-product?platform=${selectedPlatform}&role=${selectedRole}`
      );
      setProductCommissions(res.data);
    } catch (err) {
      console.error("Fetch Product Commissions Error", err);
    }
  };
  const handleAddProductCommission = async () => {
    try {
      const payload = {
        platform: selectedPlatform,
        role: selectedRole,
        productName: productName,
        commissionType:
          productCommissionType === "flat" ? "Flat" : "Percentage",
        commissionValue: parseFloat(productCommissionValue),
      };

      const res = await axios.post("/api/commission-product", payload);
      toast.success("Product Commission Saved");
      fetchProductCommissions(); // refresh list
    } catch (error) {
      console.error("POST Product Commission error:", error);
      toast.error("Error saving product commission");
    }
  };

  console.log("🔍 Payload being sent:", {
    role,
    targetType,
    targetValue,
    bonusType,
    bonusValue,
    startDate,
    endDate,
  });

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Commission Settings</h3>

      {/* A. Role-Based Commission */}
      <Card className="mb-4 p-3">
        <h5>Role-Based Commission Configuration</h5>
        <Row>
          {Object.entries(settings).map(([role, config]) =>
            role !== "eligibility" ? (
              <Col md={6} key={role} className="mb-3">
                <strong>{role}</strong>
                <Form.Select
                  className="mb-2"
                  value={config.type}
                  onChange={(e) => handleChange(role, "type", e.target.value)}
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="flat">Flat ₹</option>
                </Form.Select>
                <Form.Control
                  type="number"
                  value={config.value}
                  onChange={(e) => handleChange(role, "value", e.target.value)}
                  placeholder="Enter value"
                />
                <Button
                  className="mt-2"
                  size="sm"
                  onClick={() => openTierModal(role)}
                >
                  + Add Tier
                </Button>
              </Col>
            ) : null
          )}
        </Row>

        {/* Eligibility Threshold */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label>Minimum Threshold ₹</Form.Label>
            <Form.Control
              type="number"
              value={settings.eligibility.min}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  eligibility: { ...settings.eligibility, min: e.target.value },
                })
              }
            />
          </Col>
          <Col md={6}>
            <Form.Label>Maximum Cap ₹</Form.Label>
            <Form.Control
              type="number"
              value={settings.eligibility.max}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  eligibility: { ...settings.eligibility, max: e.target.value },
                })
              }
            />
          </Col>
        </Row>
        <Button variant="success">Save Role-Based Settings</Button>
      </Card>

      {/* B. All Other Commissions */}
      <Accordion defaultActiveKey="0">
        {/* 1. Product / Service Based */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Product / Service Based Commission
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={4}>
                <Form.Label>Platform</Form.Label>
                <Form.Select
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  <option>BBSCART</option>
                  <option>Golddex</option>
                  <option>EmerJobs</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Agent">Agent</option>
                  <option value="Vendor">Vendor</option>
                  <option value="Franchise">Franchise</option>
                  <option value="TerritoryHead">Territory Head</option>
                  <option value="CBAV">CustomerBecomeAVendor</option>
                </Form.Select>
              </Col>

              <Col md={4}>
                <Form.Label>Product/Service</Form.Label>
                <Form.Control
                  placeholder="Enter Product or Service Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={4}>
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={productCommissionType}
                  onChange={(e) => setProductCommissionType(e.target.value)}
                >
                  <option value="percentage">Percentage</option>
                  <option value="flat">Flat</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Value</Form.Label>
                <Form.Control
                  type="number"
                  value={productCommissionValue}
                  onChange={(e) => setProductCommissionValue(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Button className="mt-4" onClick={handleAddProductCommission}>
                  + Add Rule
                </Button>
              </Col>
            </Row>

            {/* Example Table */}
            <Table bordered className="mt-3">
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Role</th>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>BBSCART</td>
                  <td>Vendor</td>
                  <td>Necklace</td>
                  <td>%</td>
                  <td>4</td>
                  <td>
                    <Button size="sm">Edit</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        {/* 2. Order Value Slabs */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>Order Value Based Slab Commission</Accordion.Header>
          <Accordion.Body>
            <Table bordered>
              <thead>
                <tr>
                  <th>Range (₹)</th>
                  <th>Commission %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((slab, index) => (
                  <tr key={index}>
                    <td>
                      ₹{slab.minValue} - ₹{slab.maxValue}
                    </td>
                    <td>
                      {slab.commissionType === "percentage"
                        ? `${slab.commissionPercentage}%`
                        : `${slab.commissionValue}%`}
                    </td>
                    <td>
                      <Button size="sm" disabled>
                        Edit
                      </Button>
                      {/* Enable Edit/Delete later */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Row className="mt-2">
              <Col md={2}>
                <Form.Label>Min ₹</Form.Label>
                <Form.Control
                  type="number"
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                />
              </Col>

              <Col md={2}>
                <Form.Label>Max ₹</Form.Label>
                <Form.Control
                  type="number"
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                />
              </Col>

              <Col md={2}>
                <Form.Label>Commission %</Form.Label>
                <Form.Control
                  type="number"
                  value={commissionValue}
                  onChange={(e) => setCommissionValue(e.target.value)}
                />
              </Col>

              <Col md={2}>
                <Form.Label>Commission Type</Form.Label>
                <Form.Select
                  value={commissionType}
                  onChange={(e) => setCommissionType(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="flat">Flat</option>
                  <option value="percentage">Percentage</option>
                </Form.Select>
              </Col>

              <Col md={2}>
                <Form.Label>Slab Type</Form.Label>
                <Form.Select
                  value={slabType}
                  onChange={(e) => setSlabType(e.target.value)}
                >
                  <option value="order_value">Order Value</option>
                  <option value="quantity">Quantity</option>
                  <option value="custom">Custom</option>
                </Form.Select>
              </Col>

              <Col md={2}>
                <Button className="mt-4 w-100" onClick={handleAddSlab}>
                  + Add Slab
                </Button>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>

        {/* 3. Achievement-Based Commission */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            Achievement-Based Bonus Commission
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={3}>
                <Form.Label>Role</Form.Label>
                <Form.Select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option>Agent</option>
                  <option>Vendor</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label>Target Type</Form.Label>
                <Form.Select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                >
                  <option value="">Select Target Type</option>
                  <option value="Sales">Sales</option>
                  <option value="Revenue">Revenue</option>
                  <option value="Referrals">Referrals</option>
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label>Target Value</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Target Value"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label>Select Bonus Type</Form.Label>
                <Form.Select
                  value={bonusType}
                  onChange={(e) => setBonusType(e.target.value)}
                >
                  <option value="">Select Bonus Type</option>
                  <option value="cash">Cash</option>
                  <option value="coupon">Coupon</option>
                </Form.Select>
              </Col>

              <Col md={3}>
                <Form.Label>Bonus % / ₹</Form.Label>
                <Form.Control
                  type="number"
                  value={bonusValue}
                  onChange={(e) => setBonusValue(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={6}>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Col>
            </Row>
            <Button className="mt-3" onClick={handleAddAchievementBonus}>
              + Add Achievement Bonus
            </Button>
          </Accordion.Body>
        </Accordion.Item>
        {/* 4. EmerJobs Referral Commission */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            EmerJobs Referral Commission Logic
          </Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={4}>
                <Form.Label>Role</Form.Label>
                <Form.Select>
                  <option>Recruiter</option>
                  <option>Referrer</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Stage</Form.Label>
                <Form.Select>
                  <option>Application</option>
                  <option>Interview</option>
                  <option>Hired</option>
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Label>Type</Form.Label>
                <Form.Select>
                  <option>Percentage</option>
                  <option>Flat</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col md={4}>
                <Form.Label>Value</Form.Label>
                <Form.Control type="number" />
              </Col>
              <Col md={4}>
                <Form.Label>Remarks</Form.Label>
                <Form.Control />
              </Col>
              <Col md={4}>
                <Button className="mt-4">+ Add EmerJobs Rule</Button>
              </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <TierModal
        show={showTierModal}
        onClose={() => setShowTierModal(false)}
        role={selectedRole}
        platform={"BBSCART"} // dynamic platform support later
      />
    </div>
  );
};

export default CommissionSettings;
