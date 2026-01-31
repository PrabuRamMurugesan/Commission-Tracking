import React from "react";
import { Container, Card } from "react-bootstrap";
import Sidebar from "../../components/Sidebar";
import { FiShield, FiEye, FiClock, FiUser } from "react-icons/fi";

const AuditTrailEmptyPage = () => {
  return (
    <div className="audit-trail-container">
      <Sidebar />
      <Container fluid className="audit-trail-content">
        <div className="empty-state-wrapper">
          <Card className="empty-state-card">
            <Card.Body className="text-center">
              {/* Icon */}
              <div className="empty-state-icon">
                <FiShield size={80} />
              </div>

              {/* Title */}
              <h2 className="empty-state-title">No Audit Records Found</h2>

              {/* Description */}
              <p className="empty-state-description">
                Audit trail records will appear here as system activities occur. Track all changes, user actions, and system events for compliance and security.
              </p>

              {/* Action Buttons */}
              <div className="empty-state-actions">
                <button className="btn btn-primary btn-lg me-3">
                  <FiEye className="me-2" />
                  View Settings
                </button>
                <button className="btn btn-outline-secondary btn-lg">
                  <FiShield className="me-2" />
                  Learn More
                </button>
              </div>

              {/* Additional Info */}
              <div className="empty-state-info mt-4">
                <p className="text-muted mb-0">
                  <small>
                    Audit logs track user actions, data changes, system events, and security activities for compliance and troubleshooting.
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
                      <FiUser size={30} color="#007bff" />
                    </div>
                    <h5>User Activity</h5>
                    <p className="text-muted small">
                      Track all user actions including logins, data modifications, and system access.
                    </p>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4">
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-icon mb-3">
                      <FiClock size={30} color="#28a745" />
                    </div>
                    <h5>Change History</h5>
                    <p className="text-muted small">
                      View complete history of data changes with before and after values.
                    </p>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4">
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-icon mb-3">
                      <FiShield size={30} color="#dc3545" />
                    </div>
                    <h5>Security Events</h5>
                    <p className="text-muted small">
                      Monitor security-related events and access attempts for compliance.
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
          .audit-trail-container {
            display: flex;
            min-height: 100vh;
            width: 100vw;
            background-color: #f8f9fa;
          }

          .audit-trail-content {
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
            .audit-trail-content {
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

export default AuditTrailEmptyPage;
