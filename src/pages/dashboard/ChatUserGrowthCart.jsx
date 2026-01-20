import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useChatGrowth } from "../../api/api";
import { Select, Spin, Alert } from "antd";

function ChatUserGrowthChart() {
  const [type, setType] = useState("monthly");

  const { growthData, isLoading, isError, error } = useChatGrowth(type);

  // Transform monthly data for chart
  const getMonthlyChartData = () => {
    if (!growthData?.monthly_growth) return [];

    return growthData.monthly_growth.map((item) => ({
      month: item.month_name, // Short month name
      users: item.new_chat_users,
      cumulative: item.cumulative_users,
    }));
  };

  // Transform yearly data for chart
  const getYearlyChartData = () => {
    if (!growthData?.yearly_growth) return [];

    return growthData.yearly_growth.map((item) => ({
      year: item.year.toString(),
      users: item.new_chat_users,
      cumulative: item.cumulative_users,
    }));
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          {type === "monthly" ? (
            <p className="font-semibold text-gray-800">
              {label}, {growthData?.year}
            </p>
          ) : (
            <p className="font-semibold text-gray-800">{label}</p>
          )}

          <p className="text-sm text-orange-600">
            New Users: <span className="font-bold">{payload[0].value}</span>
          </p>
          {payload[1] && (
            <p className="text-sm text-blue-600">
              Total: <span className="font-bold">{payload[1].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full mt-4 p-6 bg-white rounded-lg">
        <div className="flex justify-center items-center h-96">
          <Spin size="large" tip="Loading growth data..." />
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="w-full mt-4 p-6 bg-white rounded-lg">
        <Alert
          message="Error Loading Data"
          description={error?.message || "Failed to load chat user growth data"}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const chartData =
    type === "monthly" ? getMonthlyChartData() : getYearlyChartData();
  const maxValue = Math.max(...chartData.map((d) => d.users), 10);
  const yAxisMax = Math.ceil(maxValue * 1.2);

  return (
    <div className="w-full mt-4 p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Chat User Growth Overview
        </h2>

        <Select
          value={type}
          onChange={setType}
          style={{ width: 120 }}
          className="text-sm"
        >
          <Select.Option value="monthly">Monthly</Select.Option>
          <Select.Option value="yearly">Yearly</Select.Option>
        </Select>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey={type === "monthly" ? "month" : "year"}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            domain={[0, yAxisMax]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#ff6b35"
            strokeWidth={3}
            dot={{ fill: "#ff6b35", r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={1000}
            name="New Users"
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#3b82f6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            animationDuration={1000}
            name="Cumulative Users"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary Cards */}
      {type === "monthly" && growthData?.growth_summary && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              Highest Growth Month
            </p>
            <p className="text-2xl font-bold text-green-700 mt-2">
              {growthData.growth_summary.highest_growth_month.month_name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold text-green-600">
                +{growthData.growth_summary.highest_growth_month.new_chat_users}
              </span>{" "}
              new users
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              Average Monthly Growth
            </p>
            <p className="text-2xl font-bold text-blue-700 mt-2">
              {growthData.growth_summary.average_monthly_growth.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 mt-1">users per month</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              Total Users ({growthData.year})
            </p>
            <p className="text-2xl font-bold text-orange-700 mt-2">
              {growthData.total_users_this_year}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {growthData.growth_summary.growth_rate_percentage > 0 ? (
                <span className="text-green-600">
                  ↑{" "}
                  {growthData.growth_summary.growth_rate_percentage.toFixed(1)}%
                  YoY
                </span>
              ) : (
                <span className="text-gray-500">First year data</span>
              )}
            </p>
          </div>
        </div>
      )}

      {type === "yearly" && growthData?.overall_summary && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              Total Chat Users
            </p>
            <p className="text-2xl font-bold text-purple-700 mt-2">
              {growthData.overall_summary.total_chat_users}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {growthData.overall_summary.years_in_operation} years in operation
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              Average Yearly Growth
            </p>
            <p className="text-2xl font-bold text-blue-700 mt-2">
              {growthData.overall_summary.average_yearly_growth.toFixed(1)}
            </p>
            <p className="text-sm text-gray-600 mt-1">users per year</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              Best Year
            </p>
            <p className="text-2xl font-bold text-green-700 mt-2">
              {growthData.overall_summary.best_year.year}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-semibold text-green-600">
                +{growthData.overall_summary.best_year.new_chat_users}
              </span>{" "}
              users
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
            <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">
              CAGR
            </p>
            <p className="text-2xl font-bold text-orange-700 mt-2">
              {growthData.overall_summary.compound_annual_growth_rate.toFixed(
                1,
              )}
              %
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {growthData.date_range.start_year} -{" "}
              {growthData.date_range.end_year}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatUserGrowthChart;
