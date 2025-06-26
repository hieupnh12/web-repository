
import React, { useEffect, useState } from "react";
import { getSupplierStatistic, getCustomerStatistic } from "../../services/statisticService";
import { Search, Factory, User2 } from "lucide-react";

export const SupplierStatistic = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await getSupplierStatistic();
      if (res?.data?.success) {
        setSuppliers(res.data.result);
      }
    };
    fetchData();
  }, []);

  const filtered = suppliers.filter((s) =>
    s.supplierName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Factory className="w-5 h-5 text-indigo-500" /> Thống kê nhà cung cấp
          </h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm nhà cung cấp..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Tên nhà cung cấp</th>
              <th className="px-4 py-2">Số sản phẩm cung cấp</th>
              <th className="px-4 py-2">Số đơn hàng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((s, index) => (
              <tr key={s.supplierId} className="hover:bg-blue-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{s.supplierName}</td>
                <td className="px-4 py-2">{s.totalProducts}</td>
                <td className="px-4 py-2">{s.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default SupplierStatistic;