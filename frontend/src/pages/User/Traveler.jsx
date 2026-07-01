import React, { useEffect, useState } from "react";
import { Layout, Card, Input, Image, Row, Col, Spin, Empty } from "antd";
import axios from "axios";
const { Header, Footer, Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

function Navbar({ onSearch }) {
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
          <a href="/" className="hover:text-blue-600 text-white">
            Home
          </a>
          <a href="/login" className="hover:text-blue-600 text-white">
            Login
          </a>
        </nav>
      </div>
    </div>
  );
}

function Traveler() {
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

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
        <Navbar onSearch={onSearch} />
      </Header>

      <Content className="py-8 px-6">
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
        </div>
      </Content>

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

export default Traveler;
