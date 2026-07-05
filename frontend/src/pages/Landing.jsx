import React, { useEffect, useState } from "react";
import { Layout, Card, Image, Spin, Empty, Button } from "antd";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import Signup from "./Signup";
import { API_BASE_URL } from "../api";
const { Header, Footer, Content } = Layout;
const { Meta } = Card;

function getDestImage(dest) {
  return dest?.imageUrl || dest?.destinationImage || "";
}

function getDestName(dest) {
  return dest?.name || dest?.destinationName || dest?.destination || "Untitled";
}

function getDestLocation(dest) {
  return dest?.location || "";
}

function Landing() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{ backgroundColor: "#005707" }}
        className="sticky top-0 z-50"
      >
        <Navbar />
      </Header>

      <Content>
        <HeroSection />
        <Destinations />
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

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/destinations/getDestination`,
        );
        if (!cancelled) setDestinations(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDestinations();
    return () => {
      cancelled = true;
    };
  }, []);

  const withImages = destinations.filter((d) => getDestImage(d));

  return (
    <section className="container mx-auto px-6 py-16">
      <h2
        className="text-3xl font-bold text-center mb-10"
        style={{ color: "#2D4A2E" }}
      >
        Popular Destinations
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : withImages.length === 0 ? (
        <Empty description="Destinations will show up here once they're added." />
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {withImages.map((dest) => (
            <Card
              key={dest._id || dest.id}
              hoverable
              variant="borderless"
              style={{ width: 240 }}
              className="bg-white rounded-lg shadow-md"
              cover={
                <Image
                  draggable={false}
                  alt={getDestName(dest)}
                  src={getDestImage(dest)}
                  preview={false}
                  style={{ height: 180, objectFit: "cover" }}
                />
              }
            >
              <Meta
                title={getDestName(dest)}
                description={getDestLocation(dest) || "Bisita NV"}
              />
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

function HeroSection() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#f4ffe9]"
      style={{
        minHeight: "calc(100vh - 72px)",
      }}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(0,87,7,0.22),_transparent_35%),radial-gradient(circle_at_85%_15%,_rgba(255,210,92,0.28),_transparent_30%),linear-gradient(135deg,_#f4ffe9_0%,_#ffffff_55%,_#e7ffd7_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-60 bg-[linear-gradient(rgba(45,74,46,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(45,74,46,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="container mx-auto flex justify-center px-6 py-16 lg:py-24 relative z-10">
        <div className="w-full max-w-4xl text-center">
          <div className="mx-auto max-w-2xl">
            

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-30 text-5xl font-black tracking-tight text-[#12351a] sm:text-6xl lg:text-7xl"
            >
              Bisita NV
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#35513c] sm:text-xl"
            >
              Discover destinations, reserve packages, and manage bookings with a clean travel experience built for Bisita NV.
            </motion.p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-[#35513c]">
              <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                20+ destinations
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                Fast booking management
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur">
                Secure traveler accounts
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:items-center"
            >
              <Signup />
            </motion.div>

            
          </div>
        </div>
      </div>
    </section>
  );
}

function Navbar() {
  return (
    <div className="flex justify-between items-center h-full mx-10">
      <h1 className="text-xl font-bold" style={{ color: "#ffffff" }}>
        Bisita NV
      </h1>

      <nav className="flex items-center gap-6">
        <Link to="/" className="text-white hover:text-gray-200">
          Home
        </Link>
        <Link to="/login" className="text-white hover:text-gray-200">
          <Button>Login</Button>
        </Link>
      </nav>
    </div>
  );
}

export default Landing;
