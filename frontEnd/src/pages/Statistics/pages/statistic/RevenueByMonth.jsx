import React, { useEffect, useState } from "react";
import { getRevenueByMonth } from "../../../../services/statisticService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import * as XLSX from "xlsx";
import { FileDown } from "lucide-react";

const RevenueByMonth = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const years = [2022, 2023, 2024, 2025, 2026];

  // Hàm chuẩn hóa dữ liệu thành đủ 12 tháng
  const normalizeData = (result) => {
    const monthMap = new Map(result.map(item => [item.month, item]));
    const fullYearData = [];
    for (let i = 1; i <= 12; i++) {
      if (monthMap.has(i)) {
        fullYearData.push(monthMap.get(i));
      } else {
        fullYearData.push({ month: i, expenses: 0, revenues: 0, profits: 0 });
      }
    }
    return fullYearData;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRevenueByMonth(year);
        if (response.code === 1000) {
          setData(normalizeData(response.result));
          setError(null);
        } else {
          setData([]);
          setError(`API returned non-success code: ${response.code}`);
        }
      } catch (error) {
        console.error("Error fetching revenue data:", {
          message: error.message,
          code: error.code,
          response: error.response ? error.response.data : null,
          url: `statistic/revenue/moth/${year}`
        });
        setData([]);
        setError(`Failed to fetch revenue data: ${error.message}`);
      }
    };

    fetchData();
  }, [year]);

  const handleExportExcel = () => {
    const exportData = data.map((item, index) => ({
      STT: index + 1,
      Tháng: `Tháng ${item.month}`,
      "Chi phí": item.expenses.toLocaleString("vi-VN") + "đ",
      "Doanh thu": item.revenues.toLocaleString("vi-VN") + "đ",
      "Lợi nhuận": item.profits.toLocaleString("vi-VN") + "đ"
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh thu theo tháng");
    XLSX.writeFile(workbook, `doanhthu_thang_nam_${year}.xlsx`);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">Thống kê doanh thu theo tháng - Năm {year}</h2>
        <div className="flex items-center gap-2">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>Năm {y}</option>
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

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-xl">
          Lỗi: {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickFormatter={(m) => `Tháng ${m}`} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" fill="#f97316" name="Chi phí" />
            <Bar dataKey="revenues" fill="#3b82f6" name="Doanh thu" />
            <Bar dataKey="profits" fill="#22c55e" name="Lợi nhuận" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">STT</th>
              <th className="px-4 py-2">Tháng</th>
              <th className="px-4 py-2">Chi phí</th>
              <th className="px-4 py-2">Doanh thu</th>
              <th className="px-4 py-2">Lợi nhuận</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.month} className="hover:bg-blue-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">Tháng {item.month}</td>
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

export default RevenueByMonth;
