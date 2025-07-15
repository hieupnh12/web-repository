import React, { useEffect, useState } from "react";
import { getRevenueByDateRange } from "../../../../services/statisticService";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import * as XLSX from "xlsx";
import { FileDown, RefreshCw } from "lucide-react";


const RevenueDatetoDate = () => {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!startDate || !endDate) {
      setError("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }
    try {
      const res = await getRevenueByDateRange(startDate, endDate);
      if (res.status === 200) {
        setData(res.result || []);
        setError(null);
      } else {
        setData([]);
        setError(res.message || "Lỗi tải dữ liệu");
      }
    } catch (err) {
      console.error("Error:", err);
      setData([]);
      setError("Lỗi kết nối tới API");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportExcel = () => {
    const exportData = data.map((item, index) => ({
      STT: index + 1,
      Ngày: item.date,
      "Chi phí": item.expenses.toLocaleString("vi-VN") + "đ",
      "Doanh thu": item.revenues.toLocaleString("vi-VN") + "đ",
      "Lợi nhuận": item.profits.toLocaleString("vi-VN") + "đ",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh thu từ ngày tới ngày");
    XLSX.writeFile(workbook, `doanhthu_tu_${startDate}_den_${endDate}.xlsx`);
  };

  const handleReset = () => {
    setStartDate(weekAgo);
    setEndDate(today);
    setError(null);
    fetchData();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6">
      
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Thống kê doanh thu từ ngày tới ngày</h2>

        <div className="flex flex-wrap gap-4 items-center mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
          <span className="text-gray-600">đến</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
          >
            Lọc
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
          >
            <FileDown className="w-4 h-4" /> Xuất Excel
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded-xl">
            Lỗi: {error}
          </div>
        )}

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="costColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profitColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenues"
              stroke="#3b82f6"
              fill="url(#revenueColor)"
              name="Doanh thu"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#f97316"
              fill="url(#costColor)"
              name="Chi phí"
            />
            <Area
              type="monotone"
              dataKey="profits"
              stroke="#10b981"
              fill="url(#profitColor)"
              name="Lợi nhuận"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold mb-4">Chi tiết doanh thu theo ngày</h2>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">STT</th>
              <th className="px-4 py-2">Ngày</th>
              <th className="px-4 py-2">Chi phí</th>
              <th className="px-4 py-2">Doanh thu</th>
              <th className="px-4 py-2">Lợi nhuận</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.date} className="hover:bg-blue-50 border-b">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">{item.expenses?.toLocaleString("vi-VN")}đ</td>
                <td className="px-4 py-2">{item.revenues?.toLocaleString("vi-VN")}đ</td>
                <td className="px-4 py-2">{item.profits?.toLocaleString("vi-VN")}đ</td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RevenueDatetoDate;
