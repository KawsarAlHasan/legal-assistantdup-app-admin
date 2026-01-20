import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { SafetyOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const CheckCode = () => {
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [form] = Form.useForm();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Check if email exists, if not redirect
  useEffect(() => {
    if (!email) {
      message.warning("Please enter your email first");
      navigate("/forget-password");
    }
  }, [email, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await API.post("/verify-reset-otp/", {
        email: email,
        otp_code: values.otp,
      });

      localStorage.setItem("reset_token", response.data.data.reset_token);

      message.success("Verification code confirmed successfully!");

      setTimeout(() => {
        navigate("/set-new-password");
      }, 500);
    } catch (error) {
      console.error(error, "error");
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. Please check your code and try again.";

      message.error(errorMessage);
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setResendLoading(true);
    try {
      const response = await API.post("/password-reset-request/", {
        email: email,
      });

      message.success("A new verification code has been sent to your email!");
      setCountdown(60); // Set 60 seconds countdown
      form.resetFields(); // Clear the OTP input
    } catch (error) {
      console.error(error, "error");
      message.error(
        error.response?.data?.message ||
          "Failed to resend code. Please try again later.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  // Mask email for privacy
  const maskEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.charAt(0) + "***" + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
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
            <SafetyOutlined className={`text-3xl text-blue-600`} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[32px] text-[#222222] font-bold text-center mb-3">
          Verify Your Email
        </h2>

        {/* Subtitle */}
        <p className="text-center text-[#6B7280] mb-2 text-[15px] leading-relaxed px-4">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-center text-[#374151] font-semibold mb-8 text-[16px]">
          {maskEmail(email)}
        </p>

        {/* Form */}

        <Form form={form} onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="otp"
            rules={[
              {
                required: true,
                message: "Please input the OTP!",
              },
              {
                pattern: /^[0-9]{6}$/,
                message: "Please enter a valid 6-digit code",
              },
            ]}
            className="mb-6 text-center"
          >
            <Input.OTP
              length={6}
              formatter={(str) => str.toUpperCase()}
              inputType="number"
              size="large"
              inputStyle={{
                width: 50,
                height: 50,
                fontSize: 18,
                margin: "0 4px",
                textAlign: "center",
              }}
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="h-12 font-semibold text-lg my-main-button"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </Form.Item>

          {/* Resend Section */}
          <div className="text-center mt-6">
            <p className="text-[#6B7280] text-[15px] mb-2">
              Didn't receive the code?
              <Button
                type="link"
                loading={resendLoading}
                onClick={handleResend}
                disabled={countdown > 0}
                className={`ml-1 p-0 font-semibold text-[15px] ${
                  countdown > 0
                    ? "text-gray-400 cursor-not-allowed "
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                {countdown > 0
                  ? `Resend in ${countdown}s`
                  : resendLoading
                    ? "Sending..."
                    : "Resend Code"}
              </Button>
            </p>
          </div>
        </Form>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Button
            type="link"
            onClick={() => navigate("/forget-password")}
            className={`text-[14px] text-blue-600 hover:text-blue-700`}
          >
            ← Change Email Address
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckCode;
