import { message, Modal, Space, Table, Button, Tag } from "antd";
import IsError from "../../components/IsError";
import IsLoading from "../../components/IsLoading";
import {
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import AddAdmin from "./AddAmin";
import AdminEdit from "./AdminEdit";
import { API, useAllAdmins } from "../../api/api";
import { useState } from "react";

function Administrators() {
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });

  const { admins, isLoading, isError, error, refetch } = useAllAdmins(filter);

  const handleTableChange = (pagination, filters, sorter) => {
    setFilter((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  // 🗑️ delete confirm modal
  const showDeleteConfirm = (record) => {
    Modal.confirm({
      title: (
        <div className="flex items-center gap-2">
          <DeleteOutlined className="text-red-500 text-xl" />
          <span className="text-lg font-semibold">Delete Admin</span>
        </div>
      ),
      icon: null,
      content: (
        <div className="mt-4 mb-2">
          <p className="text-gray-600 mb-3">
            Are you sure you want to delete this admin?
          </p>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-sm">
              <span className="font-medium">Name:</span>{" "}
              {record?.admin_name || "N/A"}
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
        size: "large",
        icon: <DeleteOutlined />,
      },
      cancelButtonProps: {
        size: "large",
      },
      async onOk() {
        try {
          await API.delete(`/administrators/admins/${record?.id}/delete/`);

          message.success("Admin deleted successfully!");
          refetch();
        } catch (err) {
          console.log("err", err);
          message.error(
            err?.response?.data?.message || "Failed to delete admin",
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
            {isDisabling ? "Disable" : "Enable"} Admin
          </span>
        </div>
      ),
      icon: null,
      content: (
        <div className="mt-4 mb-2">
          <p className="text-gray-600 mb-3">
            Are you sure you want to {isDisabling ? "disable" : "enable"} this
            admin?
          </p>
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-sm">
              <span className="font-medium">Name:</span>{" "}
              {record?.admin_name || "N/A"}
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
              ? "ℹ️ The admin will not be able to access the system after being disabled."
              : "✓ The admin will regain access to the system after being enabled."}
          </p>
        </div>
      ),
      okText: isDisabling ? "Yes, Disable" : "Yes, Enable",
      okType: isDisabling ? "danger" : "primary",
      cancelText: "Cancel",
      width: 500,
      centered: true,
      okButtonProps: {
        size: "large",
        danger: isDisabling,
        icon: isDisabling ? <StopOutlined /> : <CheckCircleOutlined />,
      },
      cancelButtonProps: {
        size: "large",
      },
      async onOk() {
        try {
          await API.post(`/administrators/admins/${record.id}/${action}/`);
          message.success(
            `Admin ${isDisabling ? "disabled" : "enabled"} successfully!`,
          );
          refetch();
        } catch (err) {
          console.log("err", err);
          message.error(
            err?.response?.data?.message ||
              `Failed to ${isDisabling ? "disable" : "enable"} admin`,
          );
        }
      },
    });
  };

  const columns = [
    {
      title: <span>Sl no.</span>,
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => (
        <span>{index + 1 + (filter.page - 1) * filter.limit}</span>
      ),
    },
    {
      title: <span>Name</span>,
      dataIndex: "admin_name",
      key: "admin_name",
      render: (_, record) => <h2>{record?.admin_name || "N/A"}</h2>,
    },
    {
      title: <span>Email</span>,
      dataIndex: "email",
      key: "email",
      render: (email) => <span className="">{email}</span>,
    },
    {
      title: <span>Phone</span>,
      dataIndex: "mobile_number",
      key: "mobile_number",
      render: (mobile_number) => (
        <span className="">{mobile_number || "N/A"}</span>
      ),
    },
    {
      title: <span>Has Access To</span>,
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <span className="">
          {role == "SUPER_ADMIN" ? "Super Admin" : "Admin"}
        </span>
      ),
    },
    {
      title: <span>Status</span>,
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active, record) => (
        <>
          <Tag className="py-1 px-2" color={is_active ? "green" : "red"}>
            {is_active ? "Active" : "Inactive"}
          </Tag>

          <Button
            icon={<EditOutlined />}
            disabled={record.role === "SUPER_ADMIN"}
            onClick={
              record.role === "SUPER_ADMIN"
                ? undefined
                : () => showStatusChangeConfirm(record)
            }
          />
        </>
      ),
    },
    {
      title: <span>Action</span>,
      key: "action",
      render: (_, record) => {
        const isSuperAdmin = record.role === "SUPER_ADMIN";

        return (
          <Space size="small">
            <AdminEdit adminProfile={record} refetch={refetch} />

            <DeleteOutlined
              className={`text-[23px] bg-[#E30000] p-1 rounded-sm text-white ${
                isSuperAdmin
                  ? "cursor-not-allowed opacity-50"
                  : "hover:text-red-300 cursor-pointer"
              }`}
              onClick={
                isSuperAdmin ? undefined : () => showDeleteConfirm(record)
              }
            />
          </Space>
        );
      },
    },
  ];

  const dataSource = admins?.administrators || [];

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  return (
    <div className="p-4">
      <AddAdmin refetch={refetch} />

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: filter.page,
          pageSize: filter.limit,
          total: admins?.pagination?.total_items,
          showSizeChanger: false,
          pageSizeOptions: ["10", "20", "50", "100"],

          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} admins`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default Administrators;
