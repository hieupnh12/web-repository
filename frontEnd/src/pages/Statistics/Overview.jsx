import React, { useEffect, useState } from "react";
import { getOverviewStats } from "../../services/statisticService";
import { Package, Users, UserCheck } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Overview = () => {
  const [overviewData, setOverviewData] = useState({});
  const [revenueChart, setRevenueChart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getOverviewStats();
      if (res?.success) {
        setOverviewData(res.result.overview || {});
        setRevenueChart(res.result.revenue || []);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6">
      {/* Tabs điều hướng */}
      <StatisticTabs current="overview" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500">Sản phẩm hiện có trong kho</p>
            <p className="text-xl font-bold">{overviewData?.totalProducts || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500">Khách từ trước đến nay</p>
            <p className="text-xl font-bold">{overviewData?.totalCustomers || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500">Nhân viên đang hoạt động</p>
            <p className="text-xl font-bold">{overviewData?.activeStaffs || 0}</p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
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
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Doanh thu"
            />
            <Area
              type="monotone"
              dataKey="cost"
              stroke="#f97316"
              fillOpacity={1}
              fill="url(#colorCost)"
              name="Vốn"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Overview;
