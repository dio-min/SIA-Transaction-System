import React, { useEffect, useState } from "react";
import { Layout, Card, Image, Button, Spin, Empty } from "antd";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Signup from "./Signup";
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

// Was hardcoded to a single placeholder image before — now pulls the
// actual destination list from the same endpoint Traveler.jsx uses, so
// visitors see real places before they've even signed up.
function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/api/destinations/getDestination",
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
  const navigate = useNavigate();

  // You can replace this with one of your destination images
  const [heroImage, setHeroImage] = useState("");

useEffect(() => {
  const fetchHero = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/destinations/getDestination"
      );

      const firstImage = res.data.find(
        (d) => d.imageUrl || d.destinationImage
      );

      if (firstImage) {
        setHeroImage(firstImage.imageUrl || firstImage.destinationImage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchHero();
}, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `url(${heroImage})`,
      }}
    >
      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,87,7,.82) 0%, rgba(0,87,7,.55) 35%, rgba(0,87,7,.20) 70%, rgba(0,87,7,0) 100%)",
        }}
      />

      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="container mx-auto px-10 relative z-70">
        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-extrabold text-white"
          >
            Bisita NV
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-lg md:text-xl text-gray-100 leading-8"
          >
            Experience the unique blend of natural beauty and cultural
            richness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex gap-4 mt-10"
          >
            <Signup />

            
          </motion.div>
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
          Login
        </Link>
      </nav>
    </div>
  );
}

export default Landing;