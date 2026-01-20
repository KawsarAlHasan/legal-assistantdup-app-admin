import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { FaPlus } from "react-icons/fa";
import { API } from "../../api/api";

const AddAdmin = ({ refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    form.resetFields(); 
    setIsModalOpen(false);
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
        role: "STAFF_ADMIN",
      };

      await API.post("/administrators/admins/create/", payload);
      message.success("Admin created successfully!");

      form.resetFields();
      refetch?.();
      setIsModalOpen(false);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        className="mb-2 my-main-button"
        onClick={showModal}
      >
        <FaPlus /> New Administrators Profile Create
      </Button>

      <Modal
        title="Create New Admin"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleFinish}
          form={form}  
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter admin email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter admin email" />
          </Form.Item>

          <Form.Item
            label="Password"
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
            <Input.Password placeholder="Enter your new password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="my-main-button"
              htmlType="submit"
              loading={loading}
              block
            >
              Create Admin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddAdmin;
