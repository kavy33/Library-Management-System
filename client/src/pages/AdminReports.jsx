import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../layout/Header";

const AdminReports = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/reports/admin-report",
          { withCredentials: true }
        );
        setReport(data.report);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReport();
  }, []);

  if (!report) return <h2>Loading Report...</h2>;

  return (
    <main className="relative flex-1 p-5 pt-28 ">
    <Header />
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          📊 Admin Dashboard Report
        </h1>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Total Books */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
            <p className="text-gray-500 text-sm">Total Books</p>
            <h2 className="text-3xl font-bold text-indigo-600 mt-2">
              {report.totalBooks}
            </h2>
          </div>

          {/* Total Users */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {report.totalUsers}
            </h2>
          </div>

          {/* Currently Borrowed */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
            <p className="text-gray-500 text-sm">Currently Borrowed</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {report.totalBorrowed}
            </h2>
          </div>

          {/* Overdue Books */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300">
            <p className="text-gray-500 text-sm">Overdue Books</p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {report.overdueBooks}
            </h2>
          </div>

          {/* Revenue */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 col-span-full">
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h2 className="text-4xl font-bold text-yellow-600 mt-2">
              ₹{report.totalRevenue}
            </h2>
          </div>

        </div>

        {/* Download Button */}
        <div className="mt-10">
          <button
            onClick={() =>
              window.open(
                "http://localhost:4000/api/v1/reports/download-pdf",
                "_blank"
              )
            }
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            ⬇ Download PDF Report
          </button>
        </div>

      </div>
    </div>
      </main>
  );
}

export default AdminReports;