// Enhanced Profile Page with all integrations
import { useEffect, useState, useRef } from "react";
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
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  const [loading, setLoading] = useState(false);

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
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedEmail = storedUser?.email || "";

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  useEffect(() => {
    async function fetchProfile() {
      if (!storedEmail) {
        console.error("Email not found in localStorage");
        return;
      }

      try {
        setLoading(true);
        const [profileRes, logsRes] = await Promise.all([
          axios.get(`/api/user/profile?email=${storedEmail}`),
          axios.get(`/api/user/login-log?email=${storedEmail}`),

        ]);

        if (profileRes.data?.user) {
          setUser(profileRes.data.user);
          setFormData(profileRes.data.user);
          setAddresses(profileRes.data.user.addresses || []);
          // Set profile image preview with full URL
          const profileImg = profileRes.data.user.profileImage || profileRes.data.user.profilePic;
          if (profileImg) {
            let fullImageUrl;
            if (profileImg.startsWith('http')) {
              fullImageUrl = profileImg;
            } else if (profileImg.startsWith('/uploads')) {
              // Convert /uploads/profile-images/file.jpg to /api/uploads/profile-images/file.jpg
              fullImageUrl = `/api${profileImg}`;
            } else {
              fullImageUrl = `/api/uploads/profile-images/${profileImg}`;
            }
            setProfileImagePreview(fullImageUrl);
          }
        }

        if (logsRes.data?.logs) {
          setLogs(logsRes.data.logs);
        }
      } catch (err) {
        console.error("API call failed:", err.message);
        showToast("Failed to load profile data", "danger");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [storedEmail]);

  const handleAccountDeactivate = async () => {
    const confirm = window.confirm(
      "Are you sure you want to deactivate your account?"
    );
    if (!confirm) return;
    try {
      await axios.delete(`/api/user/account`, {
        data: { email: storedEmail }
      });
      showToast("Account deactivated successfully", "success");
      localStorage.clear();
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (err) {
      showToast("Failed to deactivate account", "danger");
    }
  };

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      // Only send the fields that can be updated
      const updatePayload = {
        email: storedEmail,
        name: formData.name,
        phone: formData.phone,
      };

      // Only include fields that have values
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] === undefined || updatePayload[key] === null) {
          delete updatePayload[key];
        }
      });

      const res = await axios.put(`/api/user/update`, updatePayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.data?.user) {
        setUser(res.data.user);
        setFormData(res.data.user);
        showToast("Profile updated successfully!", "success");
      } else {
        showToast("Profile updated but no user data returned", "warning");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to update profile";
      showToast(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      showToast("Please fill all password fields", "warning");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "warning");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast("Password must be at least 6 characters", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`/api/user/password`, {
        email: storedEmail,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        showToast("Password updated successfully!", "success");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Password update error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to update password";
      showToast(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleKycUpload = async () => {
    if (!kycFile) {
      showToast("Please select a file to upload", "warning");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("file", kycFile);
      form.append("email", storedEmail);

      const res = await axios.post(`/api/user/upload-kyc`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("✅ KYC uploaded successfully!");
      showToast("KYC document uploaded successfully!", "success");
      setKycFile(null);

      // Refresh user data
      const profileRes = await axios.get(`/api/user/profile?email=${storedEmail}`);
      if (profileRes.data?.user) {
        setUser(profileRes.data.user);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Upload failed";
      setUploadStatus("❌ " + errorMsg);
      showToast(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.country || !newAddress.pincode) {
      showToast("Please fill all address fields", "warning");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`/api/user/address`, {
        email: storedEmail,
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
      showToast("Address added successfully!", "success");
    } catch (err) {
      showToast("Failed to add address", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      setLoading(true);
      const res = await axios.delete(`/api/user/address`, {
        data: { email: storedEmail, index },
      });
      setAddresses(res.data.addresses);
      showToast("Address deleted successfully!", "success");
    } catch (err) {
      showToast("Failed to delete address", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImageFile) {
      showToast("Please select an image to upload", "warning");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("file", profileImageFile);
      form.append("email", storedEmail);

      const res = await axios.post(`/api/user/upload-profile-image`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Update preview immediately with the uploaded image URL
      let imageUrl = res.data.profileImage;
      if (!imageUrl && res.data.profileImageRelative) {
        // Convert relative path to full API URL
        if (res.data.profileImageRelative.startsWith('/uploads')) {
          imageUrl = `/api${res.data.profileImageRelative}`;
        } else {
          imageUrl = `/api/uploads/profile-images/${res.data.profileImageRelative}`;
        }
      }
      if (imageUrl) {
        setProfileImagePreview(imageUrl);
      }

      showToast("Profile image uploaded successfully!", "success");

      // Keep the preview from the response, then refresh user data
      // Refresh user data to sync with backend
      const profileRes = await axios.get(`/api/user/profile?email=${storedEmail}`);
      if (profileRes.data?.user) {
        setUser(profileRes.data.user);
        // Ensure preview is set from updated user data
        const updatedImageUrl = profileRes.data.user.profileImage || profileRes.data.user.profilePic;
        if (updatedImageUrl) {
          let fullImageUrl;
          if (updatedImageUrl.startsWith('http')) {
            fullImageUrl = updatedImageUrl;
          } else if (updatedImageUrl.startsWith('/uploads')) {
            // Convert /uploads/profile-images/file.jpg to /api/uploads/profile-images/file.jpg
            fullImageUrl = `/api${updatedImageUrl}`;
          } else {
            fullImageUrl = `/api/uploads/profile-images/${updatedImageUrl}`;
          }
          // Only update preview if we got a valid URL
          if (fullImageUrl && fullImageUrl !== '/api/uploads/profile-images/undefined') {
            setProfileImagePreview(fullImageUrl);
          }
        }
      }

      // Don't clear the preview - keep it visible
      // Only clear the file input so user can upload again if needed
      setProfileImageFile(null);

      // Reset file input element using ref
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Upload failed";
      showToast(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/user/settings`, {
        email: storedEmail,
        settings,
      });
      showToast("Settings updated successfully!", "success");
    } catch (err) {
      showToast("Failed to update settings", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = () => {
    if (logs.length === 0) {
      showToast("No login history available", "warning");
      return;
    }

    const csv = logs
      .map((log) => {
        const date = log.loginTime
          ? new Date(log.loginTime).toLocaleString()
          : log.createdAt
            ? new Date(log.createdAt).toLocaleString()
            : "N/A";
        return date;
      })
      .join("\n");
    const blob = new Blob([`Date\n${csv}`], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "login-history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      // Create preview from selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      // Don't clear preview if no file selected (e.g., cancel button clicked)
      // Only clear the file reference
      setProfileImageFile(null);
    }
  };

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const renderRoleDashboard = () => {
    if (!user) return null;
    switch (user.role) {
      case "agent":
        return (
          <div className="mt-3">
            <h5>Agent Dashboard</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Badge bg="info">Total Leads: 15</Badge>
              </li>
              <li className="mb-2">
                <Badge bg="success">Commission Earned: ₹12,500</Badge>
              </li>
              <li className="mb-2">
                <Badge bg="primary">Referrals: 8</Badge>
              </li>
            </ul>
          </div>
        );
      case "vendor":
        return (
          <div className="mt-3">
            <h5>Vendor Dashboard</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Badge bg="warning">Products Uploaded: 22</Badge>
              </li>
              <li className="mb-2">
                <Badge bg="success">Orders Fulfilled: 48</Badge>
              </li>
              <li className="mb-2">
                <Badge bg="info">Pending Approvals: 3</Badge>
              </li>
            </ul>
          </div>
        );
      case "territory":
      case "territory-head":
        return (
          <div className="mt-3">
            <h5>Territory Head Dashboard</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Badge bg="dark">Agents Managed: 10</Badge>
              </li>
              <li className="mb-2">
                <Badge bg="success">Monthly Sales: ₹1,45,000</Badge>
              </li>
              <li className="mb-2">
                <Badge bg="info">Franchise Requests: 4</Badge>
              </li>
            </ul>
          </div>
        );
      default:
        return <p className="mt-3">No role-specific dashboard available.</p>;
    }
  };

  if (loading && !user) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">User profile not found. Please log in again.</Alert>
      </div>
    );
  }

  return (
    <div className={`container mt-4 ${theme === "dark" ? "bg-dark text-light" : ""}`}>
      <div className="d-flex flex-column justify-content-center p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">{user.name || "User"}</h2>
          <Button variant="outline-secondary" size="sm" onClick={toggleTheme}>
            Toggle Theme
          </Button>
        </div>

        <Tabs defaultActiveKey="overview" className="mb-3">
          <Tab eventKey="overview" title="Overview">
            <Row className="mt-3">
              <Col md={3} className="text-center mb-4">
                <div className="position-relative d-inline-block">
                  <Image
                    src={
                      profileImagePreview ||
                      (user.profileImage
                        ? (user.profileImage.startsWith('http')
                          ? user.profileImage
                          : user.profileImage.startsWith('/uploads')
                           ? `/api${user.profileImage}`
                            : `/api/uploads/profile-images/${user.profileImage}`)
                        : null) ||
                      (user.profilePic
                        ? (user.profilePic.startsWith('http')
                          ? user.profilePic
                          : user.profilePic.startsWith('/uploads')
                            ? `/api${user.profilePic}`
                            : `/api/uploads/profile-images/${user.profilePic}`)
                        : null) ||
                      "/default-profile.png"
                    }
                    roundedCircle
                    width={150}
                    height={150}
                    className="mb-3 border border-secondary"
                    style={{ objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/default-profile.png";
                    }}
                  />
                </div>
              </Col>
              <Col md={9}>
                <div className="profile-info">
                  <p className="mb-2">
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p className="mb-2">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="mb-2">
                    <strong>Role:</strong> <Badge bg="primary">{user.role}</Badge>
                  </p>
                  <p className="mb-2">
                    <strong>Status:</strong>{" "}
                    <Badge bg={user.accountStatus === "active" ? "success" : "secondary"}>
                      {user.accountStatus || "active"}
                    </Badge>
                  </p>
                </div>
              </Col>
            </Row>
            {renderRoleDashboard()}
          </Tab>

          <Tab eventKey="logins" title="Login History">
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Login History</h5>
                {logs.length > 0 && (
                  <Button variant="outline-primary" size="sm" onClick={handleDownloadCSV}>
                    Download CSV
                  </Button>
                )}
              </div>
              {logs.length === 0 ? (
                <Alert variant="info">No login history available.</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i}>
                        <td>
                          {log.loginTime
                            ? new Date(log.loginTime).toLocaleString()
                            : log.createdAt
                              ? new Date(log.createdAt).toLocaleString()
                              : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Tab>

          <Tab eventKey="deactivate" title="Deactivate Account">
            <div className="mt-3">
              <Alert variant="danger">
                <h5>Danger Zone</h5>
                <p>
                  This will deactivate your account. You will no longer be able to log in.
                </p>
                <Button variant="danger" onClick={handleAccountDeactivate}>
                  Deactivate Account
                </Button>
              </Alert>
            </div>
          </Tab>
        </Tabs>

        <Tabs defaultActiveKey="overview" className="mb-3">
          <Tab eventKey="overview" title="Overview">
            <div className="mt-3">
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
                <strong>Status:</strong> {user.accountStatus || "active"}
              </p>
              {renderRoleDashboard()}
            </div>
          </Tab>

          <Tab eventKey="settings" title="Settings">
            <div className="mt-3">
              <Form.Group className="mb-4">
                <Form.Label>
                  <strong>Upload Profile Image</strong>
                </Form.Label>
                <div className="d-flex align-items-center gap-3">
                  <Form.Control
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-auto"
                  />
                  <Button onClick={handleProfileImageUpload} disabled={!profileImageFile || loading}>
                    {loading ? "Uploading..." : "Upload"}
                  </Button>
                </div>
                {profileImagePreview && (
                  <div className="mt-2">
                    <Image
                      src={profileImagePreview}
                      roundedCircle
                      width={100}
                      height={100}
                      className="border"
                      style={{ objectFit: "cover" }}
                      onError={(e) => {
                        e.target.src = "/default-profile.png";
                      }}
                    />
                  </div>
                )}
              </Form.Group>

              <hr />

              <h5 className="mb-3">Notification Preferences</h5>
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
                className="mb-2"
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
                className="mb-2"
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
                className="mb-3"
              />

              <Form.Group className="mb-3">
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

              <Form.Group className="mb-3">
                <Form.Label>Timezone</Form.Label>
                <Form.Control
                  type="text"
                  value={settings.timezone}
                  onChange={(e) =>
                    setSettings({ ...settings, timezone: e.target.value })
                  }
                />
              </Form.Group>

              <Button onClick={handleSettingsUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </Tab>

          <Tab eventKey="edit" title="Edit Profile">
            <div className="mt-3">
              <Form>
                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>
                    Name
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleProfileChange}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3">
                  <Form.Label column sm={3}>
                    Phone
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleProfileChange}
                    />
                  </Col>
                </Form.Group>

                <Button onClick={handleProfileUpdate} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Form>
            </div>
          </Tab>

          <Tab eventKey="security" title="Password Settings">
            <div className="mt-3">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Enter current password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter new password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm new password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button onClick={handlePasswordChange} disabled={loading}>
                  {loading ? "Updating..." : "Change Password"}
                </Button>
              </Form>
            </div>
          </Tab>

          <Tab eventKey="logins" title="Login History">
            <div className="mt-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Login History</h5>
                {logs.length > 0 && (
                  <Button variant="outline-primary" size="sm" onClick={handleDownloadCSV}>
                    Download CSV
                  </Button>
                )}
              </div>
              {logs.length === 0 ? (
                <Alert variant="info">No login history available.</Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, i) => (
                      <tr key={i}>
                        <td>
                          {log.loginTime
                            ? new Date(log.loginTime).toLocaleString()
                            : log.createdAt
                              ? new Date(log.createdAt).toLocaleString()
                              : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Tab>

          <Tab eventKey="wallet" title="Wallet / Points">
            <div className="mt-3">
              <h4>Your Wallet Balance: ₹{walletBalance}</h4>
              <p className="text-muted">(More wallet features coming soon...)</p>
            </div>
          </Tab>

          <Tab eventKey="kyc" title="KYC Upload">
            <div className="mt-3">
              <Form.Group className="mb-3">
                <Form.Label>
                  <strong>Upload KYC Document (PDF/Image)</strong>
                </Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setKycFile(e.target.files[0])}
                />
                <Form.Text className="text-muted">
                  Accepted formats: PDF, JPG, JPEG, PNG (Max 10MB)
                </Form.Text>
              </Form.Group>
              <Button onClick={handleKycUpload} disabled={!kycFile || loading}>
                {loading ? "Uploading..." : "Upload KYC"}
              </Button>
              {uploadStatus && (
                <Alert variant={uploadStatus.includes("✅") ? "success" : "danger"} className="mt-3">
                  {uploadStatus}
                </Alert>
              )}
              {user.kycStatus && (
                <Alert variant="info" className="mt-3">
                  <strong>KYC Status:</strong> <Badge bg="info">{user.kycStatus}</Badge>
                </Alert>
              )}
            </div>
          </Tab>

          <Tab eventKey="addresses" title="My Addresses">
            <div className="mt-3">
              <h5 className="mb-3">Add New Address</h5>
              <Form>
                <Row>
                  <Col md={12} className="mb-2">
                    <Form.Control
                      placeholder="Street"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Control
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Control
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Control
                      placeholder="Country"
                      value={newAddress.country}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, country: e.target.value })
                      }
                    />
                  </Col>
                  <Col md={6} className="mb-2">
                    <Form.Control
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, pincode: e.target.value })
                      }
                    />
                  </Col>
                </Row>
                <Button onClick={handleAddAddress} disabled={loading} className="mt-2">
                  {loading ? "Adding..." : "Add Address"}
                </Button>
              </Form>

              <h5 className="mt-4 mb-3">Saved Addresses</h5>
              {addresses.length === 0 ? (
                <Alert variant="info">No addresses saved yet.</Alert>
              ) : (
                <div className="list-group">
                  {addresses.map((addr, i) => (
                    <div
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <strong>{addr.street}</strong>
                        <br />
                        {addr.city}, {addr.state}, {addr.country} - {addr.pincode}
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteAddress(i)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Tab>
        </Tabs>

        <ToastContainer position="top-end" className="p-3">
          <Toast show={toast.show} bg={toast.variant} onClose={() => setToast({ ...toast, show: false })}>
            <Toast.Header>
              <strong className="me-auto">Notification</strong>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
}

export default UserProfilePage;
