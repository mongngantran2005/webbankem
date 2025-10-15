import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    avgRevenue: 0,
    percentChange: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 🧮 API 1: Lấy dữ liệu biểu đồ doanh thu
        const chartRes = await axiosInstance.get("/admin/statistics/monthly-revenue");
        if (chartRes.data.success) {
          setChartData(chartRes.data.data);
        }

        // 📊 API 2: Lấy dữ liệu tổng quan
        const summaryRes = await axiosInstance.get("/admin/statistics/summary");
        if (summaryRes.data.success) {
          setSummary(summaryRes.data.data);
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu thống kê:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">📈 Dashboard thống kê</h2>

      {/* 3 ô tổng quan */}
      <div className="row mb-4">
        {/* Doanh thu */}
        <div className="col-md-4">
          <div className="card shadow-sm text-white bg-success p-3">
            <h5>💵 Doanh thu</h5>
            <h3 className="fw-bold">${summary.totalRevenue.toLocaleString()}</h3>
            <small>
              {summary.percentChange >= 0 ? "⬆️" : "⬇️"} {summary.percentChange}% so với tháng trước
            </small>
          </div>
        </div>

        {/* Khách hàng */}
        <div className="col-md-4">
          <div className="card shadow-sm text-white bg-primary p-3">
            <h5>👥 Khách hàng</h5>
            <h3 className="fw-bold">{summary.totalCustomers}</h3>
            <small>Tổng số khách hàng trong hệ thống</small>
          </div>
        </div>

        {/* Doanh thu trung bình */}
        <div className="col-md-4">
          <div className="card shadow-sm text-white bg-warning p-3">
            <h5>💰 Doanh thu trung bình</h5>
            <h3 className="fw-bold">${Math.round(summary.avgRevenue).toLocaleString()}</h3>
            <small>Trung bình trên mỗi đơn hàng</small>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu theo tháng */}
      <div className="card shadow-sm p-4">
        <h5 className="fw-semibold mb-3">📊 Doanh thu theo tháng</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total_revenue" stroke="#82ca9d" name="Doanh thu" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
