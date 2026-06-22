import React from "react";
import { Layout, Card, Input, Image } from "antd";


const { Header, Footer, Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

function Landing() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ backgroundColor: "#a3a3a3" }}>
        <div className="flex justify-between items-center h-full mx-10">
          <h1 className="text-xl font-bold">SIA Tourism Management System</h1>

          <div className="flex items-center gap-6">
            <Search placeholder="Search" style={{ width: 300 }} />

            <nav className="flex items-center gap-6">
              <a href="/" className="hover:text-blue-600">
                Home
              </a>
              <a href="/login" className="hover:text-blue-600">
                Login
              </a>
              <a href="/signup" className="hover:text-blue-600">
                Signup
              </a>
            </nav>
          </div>
        </div>
      </Header>

      <Content className="p-6">
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

export default Landing;