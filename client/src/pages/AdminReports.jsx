import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div style={{ padding: "30px" }}>
      <h1>📊 Admin Dashboard Report</h1>

      <div style={cardStyle}>📚 Total Books: {report.totalBooks}</div>
      <div style={cardStyle}>👥 Total Users: {report.totalUsers}</div>
      <div style={cardStyle}>📖 Currently Borrowed: {report.totalBorrowed}</div>
      <div style={cardStyle}>⏰ Overdue Books: {report.overdueBooks}</div>
      <div style={cardStyle}>💰 Total Revenue: ₹{report.totalRevenue}</div>
      <button className="bg-black text-white px-5 "
  onClick={() =>
    window.open(
      "http://localhost:4000/api/v1/reports/download-pdf",
      "_blank"
    )
  }
>
  Download PDF Report
</button>
    </div>

    
  );
};

const cardStyle = {
  background: "#f4f4f4",
  padding: "15px",
  margin: "10px 0",
  borderRadius: "8px",
  fontSize: "18px",
};

export default AdminReports;