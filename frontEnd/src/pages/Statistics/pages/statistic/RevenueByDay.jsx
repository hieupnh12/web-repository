import React, { useEffect, useState } from "react";
import { getRevenueByDay } from "../../../../services/statisticService";
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
import { FileDown } from "lucide-react";

const RevenueByDay = () => {
  const current = new Date();
  const [year, setYear] = useState(current.getFullYear());
  const [month, setMonth] = useState(current.getMonth() + 1);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData(year, month);
  }, [year, month]);

  const fetchData = async (y, m) => {
    const res = await getRevenueByDay(y, m);
    console.log(res);
    
    if (res.status === 200) {
      setData(res.data.result || []);
      setError(null);
    } else {
      setData([]);
      setError(res.message || "Lỗi tải dữ liệu");
    }
  };

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh thu theo ngày");
    XLSX.writeFile(workbook, `doanhthu_ngay_${month}_${year}.xlsx`);
  };

  const months = [...Array(12)].map((_, i) => i + 1);
  const years = [2022, 2023, 2024, 2025, 2026];

  return (
    <div>
      {/* Bộ lọc */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Thống kê theo ngày - Tháng {month} / Năm {year}</h2>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                Năm {y}
              </option>
            ))}
          </select>
          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm"
          >
            <FileDown className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Hiển thị lỗi */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-xl">
          Lỗi: {error}
        </div>
      )}

      {/* Biểu đồ */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
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
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
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
              stroke="#22c55e"
              fill="url(#profitColor)"
              name="Lợi nhuận"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng chi tiết */}
      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
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
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.date} className="hover:bg-blue-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">{item.expenses.toLocaleString("vi-VN")}đ</td>
                <td className="px-4 py-2">{item.revenues.toLocaleString("vi-VN")}đ</td>
                <td className="px-4 py-2">{item.profits.toLocaleString("vi-VN")}đ</td>
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

export default RevenueByDay;
