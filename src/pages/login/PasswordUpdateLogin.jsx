import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { API } from "../../api/api";

const PasswordUpdateLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state for login button

  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  const onFinish = async (values) => {
    setLoading(true); // Start loading when submitting form
    try {
      const response = await API.post("/login/", {
        email: email,
        password: password,
      });

      // remove email and password from local storage
      localStorage.removeItem("email");
      localStorage.removeItem("password");

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
      // Show error message
      message.error(
        "Send code on your email failed. Please try again.", // error.response?.data?.message
      );
    } finally {
      setLoading(false); // Stop loading after request
    }
  };

  const onFinishFailed = (errorInfo) => {
    message.error("Please input valid email.");
  };

  return (
    <div className="flex justify-center items-center mainBG min-h-screen ">
      <div className="bg-white p-8 py-16 shadow-lg rounded-lg w-[530px] h-[535px]">
        <div>
          <img src={logo} alt="Logo" className=" w-[130px]  mx-auto pb-4" />

          <h2 className="text-[30px] text-[#222222] font-bold text-center mb-6">
            Password Updated Successfully!
          </h2>
          <h6 className=" lg:mx-14 text-center text-[#4E4E4E] mb-6 text-[18px]">
            Your new password has been saved. You can now continue securely.
          </h6>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            {/* Submit Button */}
            <div className="mb-4">
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full py-6 text-[18px] font-semibold my-main-button"
                  loading={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default PasswordUpdateLogin;
