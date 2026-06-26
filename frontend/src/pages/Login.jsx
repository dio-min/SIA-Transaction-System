import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useState } from "react";
const onFinish = (values) => {
  console.log("Success:", values);
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

function Login() {

  return (
    <div className="flex h-screen w-full">
  {/* Left Side - Login Form */}
  <div className="flex flex-1 items-center justify-center bg-gray-100">
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Login
      </h1>

      <Form
        name="login"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Please input your username!" },
          ]}
        >
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
          ]}
        >
          <Input.Password size="large" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full"
            style={{background: "#005707    ", border: "none", fontFamily: "'Nunito', sans-serif" }}
          >
            Login
          </Button>
          <p className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </Form.Item>
      </Form>
    </div>
  </div>

  {/* Right Side */}
  <div className="hidden flex-1 items-center justify-center bg-[#005707] text-white md:flex">
    <div className="text-center">
      <h2 className="mb-4 text-4xl font-bold">
        Welcome Back
      </h2>
      <p className="text-lg text-gray-300">
        Sign in to access your dashboard.
      </p>
    </div>
  </div>
</div>
  );
}

export default Login;
