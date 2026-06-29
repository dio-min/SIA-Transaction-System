import React from "react";
import {
  Layout,
  Menu,
  Input,
  Button,
  Form,
  message,
  Modal,
  Table,
  Space,
  ConfigProvider,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;
import axios from "axios";

const { Search, TextArea } = Input;
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

function Admin() {
  const [selectedMenu, setSelectedMenu] = useState("1");

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
          <h2 className="text-2xl font-semibold" style={{ color: "#003705" }}>
            Packages
          </h2>
          <ViewPackages />
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

function AddDestination({ editDestination, onUpdateComplete, onClose }) {
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
      setDestination(editDestination.destination || "");
      setLocation(editDestination.location || "");
      setDescription(editDestination.description || "");
      setEditID(editDestination._id || "");
      setPreview(editDestination.destinationImage || null);
      setImage(editDestination.destinationImage || null);
      setIsModalOpen(true);
    }
  }, [editDestination]);

  const clearForm = () => {
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
      const formData = new FormData();
      formData.append("destination", destination);
      formData.append("location", location);
      formData.append("description", description);

      if (image instanceof File) {
        formData.append("image", image, image.name);
      }

      if (isEditing) {
        formData.append("id", editID);
        await axios.put("http://localhost:5000/api/destinations/updateDestination", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        messageApi.success({
          key: "upload",
          content: "Updated successfully.",
        });
      } else {
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
              <Form.Item
                label="Destination Name"
                name="name"
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
                  onChange={(e) => setDestination(e.target.value)}
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
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Benguet"
                />
              </Form.Item>

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
                  onChange={(e) => setDescription(e.target.value)}
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
                {loading ? "Uploading..." : isEditing ? "Update Destination" : "Save Destination"}
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
        pagination={{ pageSize: 4 }}
      />
    </ConfigProvider>
  );
}

function ViewPackages() {
  const columns = [
    {
      title:"Destination",
      dataIndex: "destination",
      key:"destination"
    },
    {
      title: "Package",
      dataIndex: "packageName",
      key: "destinationImage",
      
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
    },
    {
      title: "Max capacity",
      dataIndex: "max_capacity",
      key: "max_capacity",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <>
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
        <Table
          columns={columns}
         
          pagination={{ pageSize: 4 }}
        />
      </ConfigProvider>
    </>
  );
}

export default Admin;
