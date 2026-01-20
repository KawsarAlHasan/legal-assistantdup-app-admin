import { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await API.post("/login/", values);

      if (response?.data?.data?.user?.role == "user") {
        message.error("You are not admin");
      } else {
        localStorage.setItem("token", response?.data?.data?.tokens?.access);

        // Show success message
        message.success("Admin Login successful!");

        // Redirect to the admin dashboard (replace with your route)
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error, "error");
      message.error(
        error?.response?.data?.message ||
          "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please provide valid email and password.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen mainBG">
      <div className="bg-white px-10 py-14  shadow-2xl rounded-2xl w-full max-w-[550px] border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-[130px] h-auto" />
        </div>

        {/* Title */}
        <h2 className="text-[32px] text-[#222222] font-bold text-center mb-3">
          Welcome Back!
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[#6B7280] mb-8 text-[16px] leading-relaxed">
          Sign in to your admin account to access the dashboard and manage your
          platform
        </p>

        {/* Login Form */}
        <Form
          name="loginForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          {/* Email Field */}
          <Form.Item
            label={
              <span className="text-[16px] text-[#374151] font-medium">
                Email Address
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              type="email"
              className="p-3 rounded-lg"
              placeholder="Enter your email address"
              size="large"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label={
              <span className="text-[16px] text-[#374151] font-medium">
                Password
              </span>
            }
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="p-3 rounded-lg"
              placeholder="Enter your password"
              size="large"
            />
          </Form.Item>

          {/* Remember Me and Forgot Password */}
          <div className="flex justify-between items-center mb-6">
            <Form.Item name="remember" valuePropName="checked" className="mb-0">
              <Checkbox>
                <span className="text-[15px] text-[#6B7280]">
                  Keep me signed in
                </span>
              </Checkbox>
            </Form.Item>
            <Link
              to="/forget-password"
              className="text-[#3F5EAB] hover:text-[#2d4485] text-[15px] font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              className={`w-full h-12 text-[17px] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all my-main-button`}
              loading={loading}
              size="large"
            >
              {loading ? "Signing in..." : `Sign In`}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
