import React from "react";
import {
  Layout,
  Menu,
  Input,
  Button,
  Cascader,
  DatePicker,
  Form,
  InputNumber,
  Mentions,
  Segmented,
  Select,
  TreeSelect,
  Upload,
  message,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
const { Header, Content, Footer, Sider } = Layout;
import axios from "axios";
const { Search, TextArea } = Input;
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const { RangePicker } = DatePicker;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

function Admin() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width="15%" style={{ backgroundColor: "#000000" }}>
        <Navbar />
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content>
          <AddDestination />
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
}

function Navbar() {
  return (
    <div className="flex flex-col justify-between items-center h-full mx-10 ">
      <h1 className="text-xl font-bold" style={{ color: "#000000" }}>
        Bisita NV
      </h1>
      <Menu
        style={{
          width: "100%",
          margin: "auto",
          backgroundColor: "#6d6d6d",
          color: "#ffffff",
        }}
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        items={[
          {
            key: "1",
            label: "Dashboard",
          },
          {
            key: "2",
            label: "Destinations",
          },
        ]}
      />
    </div>
  );
}

function AddDestination() {
  const [destination, setDestination] = useState([""]);
  const [location, setLocation] = useState([""]);
  const [description, setDescription] = useState([""]);

  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      messageApi.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info) => {
   
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const handleSubmit = async (e) => {
     e.preventDefault();

     const formData = new FormData();

     formData.append("destination", destination);
     formData.append("location", location);
     formData.append("description", description);
     

     const data = await axios.post("http://localhost:5000/api/destinations/createDestination", formData,{
        headers:  { "Content-Type": "multipart/form-data" },
     })
     alert("added successfully")
    
  }

  return (
    <><div style={{ width: "500px" }} className="m-auto mt-10">
      <Form name="Add destination" layout="vertical" autoComplete="off">
        <h1 className="font-extrabold text-center">Add Destination</h1>
        <Form.Item
          label="Destination Name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <TextArea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item name="name" rules={[{ required: true }]}>
           <Upload
        name="avatar"
        listType="picture-card"
        style={{ width: "100%" }}
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? (
          <img draggable={false} src={imageUrl} alt="avatar" />
        ) : (
          uploadButton
        )}
      </Upload>
        </Form.Item>

        <Form.Item>
          <div className="flex gap-5">
            <Button
              type="secondary"
              htmlType="cancel"
              size="large"
              className="w-full mt-10"
              style={{
                border: "none",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full mt-10"
              style={{
                background: "#005707    ",
                border: "none",
                fontFamily: "'Nunito', sans-serif",
              }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div></>
    
  );
}

function UploadImg() {
  
  return (
    <>
     
    </>
  );
}

export default Admin;
