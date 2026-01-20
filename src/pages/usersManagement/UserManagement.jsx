import { useState } from "react";
import { message, Modal, Space, Table, Button } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import { API, useAllUsersList } from "../../api/api";
import {
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

function UserManagement() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const { allUsersList, isLoading, isError, error, refetch } =
    useAllUsersList(filter);

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  // 🗑️ Delete Modal
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: (
        <div className="flex items-center gap-2">
          <DeleteOutlined className="text-red-500 text-xl" />
          <span className="text-lg font-semibold">Delete User</span>
        </div>
      ),
      icon: null,
      content: (
        <div className="mt-4 mb-2">
          <p className="text-gray-600 mb-3">
            Are you sure you want to delete this user?
          </p>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-sm">
              <span className="font-medium">Name:</span>{" "}
              {record?.full_name || "N/A"}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Email:</span> {record?.email}
            </p>
          </div>
          <p className="text-red-500 text-sm mt-3 font-medium">
            ⚠️ This action cannot be undone!
          </p>
        </div>
      ),
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      width: 480,
      centered: true,
      okButtonProps: {
        danger: true,
        icon: <DeleteOutlined />,
      },

      async onOk() {
        try {
          await API.delete(`/user-management/users/${record?.id}/`);
          message.success("User deleted successfully!");
          refetch();
        } catch (err) {
          console.log("err", err);
          message.error(
            err?.response?.data?.message || "Failed to delete user",
          );
        }
      },
    });
  };

  // 🔄 Enable/Disable Modal
  const showStatusChangeConfirm = (record) => {
    const action = record?.is_active ? "disable" : "enable";
    const isDisabling = record?.is_active;

    Modal.confirm({
      title: (
        <div className="flex items-center gap-2">
          {isDisabling ? (
            <StopOutlined className="text-orange-500 text-xl" />
          ) : (
            <CheckCircleOutlined className="text-green-500 text-xl" />
          )}
          <span className="text-lg font-semibold">
            {isDisabling ? "Disable" : "Enable"} User
          </span>
        </div>
      ),
      icon: null,
      content: (
        <div className="mt-4 mb-2">
          <p className="text-gray-600 mb-3">
            Are you sure you want to {isDisabling ? "disable" : "enable"} this
            user?
          </p>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-sm">
              <span className="font-medium">Name:</span>{" "}
              {record?.full_name || "N/A"}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Email:</span> {record?.email}
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Current Status:</span>{" "}
              <span
                className={isDisabling ? "text-green-600" : "text-gray-500"}
              >
                {isDisabling ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
          <p
            className={`text-sm mt-3 font-medium ${isDisabling ? "text-orange-600" : "text-green-600"}`}
          >
            {isDisabling
              ? "ℹ️ The user will not be able to access the system after being disabled."
              : "✓ The user will regain access to the system after being enabled."}
          </p>
        </div>
      ),
      okText: isDisabling ? "Yes, Disable" : "Yes, Enable",
      okType: isDisabling ? "danger" : "primary",
      cancelText: "Cancel",
      width: 500,
      centered: true,
      okButtonProps: {
        danger: isDisabling,
        icon: isDisabling ? <StopOutlined /> : <CheckCircleOutlined />,
      },
      async onOk() {
        try {
          await API.post(`/user-management/users/${record.id}/${action}/`);
          message.success(
            `User ${isDisabling ? "disabled" : "enabled"} successfully!`,
          );
          refetch();
        } catch (err) {
          console.log("err", err);
          message.error(
            err?.response?.data?.message ||
              `Failed to ${isDisabling ? "disable" : "enable"} user`,
          );
        }
      },
    });
  };

  const columns = [
    {
      title: <span className="font-semibold">Sl no.</span>,
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (text, record, index) => (
        <span className="text-gray-700">
          {index + 1 + (filter.page - 1) * filter.limit}
        </span>
      ),
    },
    {
      title: <span className="font-semibold">Name</span>,
      dataIndex: "full_name",
      key: "full_name",
      render: (_, record) => (
        <span className="font-medium text-gray-800">
          {record?.full_name || "N/A"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold">Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="text-gray-600">{email}</span>,
    },
    {
      title: <span className="font-semibold">Phone</span>,
      dataIndex: "mobile_number",
      key: "mobile_number",
      render: (mobile_number) => (
        <span className="text-gray-600">{mobile_number || "N/A"}</span>
      ),
    },
    {
      title: <span className="font-semibold">Status</span>,
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <span
          className={`px-4 py-2 rounded-full font-medium ${
            is_active
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: <span className="font-semibold">Actions</span>,
      key: "actions",
      width: 150,
      render: (_, record) => {
        const isActive = record?.is_active;
        return (
          <Space size="small">
            <Button
              type="primary"
              icon={isActive ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => showStatusChangeConfirm(record)}
              className={`${
                isActive
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isActive ? "Disable" : "Enable"}
            </Button>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  const dataSource = allUsersList?.users || [];

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage users, their status, and permissions
        </p>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: allUsersList?.pagination?.total_items,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} users`,
        }}
        onChange={handleTableChange}
        className="shadow-sm"
      />
    </div>
  );
}

export default UserManagement;
