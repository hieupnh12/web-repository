import React, { useEffect, useState } from "react";
import { getRevenueByYears } from "../../../../services/statisticService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";

const RevenueByYears = () => {
  const currentYear = new Date().getFullYear();
  const [startYear, setStartYear] = useState(2020);
  const [endYear, setEndYear] = useState(currentYear);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Load dữ liệu mỗi khi thay đổi khoảng năm
  useEffect(() => {
    fetchData(startYear, endYear);
  }, [startYear, endYear]);

  const fetchData = async (startYear, endYear) => {
    const res = await getRevenueByYears(startYear, endYear);
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
      Năm: item.year,
      "Chi phí": item.expenses.toLocaleString("vi-VN") + "đ",
      "Doanh thu": item.revenues.toLocaleString("vi-VN") + "đ",
      "Lợi nhuận": item.profits.toLocaleString("vi-VN") + "đ"
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Doanh thu theo năm");
    XLSX.writeFile(workbook, `thongke_doanhthu_nam_${startYear}_den_${endYear}.xlsx`);
  };

  const years = [];
  for (let y = 2020; y <= currentYear; y++) {
    years.push(y);
  }

  return (
    <div>
      {/* Bộ lọc khoảng năm + nút export */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">
          Thống kê doanh thu từ năm {startYear} đến {endYear}
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-sm">Từ</label>
          <select
            value={startYear}
            onChange={(e) => setStartYear(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>Năm {y}</option>
            ))}
          </select>
          <label className="text-sm">Đến</label>
          <select
            value={endYear}
            onChange={(e) => setEndYear(Number(e.target.value))}
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
            <FileDown className="w-4 h-4" /> Xuất Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-xl">
          Lỗi: {error}
        </div>
      )}

      {/* Biểu đồ cột */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" fill="#f97316" name="Chi phí" />
            <Bar dataKey="revenues" fill="#3b82f6" name="Doanh thu" />
            <Bar dataKey="profits" fill="#22c55e" name="Lợi nhuận" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng chi tiết */}
      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">STT</th>
              <th className="px-4 py-2">Năm</th>
              <th className="px-4 py-2">Chi phí</th>
              <th className="px-4 py-2">Doanh thu</th>
              <th className="px-4 py-2">Lợi nhuận</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.year} className="hover:bg-blue-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{item.year}</td>
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

export default RevenueByYears;
