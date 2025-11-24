import { Menu } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { MdAdminPanelSettings, MdDashboard } from "react-icons/md";
import { IoLogOutOutline } from "react-icons/io5";

// import { signOutAdmin, useAdminDashboard } from "../api/api";

const { SubMenu } = Menu;

const Sidebar = ({ onClick }) => {
  const location = useLocation();

  // const { adminDashboard, isLoading, isError, error, refetch } =
  //   useAdminDashboard();

  const navigate = useNavigate();
  const handleSignOut = () => {
    // signOutAdmin();
    navigate("/login");
  };

  // Determine the selected key based on current route
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === "/") return ["1"];
    if (path === "/user-management") return ["user-management"];
    if (path === "/administrators") return ["3"];
    if (path === "/payments") return ["payments"];
    return ["1"];
  };

  const isSuperAdmin = "superadmin";

  const sidebarItems = [
    {
      key: "1",
      icon: <MdDashboard className="!text-xl" />,
      label: (
        <Link className="!text-[18px]" to="/">
          Dashboard
        </Link>
      ),
    },

    {
      key: "user-management",
      icon: <FaUsers className="!text-xl" />,
      label: (
        <Link className="!text-[18px]" to="/user-management">
          User Management
        </Link>
      ),
    },

    ...(isSuperAdmin
      ? [
          {
            key: "3",
            icon: <MdAdminPanelSettings className="!text-xl" />,
            label: (
              <Link className="!text-[18px]" to="/administrators">
                Administrators
              </Link>
            ),
          },
        ]
      : []),

    // {
    //   key: "payments",
    //   icon: <FaBuildingFlag />,
    //   label: <Link to="/payments">Payments</Link>,
    // },

    // Add logout as a menu item at the bottom
    {
      key: "logout",
      icon: <IoLogOutOutline className="!text-xl" />,
      label: <span className="!text-[18px]" >Logout</span>,
      className: "bottom-20",
      onClick: handleSignOut,
      style: {
        position: "absolute",
        width: "100%",
      },
      danger: true,
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        items={sidebarItems}
        onClick={onClick}
        style={{
          height: "calc(100% - 64px)",
          backgroundColor: "#ffffff",
          color: "#002436",
        }}
        // theme="dark"
      />
    </div>
  );
};

export default Sidebar;
