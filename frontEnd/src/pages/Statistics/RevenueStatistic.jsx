import React, { useEffect, useState } from "react";
import { getRevenueStatistic } from "../../services/statisticService";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign } from "lucide-react";

const RevenueStatistic = () => {
  const [chartData, setChartData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getRevenueStatistic();
      if (response?.data?.success) {
        setChartData(response.data.result.chart);
        setTotalRevenue(response.data.result.totalRevenue);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-full">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500">Tổng doanh thu trong 30 ngày</p>
            <p className="text-xl font-bold">{totalRevenue.toLocaleString()} đ</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Biểu đồ doanh thu theo ngày</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Doanh thu" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueStatistic;
