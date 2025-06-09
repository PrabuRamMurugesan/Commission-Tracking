import React, { useState } from "react";
import { Modal, Button, Form, Row, Col, Table } from "react-bootstrap";

const TierModal = ({ show, onClose, role, platform }) => {
  const [tiers, setTiers] = useState([]);
  const [form, setForm] = useState({
    tierName: "",
    targetType: "Sales",
    targetValue: "",
    bonusType: "Percentage",
    bonusValue: "",
  });

  const handleChange = (field, val) => {
    setForm({ ...form, [field]: val });
  };

  const addTier = () => {
    if (!form.tierName || !form.targetValue || !form.bonusValue)
      return alert("Fill all fields");
    setTiers([...tiers, form]);
    setForm({ ...form, tierName: "", targetValue: "", bonusValue: "" });
  };

  const removeTier = (index) => {
    const updated = [...tiers];
    updated.splice(index, 1);
    setTiers(updated);
  };

  const saveTiers = async () => {
    const res = await fetch("/api/commission-tier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, platform, tiers }),
    });
    const data = await res.json();
    alert(data?.message || "Tiers saved");
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Configure Tiers for {role}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={3}>
            <Form.Label>Tier Name</Form.Label>
            <Form.Control
              value={form.tierName}
              onChange={(e) => handleChange("tierName", e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Label>Target Type</Form.Label>
            <Form.Select
              value={form.targetType}
              onChange={(e) => handleChange("targetType", e.target.value)}
            >
              <option>Sales</option>
              <option>Revenue</option>
              <option>Referrals</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>Target</Form.Label>
            <Form.Control
              type="number"
              value={form.targetValue}
              onChange={(e) => handleChange("targetValue", e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Label>Bonus Type</Form.Label>
            <Form.Select
              value={form.bonusType}
              onChange={(e) => handleChange("bonusType", e.target.value)}
            >
              <option>Percentage</option>
              <option>Flat</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label>Bonus</Form.Label>
            <Form.Control
              type="number"
              value={form.bonusValue}
              onChange={(e) => handleChange("bonusValue", e.target.value)}
            />
          </Col>
        </Row>
        <Button className="mt-3" onClick={addTier}>
          + Add Tier
        </Button>

        <Table bordered className="mt-3">
          <thead>
            <tr>
              <th>Tier</th>
              <th>Target</th>
              <th>Bonus</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, i) => (
              <tr key={i}>
                <td>{tier.tierName}</td>
                <td>
                  {tier.targetType}: {tier.targetValue}
                </td>
                <td>
                  {tier.bonusType} {tier.bonusValue}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => removeTier(i)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="success" onClick={saveTiers}>
          Save Tiers
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TierModal;
