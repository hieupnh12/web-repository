import React, { useEffect, useState } from "react";
import { getSupplierStatistic } from "../../../../services/statisticService";
import { FileDown, RefreshCw } from "lucide-react";
import * as XLSX from "xlsx";


const SupplierStatistic = () => {
  const [suppliers, setSuppliers] = useState([]);

  const fetchData = async () => {
    const res = await getSupplierStatistic();
    if (res?.code === 1000) {
      setSuppliers(res.result || []);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportExcel = () => {
    const data = suppliers.map((s, index) => ({
      STT: index + 1,
      "Mã nhà cung cấp": s.supplierId,
      "Tên nhà cung cấp": s.supplierName,
      "Số lượng nhập": s.amount,
      "Tổng số tiền":
        s.totalAmount !== null
          ? s.totalAmount.toLocaleString("vi-VN") + "đ"
          : "0đ",
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Thống kê NCC");
    XLSX.writeFile(workbook, "thongke_nhacungcap.xlsx");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6">
      

      {/* Nút hành động */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex gap-3">
        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <FileDown className="w-4 h-4" /> Xuất Excel
        </button>
        <button
          onClick={fetchData}
          className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Làm mới
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">STT</th>
              <th className="px-4 py-2">Mã nhà cung cấp</th>
              <th className="px-4 py-2">Tên nhà cung cấp</th>
              <th className="px-4 py-2">Số lượng nhập</th>
              <th className="px-4 py-2">Tổng số tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {suppliers.map((s, index) => (
              <tr key={s.supplierId} className="hover:bg-blue-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{s.supplierId.slice(0, 8)}</td>
                <td className="px-4 py-2">{s.supplierName}</td>
                <td className="px-4 py-2">{s.amount}</td>
                <td className="px-4 py-2">
                  {s.totalAmount
                    ? s.totalAmount.toLocaleString("vi-VN") + "đ"
                    : "0đ"}
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && (
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

export default SupplierStatistic;
