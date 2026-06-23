import React from "react";
import { Layout, Card, Input, Image, Button } from "antd";
import { motion, useInView, useScroll } from "framer-motion";
import Signup from "./Signup";
const { Header, Footer, Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

function Landing() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#005707" }} className="sticky top-0 z-50">
        <Navbar />
      </Header>

      <Content>
        <HeroSection />
        <div className="flex flex-wrap gap-6">
          <Images />
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

function Images() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Card
        variant="borderless"
        style={{ width: 240 }}
        cover={
          <img
            draggable={false}
            alt="example"
            src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
          />
        }
      >
        <Meta title="Europe Street beat" description="www.instagram.com" />
      </Card>
    </div>
  );
}

function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #b0ffb7 0%, #ffffff 40%, #eaffb0 110%)",
      }}
    >

      <div className="container mx-auto px-6 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight"
            style={{ color: "#2D4A2E" }}
          >
            Bisita NV
          </motion.h1>

          

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto"
          >
            Experience the unique blend of natural beauty and cultural richness.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Signup />
           
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
       
      </div>
    </section>
  );
}

function Navbar() {
  return (
    
    <div className="flex justify-between items-center h-full mx-10 ">
      <h1 className="text-xl font-bold" style={{ color: "#ffffff" }}>
        Bisita NV
      </h1>

      <div className="flex items-center gap-6">
        <Search placeholder="Search" style={{ width: 300 }} />

        <nav className="flex items-center gap-6">
          <a href="/" className="hover:text-blue-600">
            Home
          </a>
          <a href="/login" className="hover:text-blue-600">
            Login
          </a>
          
        </nav>
      </div>
    </div>
  );
}
        

export default Landing;
