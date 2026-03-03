import { useEffect, useState } from "react";
import API from "../utils/axiosConfig";
import Header from "../layout/Header";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const UserAnalytics = () => {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    const res = await API.get("/api/v1/user-reports/dashboard");
    setData(res.data.analytics);
  };

  if (!data) return <div className="p-10">Loading...</div>;

  return (
   <main className="relative flex-1 p-5 pt-28 ">
    <Header />
      <h2 className="text-2xl font-bold mb-6">📊 My Analytics</h2>
      <button
  onClick={() => window.open("/api/v1/user-reports/download", "_blank")}
  className="mb-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
>
  Download Report
</button>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-5 gap-6 mb-10">
        <Card title="Total Borrowed" value={data.totalBorrowed} />
        <Card title="Currently Borrowed" value={data.currentlyBorrowed} />
        <Card title="Total Spent" value={`₹${data.totalSpent}`} />
        <Card title="Total Fines" value={`₹${data.totalFines}`} />
        <Card title="Current Balance" value={`₹${data.currentBalance}`} />
      </div>

      {/* MONTHLY CHART */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">Monthly Spending</h3>
      {data.chartData.length === 0 ? (
  <div className="text-center text-gray-500 py-20">
    No spending data available yet.
  </div>
) : (
       <ResponsiveContainer width="100%" height={350}>
  <BarChart data={data.chartData}>
    <XAxis dataKey="month" />
    <YAxis />
    <Tooltip 
      contentStyle={{ borderRadius: "8px", border: "none" }}
      cursor={{ fill: "rgba(37,99,235,0.1)" }}
    />
    <Bar 
      dataKey="amount" 
      fill="#2563eb"
      radius={[8, 8, 0, 0]} 
    />
  </BarChart>
</ResponsiveContainer>
)}
      </div>

    </main>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center">
    <p className="text-gray-500 text-sm tracking-wide">{title}</p>
    <p className="text-2xl font-bold mt-3 text-gray-800">{value}</p>
  </div>
);

export default UserAnalytics;