import React, { useEffect, useState } from "react";
import { getCustomerStatistic } from "../../../../services/statisticService";
import { Search, User2 } from "lucide-react";

const CustomerStatistic = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCustomerStatistic();
        if (res?.code === 1000) {
          setCustomers(res.result || []);
          setError(null);
        } else {
          setCustomers([]);
          setError(res.message || "Không thể tải dữ liệu");
        }
      } catch (err) {
        console.error("Lỗi:", err);
        setError("Lỗi kết nối API");
        setCustomers([]);
      }
    };
    fetchData();
  }, []);

  const filtered = customers.filter((c) =>
    c.customerName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User2 className="w-5 h-5 text-green-500" /> Thống kê khách hàng
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 mb-6 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Tên khách hàng</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Số điện thoại</th>
              <th className="px-4 py-2">Tổng đơn hàng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((c, index) => (
              <tr key={c.customerId} className="hover:bg-blue-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{c.customerName}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.phone}</td>
                <td className="px-4 py-2">{c.totalOrders}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
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

export default CustomerStatistic;
