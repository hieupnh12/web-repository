import React, { useEffect, useState } from "react";
import {
  getOverviewRevenue7Days,
  getOverviewCounts,
} from "../../../../services/statisticService";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Package, Users, UserCheck } from "lucide-react";
import { TablePagination } from "@mui/material";

const Overview = () => {
  const [overviewData, setOverviewData] = useState({});
  const [revenueChart, setRevenueChart] = useState([]);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resCounts, resRevenue] = await Promise.all([
          getOverviewCounts(),
          getOverviewRevenue7Days(),
        ]);

        if (resCounts?.code === 1000) {
          setOverviewData(resCounts.result || {});
        }

        if (resRevenue?.code === 1000) {
          setRevenueChart(resRevenue.result || []);
        }

        setError(null);
      } catch (err) {
        console.error("Error loading overview:", err);
        setError("Lỗi tải dữ liệu tổng quan");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-xl">
          Lỗi: {error}
        </div>
      )}

      {/* Thẻ thống kê tổng quan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mt-4">
        <SummaryCard
          icon={<Package className="w-6 h-6" />}
          title="Sản phẩm hiện có trong kho"
          value={overviewData.itemCount || 0}
          bg="bg-blue-100"
          text="text-blue-600"
        />
        <SummaryCard
          icon={<Users className="w-6 h-6" />}
          title="Khách từ trước đến nay"
          value={overviewData.customerCount || 0}
          bg="bg-green-100"
          text="text-green-600"
        />
        <SummaryCard
          icon={<UserCheck className="w-6 h-6" />}
          title="Nhân viên đang hoạt động"
          value={overviewData.staffCount || 0}
          bg="bg-yellow-100"
          text="text-yellow-600"
        />
      </div>

      {/* Biểu đồ doanh thu */}
<div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
  <h2 className="text-lg font-semibold mb-4">Thống kê doanh thu 7 ngày gần nhất</h2>
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={revenueChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
        </linearGradient>
      </defs>

      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis
        width={80}
        tickFormatter={(value) =>
          new Intl.NumberFormat("vi-VN", {
            notation: "compact",
            compactDisplay: "short",
          }).format(value)
        }
      />
      {/* 👇 Thêm Tooltip và Legend tại đây */}
      <Tooltip />
      <Legend />

      <Area
        type="monotone"
        dataKey="revenue"
        stroke="#3b82f6"
        fill="url(#colorRevenue)"
        name="Doanh thu"
      />
      <Area
        type="monotone"
        dataKey="expenses"
        stroke="#f97316"
        fill="url(#colorCost)"
        name="Vốn"
      />
      <Area
        type="monotone"
        dataKey="profit"
        stroke="#10b981"
        fill="url(#colorProfit)"
        name="Lợi nhuận"
      />
    </AreaChart>
  </ResponsiveContainer>
</div>

      {/* Bảng doanh thu */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
  <h2 className="text-lg font-semibold mb-4">Chi tiết doanh thu theo ngày</h2>
  <div className="overflow-auto rounded-xl">
    <table className="w-full text-sm text-left rounded-xl overflow-hidden">
      <thead className="bg-[#2196f3] text-white">
        <tr>
          <th className="px-4 py-2">STT</th>
          <th className="px-4 py-2">Ngày</th>
          <th className="px-4 py-2">Vốn</th>
          <th className="px-4 py-2">Doanh thu</th>
          <th className="px-4 py-2">Lợi nhuận</th>
        </tr>
      </thead>
      <tbody>
        {revenueChart.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-500 bg-blue-50">
              Không có dữ liệu.
            </td>
          </tr>
        ) : (
          revenueChart
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, idx) => (
              <tr
                key={idx}
                className={`${
                  idx % 2 === 0 ? "bg-blue-50" : "bg-white"
                } hover:bg-blue-100 transition duration-200`}
              >
                <td className="px-4 py-2">{page * rowsPerPage + idx + 1}</td>
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">{item.expenses?.toLocaleString("vi-VN")}đ</td>
                <td className="px-4 py-2">{item.revenue?.toLocaleString("vi-VN")}đ</td>
                <td className="px-4 py-2">{item.profit?.toLocaleString("vi-VN")}đ</td>
              </tr>
            ))
        )}
      </tbody>
    </table>
  </div>
</div>


        <div className="mt-4 bg-blue-50 rounded-b-xl">
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={revenueChart.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Số hàng mỗi trang:"
            sx={{
              borderTop: "1px solid #e0e0e0",
              backgroundColor: "#f0f9ff",
              borderRadius: "0 0 12px 12px",
            }}
          />
        </div>

      </div>
    </div>
  );
};

const SummaryCard = ({ icon, title, value, bg, text }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-200">
    <div className={`${bg} ${text} p-3 rounded-full`}>{icon}</div>
    <div>
      <p className="text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default Overview;
