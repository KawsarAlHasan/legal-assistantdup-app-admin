import React from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaCircleDollarToSlot } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { FaSackDollar } from "react-icons/fa6";
// import { useAdminDashboard } from "../../api/api";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import ChatUserGrowthCart from "./ChatUserGrowthCart";

function Dashboard() {
  // const { adminDashboard, isLoading, isError, error, refetch } =
  //   useAdminDashboard();

  const adminDashboard = {
    admin_profile: {
      name: "The Professor",
    },
    total_chat_users: 100500,
    todays_chat_users: 1930,
    total_chats: 1930,
    total_earnings: 13490,
    total_subscribers: 1300,
    total_scans: 1000,
  };

  // if (isLoading) {
  //   return <IsLoading />;
  // }

  // if (isError) {
  //   return <IsError error={error} refetch={refetch} />;
  // }

  return (
    <div>
      <div className="bg-white w-full p-4 rounded-md">
        <p className="text-[16px] mt-2">Hi, Good Morning</p>
        <h2 className="text-[24px] font-semibold">
          {adminDashboard?.admin_profile?.name}
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-md w-full">
          <h1 className="text-[24px] font-semibold">User’s Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="mainBG w-full rounded-md p-4">
              <FaUsers className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {adminDashboard?.total_chat_users || 0}
              </h2>
              <p className="text-[16px] mt-3">Total Chat Users</p>
            </div>
            <div className="mainBG w-full rounded-md p-4">
              <AiOutlineUsergroupAdd className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {adminDashboard?.todays_chat_users || 0}
              </h2>
              <p className="text-[16px] mt-3">Today’s Chat Users</p>
            </div>
            <div className="mainBG w-full rounded-md p-4">
              <AiOutlineUsergroupAdd className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {adminDashboard?.total_chats || 0}
              </h2>
              <p className="text-[16px] mt-3">Total Chats</p>
            </div>
          </div>
        </div>
      </div>

      <ChatUserGrowthCart />
    </div>
  );
}

export default Dashboard;
