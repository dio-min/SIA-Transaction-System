import { Form, Input, Button, Checkbox, message } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

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
        "http://localhost:5000/api/users/login",
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

      message.success("Login successful!");
      console.log(res.data);

      navigate("/admin");
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
      <div className="hidden flex-1 items-center justify-center bg-[#005707] text-white md:flex">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold">Welcome Back</h2>
          <p className="text-lg text-gray-300">
            Sign in to access your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;