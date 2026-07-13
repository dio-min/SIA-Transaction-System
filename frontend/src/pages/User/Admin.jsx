import React from "react";
import {
  Layout,
  Menu,
  Input,
  InputNumber,
  Button,
  Form,
  message,
  Modal,
  Table,
  Space,
  ConfigProvider,
  Select,
  Tag,
  Statistic,
  Col,
  Row,
} from "antd";

import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LoadingOutlined,
  PlusOutlined,
  UserOutlined,
  BookOutlined,
  ProfileOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";

const { Header, Content, Footer, Sider } = Layout;
import axios from "axios";
import { use } from "react";

const { Search, TextArea } = Input;
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

function Admin() {
  // so that the current page is still the same when it is refreshed
  const [selectedMenu, setSelectedMenu] = useState(() => {
    return localStorage.getItem("adminSelectedMenu") || "1";
  });
  const [adminUsersRefreshKey, setAdminUsersRefreshKey] = useState(0);

  useEffect(() => {
    localStorage.setItem("adminSelectedMenu", selectedMenu);
  }, [selectedMenu]);

  const renderContent = () => {
    if (selectedMenu === "2") {
      return (
        <>
          <div>
            <ViewDestination />
          </div>
        </>
      );
    }

    if (selectedMenu === "3") {
      return (
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <ViewPackages />
        </div>
      );
    }

    if (selectedMenu === "4") {
      return <ViewAdminUsers refreshKey={adminUsersRefreshKey} />;
    }
    if (selectedMenu === "5") {
      return (
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <ViewBookings />
        </div>
      );
    }

    return (
      <div className="rounded-xl bg-white shadow-sm">
        <Dashboard />
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        style={{
          backgroundColor: "#005707",
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Navbar selectedKey={selectedMenu} onSelect={setSelectedMenu} />
      </Sider>

      <Layout style={{ marginLeft: 250 }}>
        <Content
          style={{
            padding: "32px",
            background: "#f5f5f5",
            minHeight: "100vh",
          }}
        >
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

function Navbar({ selectedKey, onSelect }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("rememberedLogin");
    localStorage.removeItem("adminSelectedMenu");
    message.success("Signed out successfully.");
    navigate("/");
  };

  const items = [
    {
      key: "1",
      label: "Dashboard",
    },
    {
      key: "2",
      label: "Destinations",
    },
    {
      key: "3",
      label: "Packages",
    },
    {
      key: "4",
      label: "Users",
    },
    {
      key: "5",
      label: "Bookings",
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white text-center">Bisita NV</h1>
      </div>

      {/* Menu */}
      <div className="flex-1">
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => onSelect(key)}
          items={items}
          style={{
            borderRight: 0,
            background: "transparent",
          }}
        />
      </div>

      {/* Sign Out */}
      <div className="p-4 mt-auto">
        <Button danger block onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}

function CreateAdminUser({ onCreated }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpen = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/users/register`, {
        username: values.username,
        email: values.email,
        password: values.password,
        role: "admin",
      });

      message.success("Admin user created successfully.");
      form.resetFields();
      setIsModalOpen(false);
      onCreated?.();
    } catch (error) {
      console.error(
        "Create admin error:",
        error.response?.data ?? error.message,
      );
      message.error("Unable to create admin user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Button
          type="primary"
          onClick={handleOpen}
          style={{ backgroundColor: "#005707", border: "none" }}
        >
          Create Admin User
        </Button>
      </div>

      <Modal
        title="Create Admin User"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please enter a username." }]}
          >
            <Input size="large" placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter an email." },
              { type: "email", message: "Please enter a valid email." },
            ]}
          >
            <Input size="large" placeholder="Enter email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter a password." }]}
          >
            <Input.Password size="large" placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match."));
                },
              }),
            ]}
          >
            <Input.Password size="large" placeholder="Confirm password" />
          </Form.Item>

          <Form.Item className="mb-0">
            <div className="flex justify-end gap-3">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ backgroundColor: "#005707", border: "none" }}
              >
                {loading ? "Creating..." : "Create Admin"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

function AddDestination({ editDestination, onUpdateComplete, onClose }) {
  const [form] = Form.useForm();
  const [editID, setEditID] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [destination, setDestination] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editDestination) {
      const nextValues = {
        destination: editDestination.destination || "",
        location: editDestination.location || "",
        description: editDestination.description || "",
      };

      setIsModalOpen(true);
      form.setFieldsValue(nextValues);
      setDestination(nextValues.destination);
      setLocation(nextValues.location);
      setDescription(nextValues.description);
      setEditID(editDestination._id || "");
      setPreview(editDestination.destinationImage || null);
      setImage(editDestination.destinationImage || null);
    }
  }, [editDestination, form]);

  const clearForm = () => {
    form.resetFields();
    setEditID("");
    setDestination("");
    setLocation("");
    setDescription("");
    setImage(null);
    setPreview(null);
  };

  const showModal = () => {
    clearForm();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    clearForm();
    if (onClose) onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const isEditing = Boolean(editID);

  const handleSubmit = async () => {
    if (!isEditing && !image) {
      console.error("No image selected");
      messageApi.error("Please select an image before saving.");
      return;
    }

    setLoading(true);
    messageApi.open({
      key: "upload",
      type: "loading",
      content: "Uploading image...",
      duration: 0,
    });

    try {
      const values = await form.validateFields();
      const formData = new FormData();

      if (image instanceof File) {
        formData.append("image", image, image.name);
      }

      if (isEditing) {
        formData.append("id", editID);
        formData.append("destination", values.destination ?? destination);
        formData.append("location", values.location ?? location);
        formData.append("description", values.description ?? description);
        await axios.put(
          `${API_BASE_URL}/api/destinations/updateDestination`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        messageApi.success({
          key: "upload",
          content: "Updated successfully.",
        });
      } else {
        formData.append("destination", values.destination ?? destination);
        formData.append("location", values.location ?? location);
        formData.append("description", values.description ?? description);
        await axios.post(
          `${API_BASE_URL}/api/destinations/createDestination`,
          formData,
        );
        messageApi.success({
          key: "upload",
          content: "Added successfully.",
        });
      }

      clearForm();
      setIsModalOpen(false);
      if (onUpdateComplete) onUpdateComplete();
    } catch (error) {
      console.error("Upload error:", error.response?.data ?? error.message);
      messageApi.error({
        key: "upload",
        content: "Upload failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: "#005707" }}
      >
        <PlusOutlined />
        Add Destination
      </Button>
      <Modal
        title="Add New Destination"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={850}
      >
        <Form
          form={form}
          name="add-destination"
          layout="vertical"
          autoComplete="off"
          onFinish={handleSubmit}
        >
          <p className="text-gray-500 mb-6">
            Fill in the details for your new destination.
          </p>

          <div className="grid grid-cols-2 gap-8">
            {/* LEFT SIDE */}
            <div>
              {isEditing ? (
                <>
                  <Form.Item label="Destination Name">
                    <Input
                      size="large"
                      value={destination}
                      placeholder="e.g. Mount Pulag"
                      disabled
                    />
                  </Form.Item>

                  <Form.Item label="Location">
                    <Input
                      size="large"
                      value={location}
                      placeholder="e.g. Benguet"
                      disabled
                    />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    label="Destination Name"
                    name="destination"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the destination name.",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        form.setFieldsValue({ destination: e.target.value });
                      }}
                      placeholder="e.g. Mount Pulag"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Location"
                    name="location"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the location.",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        form.setFieldsValue({ location: e.target.value });
                      }}
                      placeholder="e.g. Benguet"
                    />
                  </Form.Item>
                </>
              )}

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please enter a description.",
                  },
                ]}
              >
                <TextArea
                  rows={7}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    form.setFieldsValue({ description: e.target.value });
                  }}
                  placeholder="Write a short description..."
                />
              </Form.Item>
            </div>

            {/* RIGHT SIDE */}
            <div>
              <Form.Item
                label="Destination Image"
                name="image"
                rules={[
                  {
                    required: !isEditing,
                    message: "Please upload an image.",
                  },
                ]}
              >
                <div>
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center
                         w-full h-80
                         border-2 border-dashed border-gray-300
                         rounded-xl
                         cursor-pointer
                         transition-all
                         hover:border-green-600
                         hover:bg-green-50"
                  >
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-14 h-14 mx-auto mb-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 15a4 4 0 014-4h.26A8 8 0 1117 18H7a4 4 0 01-4-3zm9-7v8m0 0l-3-3m3 3l3-3"
                          />
                        </svg>

                        <p className="font-semibold text-base">
                          Click to upload
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          PNG, JPG or JPEG
                        </p>

                        <p className="text-xs text-gray-400">
                          Maximum file size: 5 MB
                        </p>
                      </div>
                    )}
                  </label>

                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </Form.Item>
            </div>
          </div>

          <Form.Item className="mb-0 mt-8">
            <div className="flex justify-end gap-4">
              <Button size="large" onClick={handleCancel}>
                Cancel
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                style={{
                  background: "#005707",
                  border: "none",
                }}
              >
                {loading
                  ? "Uploading..."
                  : isEditing
                    ? "Update Destination"
                    : "Save Destination"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function ViewDestination() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");

  // Delete Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Edit
  const [editDestination, setEditDestination] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch Destinations
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/destinations/getDestination`,
      );

      setItems(
        res.data.map((item) => ({
          ...item,
          key: item._id,
        })),
      );
    } catch (error) {
      console.error("Error fetching destinations:", error);
      message.error("Failed to load destinations.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  // Show Delete Modal
  const showModal = (record) => {
    setSelectedDestination(record);
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedDestination(null);
  };

  // Delete Destination
  const handleDelete = async () => {
    if (!selectedDestination) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/api/destinations/${selectedDestination._id}`,
      );

      message.success("Destination deleted successfully!");

      // Remove from UI immediately
      setItems((prev) =>
        prev.filter((item) => item._id !== selectedDestination._id),
      );

      handleCancel();
    } catch (error) {
      console.error("Error deleting destination:", error);
      message.error("Failed to delete destination.");
    }
  };

  // Update
  const handleUpdate = (destination) => {
    setEditDestination(destination);
  };

  const handleUpdateComplete = () => {
    setEditDestination(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditModalClose = () => {
    setEditDestination(null);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "destinationImage",
      key: "destinationImage",
      render: (url) =>
        url ? (
          <img
            src={url}
            alt="Destination"
            style={{
              width: 120,
              height: 80,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />
        ) : (
          "-"
        ),
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleUpdate(record)}
            style={{ width: "80px" }}
          >
            Update
          </Button>

          <Button
            danger
            type="primary"
            onClick={() => showModal(record)}
            style={{ width: "80px" }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filteredItems = items.filter((item) => {
    const query = searchText.toLowerCase();

    return [item.destination, item.location, item.description].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(query),
    );
  });

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#005707",
            headerColor: "#fff",
            rowHoverBg: "#ffffff",
            headerSplitColor: "#ffffff",
            borderColor: "#005707",
          },
        },
      }}
    >
      <div className="flex justify-between mb-3 rounded-xl bg-white p-3 shadow-sm">
        <h2 className="text-2xl font-semibold" style={{ color: "#003705" }}>
          Add Destination
        </h2>

        <div className="flex gap-3">
          <Search
            placeholder="Search destinations"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 10, maxWidth: 320 }}
          />

          <AddDestination
            editDestination={editDestination}
            onUpdateComplete={handleUpdateComplete}
            onClose={handleEditModalClose}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredItems}
        pagination={{ pageSize: 10 }}
      />

      {/* Delete Modal */}
      <Modal
        title="Delete Destination"
        open={isModalOpen}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        onOk={handleDelete}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{selectedDestination?.destination}</strong>?
        </p>
      </Modal>
    </ConfigProvider>
  );
}

function AddPackage({ editPackage, onUpdateComplete, onClose }) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [packageImage, setPackageImage] = useState(null);

  const getDestinationIds = (value) => {
    const items = Array.isArray(value) ? value : value ? [value] : [];

    return items.map((item) => item?._id || item).filter(Boolean);
  };

  const fetchDestinations = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/destinations/getDestination`,
      );
      setDestinations(res.data || []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      messageApi.error("Failed to load destinations.");
    }
  };

  const clearForm = () => {
    form.resetFields();
    setIsEditing(false);
    setPackageImage(null);
  };

  const showModal = async () => {
    clearForm();
    await fetchDestinations();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    clearForm();
    if (onClose) onClose();
  };

  useEffect(() => {
    if (editPackage) {
      setIsEditing(true);
      setIsModalOpen(true);
      form.setFieldsValue({
        packageName: editPackage.packageName || "",
        type: editPackage.type || "",
        description: editPackage.description || "",
        duration_days: editPackage.duration_days || "",
        difficulty_level: editPackage.difficulty_level || "",
        price: editPackage.price || 0,
        max_capacity: editPackage.max_capacity || 0,
        min_booking_advance_days: editPackage.min_booking_advance_days || 0,
        destination: getDestinationIds(editPackage.destination),
      });
      setPackageImage(null);
      fetchDestinations();
    }
  }, [editPackage, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const destinationIds = Array.isArray(values.destination)
        ? values.destination
        : values.destination
          ? [values.destination]
          : [];
      const normalizedDestinations =
        isEditing && destinationIds.length === 0
          ? getDestinationIds(editPackage?.destination)
          : destinationIds;

      if (!isEditing && !(packageImage instanceof File)) {
        messageApi.error("Please upload a package image before saving.");
        return;
      }

      const payload = new FormData();
      payload.append("packageName", values.packageName);
      payload.append("type", values.type);
      payload.append("description", values.description);
      payload.append("duration_days", values.duration_days);
      payload.append("difficulty_level", values.difficulty_level);
      payload.append("price", values.price);
      payload.append("max_capacity", values.max_capacity);
      payload.append(
        "min_booking_advance_days",
        values.min_booking_advance_days ?? 0,
      );

      normalizedDestinations.forEach((destinationId) => {
        payload.append("destination", destinationId);
      });

      if (packageImage instanceof File) {
        payload.append("packageImage", packageImage, packageImage.name);
      }

      if (isEditing) {
        await axios.put(
          `${API_BASE_URL}/api/packages/${editPackage._id}`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        messageApi.success("Package updated successfully.");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/packages/createPackage`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        messageApi.success("Package added successfully.");
      }

      setIsModalOpen(false);
      clearForm();
      if (onUpdateComplete) onUpdateComplete();
    } catch (error) {
      console.error(
        "Package save error:",
        error.response?.data ?? error.message,
      );
      messageApi.error("Unable to save package. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: "#005707" }}
      >
        <PlusOutlined />
        Add Package
      </Button>

      <Modal
        title={isEditing ? "Update Package" : "Add New Package"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
        width={850}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Form.Item
                label="Package Name"
                name="packageName"
                rules={[
                  { required: true, message: "Please enter a package name." },
                ]}
              >
                <Input placeholder="e.g. Adventure Escape" />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[
                  { required: true, message: "Please enter the package type." },
                ]}
              >
                <Input placeholder="e.g. Adventure" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter a description." },
                ]}
              >
                <TextArea rows={5} placeholder="Describe the package..." />
              </Form.Item>

              <Form.Item
                label="Destinations"
                name="destination"
                rules={[
                  {
                    validator: (_, value) =>
                      Array.isArray(value) && value.length >= 1
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Please select at least 1 destination."),
                          ),
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select 1 or more destinations"
                  options={destinations.map((destination) => ({
                    label: destination.destination,
                    value: destination._id,
                  }))}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                label="Duration (days)"
                name="duration_days"
                rules={[
                  { required: true, message: "Please enter the duration." },
                ]}
              >
                <InputNumber min={0} max={7} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Difficulty"
                name="difficulty_level"
                rules={[
                  {
                    required: true,
                    message: "Please enter the difficulty level.",
                  },
                ]}
              >
                <Select placeholder="Select difficulty level">
                  <Select.Option value="Easy">Easy</Select.Option>
                  <Select.Option value="Moderate">Moderate</Select.Option>
                  <Select.Option value="Hard">Hard</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[{ required: true, message: "Please enter the price." }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Max Capacity"
                name="max_capacity"
                rules={[
                  { required: true, message: "Please enter max capacity." },
                ]}
              >
                <InputNumber min={1} max={20} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Minimum Booking Advance (days)"
                name="min_booking_advance_days"
                rules={[
                  { required: true, message: "Please enter the advance days." },
                ]}
              >
                <InputNumber min={0} max={7} style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="Package Image"
                name="packageImage"
                rules={[
                  { required: !isEditing, message: "Please upload an image." },
                ]}
              >
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPackageImage(e.target.files?.[0] || null)}
                />
              </Form.Item>
            </div>
          </div>

          <Form.Item className="mb-0 mt-6">
            <div className="flex justify-end gap-4">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ backgroundColor: "#005707", border: "none" }}
              >
                {loading
                  ? "Saving..."
                  : isEditing
                    ? "Update Package"
                    : "Save Package"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

function ViewPackages() {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editPackage, setEditPackage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const getDestinationLabel = (destination) => {
    const destinationList = Array.isArray(destination)
      ? destination
      : destination
        ? [destination]
        : [];

    const labels = destinationList
      .map((item) => item?.destination || item?.location || "")
      .filter(Boolean);

    return labels.length > 0 ? labels.join(", ") : "-";
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/packages/getAllPackages`,
      );
      setItems(
        (res.data || []).map((item) => ({
          ...item,
          key: item._id,
        })),
      );
    } catch (error) {
      console.error("Error fetching packages:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/packages/${id}`);
      setRefreshKey((prev) => prev + 1);
      message.success("Package deleted successfully.");
    } catch (error) {
      console.error("Error deleting package:", error);
      message.error("Unable to delete package.");
    }
  };

  const handleUpdate = (pkg) => {
    setEditPackage(pkg);
  };

  const handleUpdateComplete = () => {
    setEditPackage(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleEditModalClose = () => {
    setEditPackage(null);
  };

  const columns = [
    {
      title: "Destinations",
      key: "destination",
      render: (_, record) => getDestinationLabel(record.destination),
    },
    {
      title: "Package",
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (value) => `₱${Number(value || 0).toLocaleString()}`,
    },
    {
      title: "Max Capacity",
      dataIndex: "max_capacity",
      key: "max_capacity",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space wrap size="middle">
          <Button type="primary" onClick={() => handleUpdate(record)}>
            Update
          </Button>
          <Button
            danger
            type="primary"
            onClick={() =>
              Modal.confirm({
                title: "Delete package",
                content: `Are you sure you want to delete ${record.packageName}?`,
                okText: "Delete",
                okType: "danger",
                onOk: () => handleDelete(record._id),
              })
            }
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const filteredItems = items.filter((item) => {
    const query = searchText.toLowerCase();
    return [
      item.packageName,
      item.type,
      getDestinationLabel(item.destination),
    ].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(query),
    );
  });

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: "#005707",
            headerColor: "#fff",
            rowHoverBg: "#ffffff",
            headerSplitColor: "#ffffff",
            borderColor: "#005707",
          },
        },
      }}
    >
      <div className="mb-3 flex justify-between rounded-xl bg-white p-3 shadow-sm">
        <h2 className="text-2xl font-semibold" style={{ color: "#003705" }}>
          Manage Packages
        </h2>
        <div className="flex gap-3">
          <Search
            placeholder="Search packages"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <AddPackage
            editPackage={editPackage}
            onUpdateComplete={handleUpdateComplete}
            onClose={handleEditModalClose}
          />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredItems}
        pagination={{ pageSize: 4 }}
      />
    </ConfigProvider>
  );
}

function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings`);
        setBookings(res.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  const bookingColumns = [
    {
      title: "Booking ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Traveler",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Package",
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: "Travel Date",
      dataIndex: "travelDate",
      key: "travelDate",
    },
    {
      title: "Booked On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        if (status === "Confirmed") color = "green";
        else if (status === "Pending") color = "orange";
        else if (status === "Cancelled") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];
  const filteredBookings = bookings.filter((booking) => {
    const query = searchText.toLowerCase();
    return (
      booking.fullName.toLowerCase().includes(query) ||
      booking.packageName.toLowerCase().includes(query) ||
      booking.status.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="mb-4 flex justify-between items-center">
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: "#003705" }}
        >
          View Bookings
        </h2>
        <Search
          placeholder="Search destinations"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 10, maxWidth: 320 }}
        />
      </div>

      <Table
        rowKey="_id"
        columns={bookingColumns}
        dataSource={filteredBookings}
        loading={loading}
      />
    </div>
  );
}

function ViewTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/transactions/getTransactions`,
        );
        setTransactions(res.data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const transactionColumns = [
    {
      title: "Transaction ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Package",
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₱${Number(amount || 0).toLocaleString()}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
  ];
  const filteredTransactions = transactions.filter((transaction) => {
    const query = searchText.toLowerCase();
    const bookingId = String(transaction.bookingId || "");
    return (
      String(transaction._id || "")
        .toLowerCase()
        .includes(query) ||
      bookingId.toLowerCase().includes(query) ||
      String(transaction.userName || "")
        .toLowerCase()
        .includes(query) ||
      String(transaction.packageName || "")
        .toLowerCase()
        .includes(query) ||
      String(transaction.paymentMethod || "")
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <div className="bg-white  rounded-xl shadow-sm mt-6">
      <div className=" flex justify-between items-center">
        <h2 className="text-1xl font-semibold" style={{ color: "#003705" }}>
          View Transactions
        </h2>
        <Search
          placeholder="Search transactions"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 10, maxWidth: 320 }}
        />
      </div>

      <Table
        rowKey="_id"
        columns={transactionColumns}
        dataSource={filteredTransactions}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}

function ViewAdminUsers({ refreshKey }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users?role=admin`);
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching admin users:", error);
      message.error("Unable to load admin users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  const handleDelete = async (id, username) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/users/${id}`);
      message.success(`${username} deleted successfully.`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting admin user:", error);
      message.error("Unable to delete user.");
    }
  };

  const columns = [
    {
      title: "User ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          type="primary"
          onClick={() =>
            Modal.confirm({
              title: "Delete admin user",
              content: `Are you sure you want to delete ${record.username}?`,
              okText: "Delete",
              okButtonProps: { danger: true },
              cancelText: "Cancel",
              onOk: () => handleDelete(record._id, record.username),
            })
          }
        >
          Delete
        </Button>
      ),
    },
  ];

  const filteredUsers = users.filter((user) => {
    const query = searchText.toLowerCase();
    return (
      String(user._id || "")
        .toLowerCase()
        .includes(query) ||
      String(user.username || "")
        .toLowerCase()
        .includes(query) ||
      String(user.email || "")
        .toLowerCase()
        .includes(query) ||
      String(user.role || "")
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: "#003705" }}>
            View Admin Users
          </h2>
          <p className="mt-2 text-gray-600">
            Manage administrator accounts and remove users when needed.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Search
            placeholder="Search admin users"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ maxWidth: 320 }}
          />
          <CreateAdminUser
            onCreated={() => setAdminUsersRefreshKey((prev) => prev + 1)}
          />
        </div>
      </div>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={filteredUsers}
        loading={loading}
      />
    </div>
  );
}

function Dashboard() {
  const [summary, setSummary] = useState({});
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/summary`);
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, []);

  // Trending Packages — now horizontal, so long package names
  // run left-to-right instead of getting rotated and clipped
  const chartData = {
    labels: summary.trendingPackageDetails
      ? Object.keys(summary.trendingPackageDetails)
      : [],
    datasets: [
      {
        label: "Trending Packages",
        data: summary.trendingPackageDetails
          ? Object.values(summary.trendingPackageDetails)
          : [],
        backgroundColor: [
          "rgba(0, 87, 7, 0.7)",
          "rgba(55, 185, 66, 0.7)",
          "rgba(148, 233, 155, 0.7)",
          "rgba(51, 134, 34, 0.7)",
          "rgba(31, 80, 21, 0.7)",
          "rgba(201, 203, 207, 0.7)",
        ],
        borderColor: [
          "rgba(0, 87, 7, 0.7)",
          "rgba(55, 185, 66, 0.7)",
          "rgba(148, 233, 155, 0.7)",
          "rgba(51, 134, 34, 0.7)",
         "rgba(31, 80, 21, 0.7)",
          "rgba(201, 203, 207, 1)",
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const horizontalBarData = {
    labels: summary.paymentMethods ? Object.keys(summary.paymentMethods) : [],
    datasets: [
      {
        label: "Payment Methods",
        data: summary.paymentMethods
          ? Object.values(summary.paymentMethods)
          : [],
        backgroundColor: [
          "rgba(0, 87, 7, 0.7)",
          "rgba(55, 185, 66, 0.7)",
          "rgba(148, 233, 155, 0.7)",
          "rgba(253, 255, 114, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(201, 203, 207, 0.7)",
        ],
        borderColor: [
          "rgba(0, 87, 7, 0.7)",
          "rgba(55, 185, 66, 0.7)",
          "rgba(148, 233, 155, 0.7)",
          "rgba(253, 255, 114, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(201, 203, 207, 0.7)",
        ],
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const doughnutData = {
    labels: summary.bookingStatus ? Object.keys(summary.bookingStatus) : [],
    datasets: [
      {
        label: "Booking Status",
        data: summary.bookingStatus ? Object.values(summary.bookingStatus) : [],
        backgroundColor: [
          "rgba(0, 87, 7, 0.7)",
          "rgba(55, 185, 66, 0.7)",
          "rgba(148, 233, 155, 0.7)",
        ],
        borderColor: [
          "rgba(0, 87, 7, 1)",
          "rgba(55, 185, 66, 0.7)",
          "rgba(148, 233, 155, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 ">
      <div className="flex justify-between items-center mb-4">
        <h1
          className="text-2xl md:text-3xl font-bold "
          style={{ color: "#003705" }}
        >
          Admin Dashboard
        </h1>
        <GenerateReport />
      </div>

      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <Statistic
              title="Total Users"
              value={summary.totalTravelerUsers}
              prefix={<UserOutlined className="text-green-700 mr-2" />}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <Statistic
              title="Total Bookings"
              value={summary.totalBookings}
              prefix={<BookOutlined className="text-blue-600 mr-2" />}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <Statistic
              title="Total Packages"
              value={summary.totalPackages}
              prefix={<ProfileOutlined className="text-purple-600 mr-2" />}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <div className="bg-white md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <Statistic
              title="Total Revenue"
              value={`₱${Number(summary.totalRevenue || 0).toLocaleString()}`}
            />
          </div>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]}>
        {/* Left Column - Doughnut Chart */}
        <Col xs={5} lg={8}>
          <div className="bg-white rounded-xl shadow-sm h-[315px] relative">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  title: {
                    display: true,
                    text: "Booking Status Distribution",
                    font: { size: 12, family: "Poppins" },
                  },
                  legend: {
                    position: "bottom",
                    labels: {
                      padding: 10,
                      font: { size: 12 },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `${ctx.label}: ${ctx.parsed}`,
                    },
                  },
                },
              }}
            />
          </div>
        </Col>

        {/* Right Column - Two Bar Charts */}
        <Col xs={24} lg={16}>
          <Row gutter={[0, 16]}>
            {/* First Bar Chart - Row 1 */}
            <Col xs={24}>
              <div className="bg-white rounded-xl shadow-sm  ml-17 h-[160px] relative">
                <Bar
                  data={chartData}
                  options={{
                    indexAxis: "x",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: "Trending Packages",
                        font: { size: 12, family: "Poppins" },
                      },
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => ctx.parsed.y,
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          maxRotation: 20,
                          minRotation: 0,
                          autoSkip: true,
                          maxTicksLimit: 6,
                          font: { size: 10 },
                        },
                      },
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                          stepSize: 1,
                          font: { size: 10 },
                        },
                      },
                    },
                  }}
                />
              </div>
            </Col>

            {/* Second Bar Chart - Row 2 */}
            <Col xs={24}>
              <div className="bg-white  rounded-xl shadow-sm h-[140px] relative">
                <Bar
                  data={horizontalBarData}
                  options={{
                    indexAxis: "y",
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      title: {
                        display: true,
                        text: "Payment Methods Distribution",
                        font: { size: 12, family: "Poppins" },
                      },
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => ctx.parsed.x,
                        },
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0,
                          stepSize: 1,
                          font: { size: 10 },
                        },
                      },
                      y: {
                        ticks: {
                          font: { size: 11 },
                          autoSkip: true,
                          maxTicksLimit: 5,
                        },
                      },
                    },
                  }}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      <ViewTransactions />
    </div>
  );
}

function GenerateReport() {
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState({});
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/summary`);
        setSummary(res.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, []);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/transactions/getTransactions`,
        );
        setTransactions(res.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Admin Report", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = [
      "Total Users",
      "Total Bookings",
      "Total Packages",
      "Total Revenue",
    ];

    const tableRows = [
      [
        summary.totalTravelerUsers || 0,
        summary.totalBookings || 0,
        summary.totalPackages || 0,
        `₱${Number(summary.totalRevenue || 0).toLocaleString()}`,
      ],
    ];

    const transactionTableColumn = [
      "Transaction ID",
      "User",
      "Package",
      "Amount",
      "Payment Method",
      "Transaction Date",
    ];

    const transactionTableRows = transactions.map((transaction) => [
      transaction._id,
      transaction.userName,
      transaction.packageName,
      transaction.amount
        ? `₱${Number(transaction.amount).toLocaleString()}`
        : "",
      transaction.paymentMethod || "",
      transaction.transactionDate
        ? new Date(transaction.transactionDate).toLocaleDateString()
        : "",
    ]);

    const paymentMethodColumn = ["Payment Method", "Count"];

    const paymentMethodRows = Object.entries(summary.paymentMethods || {}).map(
      ([method, count]) => [method, count],
    );

    const bookingStatusColumn = ["Booking Status", "Count"];

    const bookingStatusRows = Object.entries(summary.bookingStatus || {}).map(
      ([status, count]) => [status, count],
    );

    const packageTableColumn = ["Package Name", "Count"];

    const packageTableRows = Object.entries(
      summary.trendingPackageDetails || {},
    ).map(([packageName, count]) => [packageName, count]);

  

doc.text("Summary", 14, 38);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      headStyles: { fillColor: "#005707" },
      
    });
    autoTable(doc, {
      head: [bookingStatusColumn],
      body: bookingStatusRows,
      startY: doc.lastAutoTable.finalY + 10,
            headStyles: { fillColor: "#005707" },
    });
    autoTable(doc, {
      head: [packageTableColumn],
      body: packageTableRows,
      startY: doc.lastAutoTable.finalY + 10,
            headStyles: { fillColor: "#005707" },
    });
    autoTable(doc, {
      head: [paymentMethodColumn],
      body: paymentMethodRows,
      startY: doc.lastAutoTable.finalY + 10,
            headStyles: { fillColor: "#005707" },
    });
    doc.text("Transactions", 14, doc.lastAutoTable.finalY + 25);

    autoTable(doc, {
      head: [transactionTableColumn],
      body: transactionTableRows,
      startY: doc.lastAutoTable.finalY + 30,
      headStyles: { fillColor: "#005707" },
    });

    doc.save("admin-report.pdf");
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={generatePDF}
        style={{ backgroundColor: "#005707", marginBottom: "20px" }}
      >
        Generate PDF Report
      </Button>
    </div>
  );
}

export default Admin;
