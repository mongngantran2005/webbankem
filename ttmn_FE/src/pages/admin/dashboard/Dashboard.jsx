import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaMoneyBillWave, FaUsers, FaShoppingCart } from "react-icons/fa";

export default function Dashboard() {
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
        const chartRes = await axiosInstance.get("/admin/statistics/monthly-revenue");
        if (chartRes.data.success) setChartData(chartRes.data.data);

        const summaryRes = await axiosInstance.get("/admin/statistics/summary");
        if (summaryRes.data.success) setSummary(summaryRes.data.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu thống kê:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Thống kê tổng quan</h2>

      {/* ========== Thẻ tổng quan ========== */}
      <div className="summary-cards">
        <div className="summary-card revenue">
          <div className="icon"><FaMoneyBillWave /></div>
          <div>
            <p>Doanh thu</p>
            <h3>{summary.totalRevenue.toLocaleString()} ₫</h3>
            <small>
              {summary.percentChange >= 0 ? "⬆️" : "⬇️"} {summary.percentChange}% so với tháng trước
            </small>
          </div>
        </div>

        <div className="summary-card customers">
          <div className="icon"><FaUsers /></div>
          <div>
            <p>Khách hàng</p>
            <h3>{summary.totalCustomers}</h3>
            <small>Tổng số khách hàng</small>
          </div>
        </div>

        <div className="summary-card orders">
          <div className="icon"><FaShoppingCart /></div>
          <div>
            <p>Doanh thu TB</p>
            <h3>{Math.round(summary.avgRevenue).toLocaleString()} ₫</h3>
            <small>Trung bình trên mỗi đơn hàng</small>
          </div>
        </div>
      </div>

      {/* ========== Biểu đồ doanh thu ========== */}
      <div className="chart-container">
        <h4>📈 Doanh thu theo tháng</h4>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()} ₫`} />
            <Line
              type="monotone"
              dataKey="total_revenue"
              stroke="#ee4d2d"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Doanh thu"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
