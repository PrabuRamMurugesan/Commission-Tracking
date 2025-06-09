import React, { useState } from "react";
import { Form, Button, InputGroup, Card } from "react-bootstrap";

const CommissionEstimator = () => {
  const [salesAmount, setSalesAmount] = useState("");
  const [commissionRate, setCommissionRate] = useState(10);
  const [calculatedCommission, setCalculatedCommission] = useState(0);

  const handleCalculate = () => {
    const commission = (salesAmount * commissionRate) / 100;
    setCalculatedCommission(commission);
  };

  return (
    <Card className="commission-estimator-card">
      <Card.Body>
        <Card.Title>💰 Commission Estimator</Card.Title>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Sales Amount ($)</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                value={salesAmount}
                onChange={(e) => setSalesAmount(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Commission Rate (%)</Form.Label>
            <Form.Control
              type="number"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" onClick={handleCalculate}>
            Calculate
          </Button>

          <h5 className="mt-3">
            Estimated Commission: <strong>${calculatedCommission.toFixed(2)}</strong>
          </h5>
        </Form>
      </Card.Body>

      <style>
        {`
        .commission-estimator-card {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
`}
      </style>
    </Card>
  );
};

export default CommissionEstimator;
