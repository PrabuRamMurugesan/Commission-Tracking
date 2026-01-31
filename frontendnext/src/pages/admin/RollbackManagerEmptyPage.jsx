import React from "react";
import { Container, Card } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import { FiRotateCcw, FiClock, FiAlertTriangle, FiSave } from "react-icons/fi";

const RollbackManagerEmptyPage = () => {
  return (
    <div className="rollback-manager-container">
      <Sidebar />
      <Container fluid className="rollback-manager-content">
        <div className="empty-state-wrapper">
          <Card className="empty-state-card">
            <Card.Body className="text-center">
              {/* Icon */}
              <div className="empty-state-icon">
                <FiRotateCcw size={80} />
              </div>

              {/* Title */}
              <h2 className="empty-state-title">No Rollback History Available</h2>

              {/* Description */}
              <p className="empty-state-description">
                Rollback history will appear here once you perform rollback operations. Safely revert changes to products or uploads when needed.
              </p>

              {/* Action Buttons */}
              <div className="empty-state-actions">
                <button className="btn btn-primary btn-lg me-3">
                  <FiClock className="me-2" />
                  View Upload History
                </button>
                <button className="btn btn-outline-secondary btn-lg">
                  <FiRotateCcw className="me-2" />
                  Learn About Rollback
                </button>
              </div>

              {/* Additional Info */}
              <div className="empty-state-info mt-4">
                <p className="text-muted mb-0">
                  <small>
                    Rollback allows you to undo changes by file or product ID. All rollback operations are logged for audit purposes.
                  </small>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Feature Cards */}
          <div className="feature-cards mt-4">
            <div className="row g-3">
              <div className="col-md-4">
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-icon mb-3">
                      <FiRotateCcw size={30} color="#007bff" />
                    </div>
                    <h5>File Rollback</h5>
                    <p className="text-muted small">
                      Revert all changes made by a specific upload file in one operation.
                    </p>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4">
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-icon mb-3">
                      <FiSave size={30} color="#28a745" />
                    </div>
                    <h5>Product Rollback</h5>
                    <p className="text-muted small">
                      Restore individual products to their previous state using product ID.
                    </p>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4">
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-icon mb-3">
                      <FiAlertTriangle size={30} color="#ffc107" />
                    </div>
                    <h5>Safe Recovery</h5>
                    <p className="text-muted small">
                      All rollback operations are logged and can be reviewed before execution.
                    </p>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <style>
        {`
          .rollback-manager-container {
            display: flex;
            min-height: 100vh;
            width: 100vw;
            background-color: #f8f9fa;
          }

          .rollback-manager-content {
            flex: 1;
            padding: 7% 20px;
            overflow-y: auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .empty-state-wrapper {
            width: 100%;
            max-width: 900px;
          }

          .empty-state-card {
            border: none;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
            padding: 40px;
            background: white;
          }

          .empty-state-icon {
            margin-bottom: 24px;
            color: #6c757d;
            opacity: 0.6;
          }

          .empty-state-title {
            font-size: 28px;
            font-weight: 600;
            color: #212529;
            margin-bottom: 12px;
          }

          .empty-state-description {
            font-size: 16px;
            color: #6c757d;
            margin-bottom: 32px;
            line-height: 1.6;
          }

          .empty-state-actions {
            margin-top: 32px;
          }

          .empty-state-actions .btn {
            padding: 12px 24px;
            font-weight: 500;
            border-radius: 8px;
            transition: all 0.3s ease;
          }

          .empty-state-actions .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
          }

          .empty-state-actions .btn-primary:hover {
            background-color: #0056b3;
            border-color: #0056b3;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
          }

          .empty-state-actions .btn-outline-secondary {
            border-color: #6c757d;
            color: #6c757d;
          }

          .empty-state-actions .btn-outline-secondary:hover {
            background-color: #6c757d;
            border-color: #6c757d;
            color: white;
            transform: translateY(-2px);
          }

          .empty-state-info {
            padding-top: 24px;
            border-top: 1px solid #e9ecef;
          }

          .feature-cards {
            margin-top: 32px;
          }

          .feature-card {
            border: 1px solid #e9ecef;
            border-radius: 12px;
            transition: all 0.3s ease;
            background: white;
          }

          .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            border-color: #007bff;
          }

          .feature-icon {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background-color: #f8f9fa;
            border-radius: 12px;
          }

          .feature-card h5 {
            font-size: 18px;
            font-weight: 600;
            color: #212529;
            margin-bottom: 8px;
          }

          .feature-card p {
            font-size: 14px;
            line-height: 1.5;
            margin-bottom: 0;
          }

          @media (max-width: 768px) {
            .rollback-manager-content {
              padding: 7rem 15px;
            }

            .empty-state-card {
              padding: 30px 20px;
            }

            .empty-state-title {
              font-size: 24px;
            }

            .empty-state-description {
              font-size: 14px;
            }

            .empty-state-actions {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .empty-state-actions .btn {
              width: 100%;
            }

            .feature-cards .row {
              margin: 0;
            }

            .feature-cards .col-md-4 {
              padding: 0;
              margin-bottom: 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default RollbackManagerEmptyPage;
