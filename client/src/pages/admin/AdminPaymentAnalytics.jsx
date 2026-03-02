import React, { useEffect, useState } from "react";
import API from "../../utils/axiosConfig";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";
import Header from "../../layout/Header";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const AdminPaymentAnalytics = () => {

  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const monthly = await API.get("/api/v1/admin/analytics/monthly");
    const category = await API.get("/api/v1/admin/analytics/category");
    const top = await API.get("/api/v1/admin/analytics/top-users");

   const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const formattedMonthly = monthly.data.data.map(item => ({
  month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
  totalRevenue: item.totalRevenue
}));

    setMonthlyData(formattedMonthly);
    setCategoryData(category.data.data);
    setTopUsers(top.data.data);
  };

  const totalRevenue = monthlyData.reduce((acc, curr) => acc + curr.totalRevenue, 0);

let growthAmount = 0;
let growthPercentage = 0;
let displayPercentage = 0;

if (monthlyData.length >= 2) {
  const current = monthlyData.at(-1).totalRevenue;
  const previous = monthlyData.at(-2).totalRevenue;

  growthAmount = current - previous;

  if (previous > 0) {
    growthPercentage = (growthAmount / previous) * 100;

    // Cap unrealistic huge percentages
    displayPercentage = Math.abs(growthPercentage).toFixed(0);
  }
}

  return (
    <main className="relative flex-1 p-5 pt-28 ">
    <Header />
    <div className="p-10 bg-gray-50 min-h-screen">

      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Payment Analytics Dashboard
      </h2>

      {/* 🔹 STAT CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow-md">
  <p className="text-gray-500 text-sm">Total Revenue</p>

  <div className="flex items-center justify-between mt-2">
    <h3 className="text-2xl font-bold text-green-600">
      ₹{totalRevenue}
    </h3>

    {monthlyData.length >= 2 && (
      <span
  className={`text-sm font-semibold ${
    growthPercentage >= 0 ? "text-green-500" : "text-red-500"
  }`}
>
  {growthPercentage >= 0 ? "▲" : "▼"} ₹
  {Math.abs(growthAmount).toFixed(0)} 
 (+{displayPercentage}%)
</span>
    )}
  </div>

  {monthlyData.length >= 2 && (
    <p className="text-xs text-gray-400 mt-1">
      From last month
    </p>
  )}
</div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Total Categories</p>
          <h3 className="text-2xl font-bold text-indigo-600 mt-2">
            {categoryData.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Top Paying Users</p>
          <h3 className="text-2xl font-bold text-purple-600 mt-2">
            {topUsers.length}
          </h3>
        </div>

      </div>

      {/* 🔹 LINE CHART */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Monthly Revenue Trend
        </h3>

        <LineChart width={900} height={350} data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalRevenue"
            stroke="#6366F1"
            strokeWidth={3}
          />
        </LineChart>
      </div>

      {/* 🔹 PIE + BAR */}
      <div className="grid grid-cols-2 gap-8">

        {/* Pie */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Revenue Breakdown
          </h3>

          <PieChart width={400} height={350}>
            <Pie
              data={categoryData}
              dataKey="total"
              nameKey="_id"
              outerRadius={120}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Bar */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Top Paying Users
          </h3>

          <BarChart width={500} height={350} data={topUsers}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalSpent" fill="#10B981" radius={[6,6,0,0]} />
          </BarChart>
        </div>

      </div>

    </div>
      </main>
  );
};

export default AdminPaymentAnalytics;