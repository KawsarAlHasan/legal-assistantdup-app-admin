import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import IsLoading from "../../components/IsLoading";
import IsError from "../../components/IsError";
import ChatUserGrowthCart from "./ChatUserGrowthCart";
import { useDashboardData } from "../../api/api";

function Dashboard() {
  const { dashboardData, isLoading, isError, error, refetch } =
    useDashboardData();

  if (isLoading) {
    return <IsLoading />;
  }

  if (isError) {
    return <IsError error={error} refetch={refetch} />;
  }

  const hour = new Date().getHours();
  let message = "";

  if (hour >= 5 && hour < 12) {
    message = "Good morning";
  } else if (hour >= 12 && hour < 16) {
    message = "Good afternoon";
  } else if (hour >= 16 && hour < 19) {
    message = "Good evening";
  } else {
    message = "Good night";
  }

  return (
    <div>
      <div className="bg-white w-full p-4 rounded-md">
        <div className="flex items-center gap-4">
          {dashboardData?.admin_info?.profile_picture && (
            <img
              src={dashboardData?.admin_info?.profile_picture}
              className="w-[60px] h-[60px] rounded-full object-cover"
              alt=""
            />
          )}
          <div>
            <p className="text-[16px] mt-2">Hi, {message}</p>
            <h2 className="text-[24px] font-semibold">
              {dashboardData?.admin_info?.full_name}
            </h2>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-md w-full">
          <h1 className="text-[24px] font-semibold">User’s Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="mainBG w-full rounded-md p-4">
              <FaUsers className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {dashboardData?.total_chat_users || 0}
              </h2>
              <p className="text-[16px] mt-3">Total Chat Users</p>
            </div>
            <div className="mainBG w-full rounded-md p-4">
              <AiOutlineUsergroupAdd className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {dashboardData?.todays_chat_users || 0}
              </h2>
              <p className="text-[16px] mt-3">Today’s Chat Users</p>
            </div>
            {/* <div className="mainBG w-full rounded-md p-4">
              <AiOutlineUsergroupAdd className="bgBlack text-[#FFF] h-[40px] rounded-full w-[40px] p-2" />
              <h2 className="text-[24px] font-semibold text-[#242424] mt-2">
                {adminDashboard?.total_chats || 0}
              </h2>
              <p className="text-[16px] mt-3">Total Chats</p>
            </div> */}
          </div>
        </div>
      </div>

      <ChatUserGrowthCart />
    </div>
  );
}

export default Dashboard;
