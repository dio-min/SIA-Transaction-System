import React, { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Input,
  Image,
  Row,
  Col,
  Spin,
  Empty,
  Drawer,
  Menu,
  Button,
  message,
  Modal,
  Divider,
  Tag,
} from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { Header, Footer, Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

function Navbar({ onSearch, selectedKey, onSelect }) {
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("rememberedLogin");
    localStorage.removeItem("travellerSelectedMenu");
    message.success("Signed out successfully.");
    navigate("/");
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const menuItems = [
    {
      key: "1",
      label: "Home",
    },
    {
      key: "2",
      label: "Profile",
    },
    {
      key: "3",
      label: "My Bookings",
    },
  ];
  return (
    <div className="flex justify-between items-center h-full mx-6">
      <h1 className="text-xl font-bold" style={{ color: "#ffffff" }}>
        Bisita NV
      </h1>

      <div className="flex items-center gap-6">
        <Search
          placeholder="Search destinations or packages"
          onSearch={onSearch}
          style={{ width: 320 }}
        />

        <nav className="flex items-center gap-6">
          <MenuOutlined style={{ color: "white" }} onClick={showDrawer} />
          <Drawer
            title="Menu"
            closable={{ "aria-label": "Close Button" }}
            onClose={onClose}
            open={open}
          >
            <Menu
              items={menuItems}
              selectedKeys={[selectedKey]}
              onClick={({ key }) => onSelect(key)}
            />
            <Button danger block onClick={handleSignOut}>
              Sign Out
            </Button>
          </Drawer>
        </nav>
      </div>
    </div>
  );
}

function Traveler() {
  const [destinations, setDestinations] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(() => {
    return localStorage.getItem("travellerSelectedMenu") || "1";
  });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState([]);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    localStorage.setItem("travellerSelectedMenu", selectedMenu);
  }, [selectedMenu]);

  const renderContent = () => {
    if (selectedMenu === "2") {
      return (
        <>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <p>Profile content goes here.</p>
          </div>
        </>
      );
    } else if (selectedMenu === "3") {
      return (
        <>
          <div>
            <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
            <p>Booking content goes here.</p>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="container mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Popular Destinations</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : filteredDestinations.length === 0 ? (
            <Empty description="No destinations found" />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredDestinations.map((dest) => (
                <Col
                  key={dest._id || dest.id || dest.key}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                >
                  <Card
                    onClick={() => {
                      setSelectedDestination(dest);
                      showModal();
                    }}
                    hoverable
                    style={{
                      height: 400,
                      borderRadius: 10,
                      border: "1px solid #e0e0e0",
                      overflow: "hidden",
                    }}
                    cover={
                      (dest.imageUrl || dest.destinationImage) && (
                        <Image
                          src={dest.imageUrl || dest.destinationImage}
                          alt={
                            dest.name ||
                            dest.destinationName ||
                            dest.destination
                          }
                          preview={false}
                          style={{
                            height: 200,
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      )
                    }
                  >
                    <Meta
                      title={
                        dest.name || dest.destinationName || dest.destination
                      }
                      description={
                        <div
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {dest.description || "No description available."}
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <Divider className="my-8" />

          <h2 className="text-2xl font-semibold my-6">Packages</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : filteredPackages.length === 0 ? (
            <Empty description="No packages found" />
          ) : (
            <Row gutter={[16, 16]}>
              {filteredPackages.map((pkg) => (
                <Col key={pkg.key} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    cover={
                      pkg.imageUrl || pkg.packageImage ? (
                        <Image
                          src={pkg.imageUrl || pkg.packageImage}
                          alt={pkg.name || pkg.packageName}
                          preview={false}
                          style={{ height: 160, objectFit: "cover" }}
                        />
                      ) : null
                    }
                  >
                    <Meta
                      title={pkg.name || pkg.packageName}
                      description={
                        pkg.description || pkg.shortDescription || ""
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          <Modal
            title={selectedDestination.destination}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={850}
          >
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Tag color="green">{selectedDestination.location}</Tag>
                <p className="mt-4 align-justify">
                  {selectedDestination.description ||
                    "No description available."}
                </p>
                
              </div>
              
              <div>
                {selectedDestination.imageUrl ||
                selectedDestination.destinationImage ? (
                  <Image
                    src={
                      selectedDestination.imageUrl ||
                      selectedDestination.destinationImage
                    }
                    alt={
                      selectedDestination.name ||
                      selectedDestination.destinationName
                    }
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : null}
              </div>
            </div>
          </Modal>
        </div>
      </>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [destRes, pkgRes] = await Promise.all([
          axios.get("http://localhost:5000/api/destinations/getDestination"),
          axios.get("http://localhost:5000/api/packages/getAllPackages"),
        ]);

        setDestinations(
          (destRes.data || []).map((d) => ({ ...d, key: d._id || d.id })),
        );
        setPackages(
          (pkgRes.data || []).map((p) => ({ ...p, key: p._id || p.id })),
        );
      } catch (err) {
        console.error("Error fetching traveler data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSearch = (value) => setQuery(value.trim());

  const filteredDestinations = destinations.filter((d) =>
    `${d.name || d.destinationName || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  const filteredPackages = packages.filter((p) =>
    `${p.name || p.packageName || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ backgroundColor: "#005707" }}
        className="sticky top-0 z-50"
      >
        <Navbar
          onSearch={onSearch}
          selectedKey={selectedMenu}
          onSelect={setSelectedMenu}
        />
      </Header>

      <Content className="py-8 px-6">{renderContent()}</Content>

      <Footer
        style={{
          textAlign: "center",
          fontSize: "1.6vh",
          color: "rgba(0, 0, 0, 0.45)",
        }}
      >
        © 2026 SIA, Inc.
      </Footer>
    </Layout>
  );
}

function ViewDestination({ destination }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        {destination.name ||
          destination.destinationName ||
          destination.destination}
      </h2>
      <p>{destination.description || "No description available."}</p>
    </div>
  );
}

export default Traveler;
