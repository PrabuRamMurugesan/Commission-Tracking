// PHASE 4: Address Management + Role-Specific Dashboards

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Tab,
  Tabs,
  Form,
  Button,
  Row,
  Col,
  Table,
  Alert,
  Toast,
  ToastContainer,
  Badge,
  Image,
} from "react-bootstrap";

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
    const [settings, setSettings] = useState({
      notifications: { email: true, sms: false, whatsapp: false },
      language: "en",
      timezone: "Asia/Kolkata",
    });
    const [theme, setTheme] = useState("light");
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const [kycFile, setKycFile] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });


  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedEmail = storedUser?.email;
  console.log(storedEmail, "storedEmail");
  
 useEffect(() => {
   async function fetchProfile() {
     if (!storedEmail) {
       console.error("Email not found in localStorage");
       return;
     }

     try {
       const res = await axios.get(
         `http://localhost:3000/api/user/profile?email=${storedEmail}`
       );
       console.log(res.data.user, "res.data.user");

       if (res.data?.user) {
         setUser(res.data.user);
         setFormData(res.data.user);
         setAddresses(res.data.user.addresses || []);
       } else {
         console.error("User not found from API");
       }
     } catch (err) {
       console.error("API call failed:", err.message);
     }
   }

   fetchProfile();
 }, []);


  const handleAccountDeactivate = async () => {
    const confirm = window.confirm(
      "Are you sure you want to deactivate your account?"
    );
    if (!confirm) return;
    await axios.delete("/api/user/account", { data: { email } });
    alert("Account deactivated successfully");
    localStorage.clear();
    window.location.href = "/signin";
  };

  const handleAdminUpdate = async () => {
    await axios.put("/api/admin/user-update", {
      email: adminView.email,
      updates: adminView,
    });
    alert("Admin changes saved");
  };
  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    const res = await axios.put("/api/user/update", formData);
    alert("Profile updated successfully!");
    setUser(res.data.user);
  };

  const handlePasswordChange = async () => {
    await axios.put("/api/user/password", { ...passwordData, email });
    alert("Password updated successfully!");
  };

  const handleKycUpload = async () => {
    if (!kycFile) return;
    const form = new FormData();
    form.append("file", kycFile);
    form.append("email", email);

    try {
      await axios.post("/api/user/upload-kyc", form);
      setUploadStatus("✅ KYC uploaded successfully!");
    } catch (err) {
      setUploadStatus("❌ Upload failed.");
    }
  };

  const handleAddAddress = async () => {
    const res = await axios.put("/api/user/address", {
      email,
      address: newAddress,
    });
    setAddresses(res.data.addresses);
    setNewAddress({
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
  };

  const handleDeleteAddress = async (index) => {
    const res = await axios.delete("/api/user/address", {
      data: { email, index },
    });
    setAddresses(res.data.addresses);
  };
  const handleProfileImageUpload = async () => {
    if (!profileImageFile) return;
    const form = new FormData();
    form.append("file", profileImageFile);
    form.append("email", email);
    await axios.post("/api/user/upload-profile-image", form);
    alert("Profile image uploaded successfully!");
    window.location.reload();
  };

  const handleSettingsUpdate = async () => {
    const res = await axios.put("/api/user/settings", { email, settings });
    alert("Settings updated successfully!");
  };
  const handleDownloadCSV = () => {
    const csv = logs
      .map((log) => `${log.loginTime},${log.ipAddress},${log.userAgent}`)
      .join("\n");
    const blob = new Blob([`Date,IP,Device\n${csv}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "login-history.csv";
    a.click();
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const renderAdminTab = () => (
    <Tab eventKey="admin" title="Admin View" > 
      <h5>Admin Tools for User Management</h5>
      <Form>
        <Form.Group className="mb-2">
          <Form.Label>User Email</Form.Label>
          <Form.Control
            value={adminView.email || ""}
            onChange={(e) =>
              setAdminView({ ...adminView, email: e.target.value })
            }
            placeholder="Enter user's email"
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Account Status</Form.Label>
          <Form.Select
            value={adminView.accountStatus || "active"}
            onChange={(e) =>
              setAdminView({ ...adminView, accountStatus: e.target.value })
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="banned">Banned</option>
            <option value="pending">Pending</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Verification Notes</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={adminView.notes || ""}
            onChange={(e) =>
              setAdminView({ ...adminView, notes: e.target.value })
            }
            placeholder="Add internal notes or comments"
          />
        </Form.Group>
        <Button onClick={handleAdminUpdate}>Save Admin Changes</Button>
      </Form>
    </Tab>
  );

  const renderRoleDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case "agent":
        return (
          <div>
            <h5>Agent Dashboard</h5>
            <ul>
              <li>
                <Badge bg="info">Total Leads: 15</Badge>
              </li>
              <li>
                <Badge bg="success">Commission Earned: ₹12,500</Badge>
              </li>
              <li>
                <Badge bg="primary">Referrals: 8</Badge>
              </li>
            </ul>
          </div>
        );
      case "vendor":
        return (
          <div>
            <h5>Vendor Dashboard</h5>
            <ul>
              <li>
                <Badge bg="warning">Products Uploaded: 22</Badge>
              </li>
              <li>
                <Badge bg="success">Orders Fulfilled: 48</Badge>
              </li>
              <li>
                <Badge bg="info">Pending Approvals: 3</Badge>
              </li>
            </ul>
          </div>
        );
      case "territory-head":
        return (
          <div>
            <h5>Territory Head Dashboard</h5>
            <ul>
              <li>
                <Badge bg="dark">Agents Managed: 10</Badge>
              </li>
              <li>
                <Badge bg="success">Monthly Sales: ₹1,45,000</Badge>
              </li>
              <li>
                <Badge bg="info">Franchise Requests: 4</Badge>
              </li>
            </ul>
          </div>
        );
      default:
        return <p>No role-specific dashboard available.</p>;
    }
  };

  if (!user) return <p>Loading user profile...</p>;

  return (
    <div
      className={`container mt-4 ${
        theme === "dark" ? "bg-dark text-light" : ""
      }`}
    >
      <h2>
        {user.name}{" "}
        <Button variant="outline-secondary" size="sm" onClick={toggleTheme}>
          Toggle Theme
        </Button>
      </h2>
      <Tabs defaultActiveKey="overview" className="mb-3">
        <Tab eventKey="overview" title="Overview">
          <Image
            src={user.profileImage || "/default-profile.png"}
            roundedCircle
            width={120}
            height={120}
            className="mb-3"
          />
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.accountStatus}
          </p>
        </Tab>
        <Tab eventKey="logins" title="Login History">
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>IP</th>
                <th>Device</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td>{new Date(log.loginTime).toLocaleString()}</td>
                  <td>{log.ipAddress}</td>
                  <td>{log.userAgent}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button onClick={handleDownloadCSV}>Download CSV</Button>
        </Tab>
        <Tab eventKey="deactivate" title="Deactivate Account">
          <h5>Danger Zone</h5>
          <p>
            This will deactivate your account. You will no longer be able to log
            in.
          </p>
          <Button variant="danger" onClick={handleAccountDeactivate}>
            Deactivate Account
          </Button>
        </Tab>

        {isAdmin && renderAdminTab()}

        {/* Other tabs remain unchanged */}
      </Tabs>
      <Tabs defaultActiveKey="overview" className="mb-3">
        <Tab eventKey="overview" title="Overview">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.accountStatus}
          </p>
          {renderRoleDashboard()}
        </Tab>
        <Tab eventKey="settings" title="Settings">
          <Form.Group className="mb-3">
            <Form.Label>Upload Profile Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setProfileImageFile(e.target.files[0])}
            />
            <Button className="mt-2" onClick={handleProfileImageUpload}>
              Upload
            </Button>
          </Form.Group>

          <h5>Notification Preferences</h5>
          <Form.Check
            type="switch"
            label="Email Notifications"
            checked={settings.notifications.email}
            onChange={() =>
              setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  email: !settings.notifications.email,
                },
              })
            }
          />
          <Form.Check
            type="switch"
            label="SMS Alerts"
            checked={settings.notifications.sms}
            onChange={() =>
              setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  sms: !settings.notifications.sms,
                },
              })
            }
          />
          <Form.Check
            type="switch"
            label="WhatsApp Updates"
            checked={settings.notifications.whatsapp}
            onChange={() =>
              setSettings({
                ...settings,
                notifications: {
                  ...settings.notifications,
                  whatsapp: !settings.notifications.whatsapp,
                },
              })
            }
          />

          <Form.Group className="mt-3">
            <Form.Label>Language</Form.Label>
            <Form.Select
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
            >
              <option value="en">English</option>
              <option value="ta">Tamil</option>
              <option value="hi">Hindi</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-3">
            <Form.Label>Timezone</Form.Label>
            <Form.Control
              type="text"
              value={settings.timezone}
              onChange={(e) =>
                setSettings({ ...settings, timezone: e.target.value })
              }
            />
          </Form.Group>

          <Button className="mt-4" onClick={handleSettingsUpdate}>
            Save Settings
          </Button>
        </Tab>
        <Tab eventKey="edit" title="Edit Profile">
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleProfileChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Phone
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleProfileChange}
                />
              </Col>
            </Form.Group>

            <Button onClick={handleProfileUpdate}>Save Changes</Button>
          </Form>
        </Tab>

        <Tab eventKey="security" title="Password Settings">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button onClick={handlePasswordChange}>Change Password</Button>
          </Form>
        </Tab>

        <Tab eventKey="logins" title="Login History">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>IP Address</th>
                <th>Device</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.loginTime).toLocaleString()}</td>
                  <td>{log.ipAddress}</td>
                  <td>{log.userAgent}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        <Tab eventKey="wallet" title="Wallet / Points">
          <h4>Your Wallet Balance: ₹{walletBalance}</h4>
          <p>(More wallet features coming soon...)</p>
        </Tab>

        <Tab eventKey="kyc" title="KYC Upload">
          <Form.Group className="mb-3">
            <Form.Label>Upload KYC Document (PDF/Image)</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setKycFile(e.target.files[0])}
            />
          </Form.Group>
          <Button onClick={handleKycUpload}>Upload KYC</Button>
          {uploadStatus && (
            <Alert variant="info" className="mt-3">
              {uploadStatus}
            </Alert>
          )}
        </Tab>

        <Tab eventKey="addresses" title="My Addresses">
          <h5>Add New Address</h5>
          <Form>
            <Form.Group className="mb-2">
              <Form.Control
                placeholder="Street"
                value={newAddress.street}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, street: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                placeholder="City"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                placeholder="State"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control
                placeholder="Country"
                value={newAddress.country}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, country: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                placeholder="Pincode"
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, pincode: e.target.value })
                }
              />
            </Form.Group>
            <Button onClick={handleAddAddress}>Add Address</Button>
          </Form>

          <h5 className="mt-4">Saved Addresses</h5>
          <ul className="list-group">
            {addresses.map((addr, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {addr.street}, {addr.city}, {addr.state}, {addr.country} -{" "}
                {addr.pincode}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteAddress(i)}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </Tab>
      </Tabs>
      <ToastContainer position="top-end" className="p-3">
        <Toast show={toast.show} bg={toast.variant}>
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default UserProfilePage;
