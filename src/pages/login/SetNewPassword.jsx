import { useState } from "react";
import { Form, Input, Button, message, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const SetNewPassword = () => {
  const email = localStorage.getItem("email");
  const reset_token = localStorage.getItem("reset_token");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/password-reset/", {
        email: email,
        reset_token: reset_token,
        new_password: values.password,
        confirm_password: values.password,
      });

      // Clear reset-related data
      localStorage.setItem("password", values.password);
      localStorage.removeItem("reset_token");

      // Show success message
      message.success("Password has been reset successfully!");

      // Redirect to the dashboard
      setTimeout(() => {
        navigate("/password-update-login");
      }, 500);
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please fill in all required fields correctly.");
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 mainBG">
      <div className="bg-white p-10 py-12 shadow-2xl rounded-2xl w-full max-w-[550px] border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="w-[130px] h-auto" />
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center bg-blue-100`}
          >
            <LockOutlined className={`text-3xl text-blue-600`} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[32px] text-[#222222] font-bold text-center mb-3">
          Create New Password
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[#6B7280] mb-8 text-[15px] leading-relaxed px-4">
          Your new password must be different from previously used passwords for
          security
        </p>

        {/* Form */}
        <Form
          form={form}
          name="setNewPasswordForm"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
        >
          {/* New Password Field */}
          <Form.Item
            label={
              <span className="text-[16px] text-[#374151] font-medium">
                New Password
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Password is required." },
              {
                pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                message:
                  "At least 8 chars, 1 uppercase, 1 number & 1 special char",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="p-3 rounded-lg"
              placeholder="Enter your new password"
              size="large"
            />
          </Form.Item>

          {/* Confirm Password Field */}
          <Form.Item
            label={
              <span className="text-[16px] text-[#374151] font-medium">
                Confirm Password
              </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              className="p-3 rounded-lg"
              placeholder="Confirm your new password"
              size="large"
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item className="mb-0 mt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className={`h-12 text-[17px] font-semibold rounded-lg shadow-md hover:shadow-lg transition-all my-main-button`}
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </Form.Item>
        </Form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Button
            type="link"
            onClick={() => navigate("/login")}
            className={`text-[14px] text-blue-600 hover:text-blue-700`}
          >
            ← Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
