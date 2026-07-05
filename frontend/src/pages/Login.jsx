import { Form, Input, Button, Checkbox, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [heroImage, setHeroImage] = useState("");
  
  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/destinations/getDestination`
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

  useEffect(() => {
    const savedLogin = localStorage.getItem("rememberedLogin");

    if (savedLogin) {
      try {
        const parsedLogin = JSON.parse(savedLogin);

        if (parsedLogin?.username && parsedLogin?.password) {
          form.setFieldsValue({
            username: parsedLogin.username,
            password: parsedLogin.password,
            remember: true,
          });
        }
      } catch (error) {
        console.error("Failed to load saved login", error);
        localStorage.removeItem("rememberedLogin");
      }
    }
  }, [form]);

  const onFinish = async (values) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/users/login`,
        {
          username: values.username,
          password: values.password,
        }
      );

      if (values.remember) {
        localStorage.setItem(
          "rememberedLogin",
          JSON.stringify({
            username: values.username,
            password: values.password,
          })
        );
      } else {
        localStorage.removeItem("rememberedLogin");
      }

      const userRole = res.data?.user?.role;
      const loggedInUser = res.data?.user;

      if (loggedInUser) {
        localStorage.setItem("currentUser", JSON.stringify(loggedInUser));
      }

      message.success("Login successful!");

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/travelers");
      }
    } catch (err) {
      message.error("Invalid username or password.");
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md p-8">
          <h1 className="mb-6 text-3xl font-bold">Login</h1>

          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
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
                style={{
                  background: "#005707",
                  border: "none",
                }}
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
      {/* Right Side */}
<div
  className="relative hidden flex-1 items-center justify-center overflow-hidden md:flex"
  style={{
    backgroundImage:
      `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Green Gradient Overlay */}
  <div
    className="absolute inset-0"
    style={{
      background:
        "linear-gradient(90deg, rgba(0,87,7,.88) 0%, rgba(0,87,7,.65) 45%, rgba(0,87,7,.30) 80%, rgba(0,87,7,.15) 100%)",
    }}
  />

  {/* Optional Dark Overlay */}
  <div className="absolute inset-0 bg-black/20" />

  {/* Content */}
  <div className="relative z-10 max-w-lg px-10 text-center text-white">
    <h2 className="mb-4 text-5xl font-bold">
      Welcome Back
    </h2>

    <p className="text-lg leading-8 text-gray-100">
      Discover Nueva Vizcaya's breathtaking destinations, book unforgettable
      adventures, and manage your trips with ease.
    </p>
  </div>
</div>
    </div>
  );
}

export default Login;