import { useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Form, Input, message } from "antd";
import { API } from "../../api/api";

const AdminEdit = ({ adminProfile, refetch }) => {
  const isSuperAdmin = adminProfile.role === "superadmin";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleFinish = async (values) => {
    try {
      setLoading(true);

      const submitData = {
        full_name: values.full_name,
        mobile_number: values.phone,
      };

      await API.patch(`/administrators/admins/${adminProfile.id}/`, submitData);

      message.success("Admin updated successfully!");
      refetch?.();
      setIsModalOpen(false);
    } catch (err) {
      console.log(err, "err");
      message.error(err.response?.data?.message || "Failed to update Admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EditOutlined
        className={`text-[23px] my-main-button p-1 rounded-sm text-white ${
          isSuperAdmin
            ? "!cursor-not-allowed opacity-50"
            : "hover:text-blue-300 cursor-pointer"
        }`}
        onClick={isSuperAdmin ? undefined : showModal}
      />

      <Modal
        title="Update Profile"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            id: adminProfile?.id,
            full_name: adminProfile?.admin_name,
            email: adminProfile?.email,
            phone: adminProfile?.mobile_number,
            role: adminProfile?.role,
          }}
        >
          <Form.Item label="Name" name="full_name">
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Phone Number" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Role" name="role">
            <Input disabled />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              className="my-main-button"
              htmlType="submit"
              loading={loading}
              block
            >
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminEdit;
