import React, { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/register", {
        username: values.username,
        email: values.email,
        password: values.password,
        role: "traveler",
      });

      message.success("Account created successfully!");
      setIsModalOpen(false);
      form.resetFields();
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error.response?.data ?? error.message);
      message.error(error.response?.data?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="large"
        className="rounded-full px-8 py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 w-full sm:w-auto"
        style={{
          background: "#005707",
          color: "#fff",
          fontFamily: "'Nunito', sans-serif",
          border: "none",
        }}
        onClick={showModal}
      >
        Get Started
      </Button>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">Sign Up</h1>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: "Please enter your username" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ background: "#005707", border: "none" }}
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <a href="/login" className="text-green-700 hover:underline" style={{ color: "#005707" }}>
              Log in
            </a>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default Signup;
