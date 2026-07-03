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
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
      return (
        <div className="rounded-xl bg-white p-8 shadow-sm">
          <CreateAdminUser />
        </div>
      );
    }

    return (
      <div className="rounded-xl bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold" style={{ color: "#003705" }}>
          Dashboard
        </h2>
        <p className="mt-2 text-gray-600">Welcome to the admin dashboard.</p>
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

function CreateAdminUser() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        username: values.username,
        email: values.email,
        password: values.password,
        role: "admin",
      });

      message.success("Admin user created successfully.");
      form.resetFields();
    } catch (error) {
      console.error("Create admin error:", error.response?.data ?? error.message);
      message.error("Unable to create admin user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>


      <h2 className="text-2xl font-semibold" style={{ color: "#003705" }}>
        Create Admin User
      </h2>
      <p className="mt-2 text-gray-600">
        Add a new administrator account for the system.
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-6 max-w-xl"
      >
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

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            style={{ backgroundColor: "#005707", border: "none" }}
          >
            {loading ? "Creating..." : "Create Admin"}
          </Button>
        </Form.Item>
      </Form>
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
          "http://localhost:5000/api/destinations/updateDestination",
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
          "http://localhost:5000/api/destinations/createDestination",
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [editDestination, setEditDestination] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/destinations/getDestination",
      );

      setItems(
        res.data.map((item) => ({
          ...item,
          key: item._id,
        })),
      );
    } catch (error) {
      console.error("Error fetching destinations:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/destinations/${id}`);
      setRefreshKey((prev) => prev + 1);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting destination:", error);
    }
  };

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
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (value) => value ?? "-",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          <Space wrap size="middle">
            <Button type="primary" onClick={() => handleUpdate(record)}>
              Update
            </Button>

            <Button
              danger
              type="primary"
              // onClick={() => handleDelete(record._id)}
              onClick={showModal}
            >
              Delete
            </Button>
            <Modal
              title="Delete Destination"
              open={isModalOpen}
              onCancel={handleCancel}
              footer={null}
              destroyOnClose
            >
              <p>Are you sure you want to delete {record.destination}</p>
              <Button danger onClick={() => handleDelete(record._id)}>
                Delete
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </Modal>
          </Space>
        </>
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
        pagination={{ pageSize: 10   }}
      />
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

  const getDestinationIds = (value) => {
    const items = Array.isArray(value) ? value : value ? [value] : [];

    return items.map((item) => item?._id || item).filter(Boolean);
  };

  const fetchDestinations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/destinations/getDestination");
      setDestinations(res.data || []);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      messageApi.error("Failed to load destinations.");
    }
  };

  const clearForm = () => {
    form.resetFields();
    setIsEditing(false);
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
      const payload = {
        ...values,
        destination:
          isEditing && destinationIds.length === 0
            ? getDestinationIds(editPackage?.destination)
            : destinationIds,
      };

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/packages/${editPackage._id}`, payload);
        messageApi.success("Package updated successfully.");
      } else {
        await axios.post("http://localhost:5000/api/packages/createPackage", payload);
        messageApi.success("Package added successfully.");
      }

      setIsModalOpen(false);
      clearForm();
      if (onUpdateComplete) onUpdateComplete();
    } catch (error) {
      console.error("Package save error:", error.response?.data ?? error.message);
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
                rules={[{ required: true, message: "Please enter a package name." }]}
              >
                <Input placeholder="e.g. Adventure Escape" />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: "Please enter the package type." }]}
              >
                <Input placeholder="e.g. Adventure" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: "Please enter a description." }]}
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
                        : Promise.reject(new Error("Please select at least 1 destination.")),
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
                rules={[{ required: true, message: "Please enter the duration." }]}
              >
                <Input placeholder="e.g. 3 Days / 2 Nights" />
              </Form.Item>

              <Form.Item
                label="Difficulty"
                name="difficulty_level"
                rules={[{ required: true, message: "Please enter the difficulty level." }]}
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
                rules={[{ required: true, message: "Please enter max capacity." }]}
              >
                <InputNumber min={1} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                label="Minimum Booking Advance (days)"
                name="min_booking_advance_days"
                rules={[{ required: true, message: "Please enter the advance days." }]}
              >
                <InputNumber min={0} style={{ width: "100%" }} />
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
                {loading ? "Saving..." : isEditing ? "Update Package" : "Save Package"}
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
    const destinationList = Array.isArray(destination) ? destination : destination ? [destination] : [];

    const labels = destinationList
      .map((item) => item?.destination || item?.location || "")
      .filter(Boolean);

    return labels.length > 0 ? labels.join(", ") : "-";
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/packages/getAllPackages");
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
      await axios.delete(`http://localhost:5000/api/packages/${id}`);
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
    return [item.packageName, item.type, getDestinationLabel(item.destination)].some((value) =>
      String(value || "").toLowerCase().includes(query),
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
          <Input
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

      <Table columns={columns} dataSource={filteredItems} pagination={{ pageSize: 4 }} />
    </ConfigProvider>
  );
}

export default Admin;
