import React, { useEffect, useState } from "react";
import { getInventoryStatistic } from "../../services/statisticService";
import { Search } from "lucide-react";

const InventoryStatistic = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    const res = await getInventoryStatistic();
    if (res?.data?.success) {
      setInventoryData(res.data.result);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = inventoryData.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Thống kê tồn kho</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
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
              <th className="px-4 py-2">Tên sản phẩm</th>
              <th className="px-4 py-2">Loại</th>
              <th className="px-4 py-2">Tổng số lượng</th>
              <th className="px-4 py-2">Số lượng còn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((item, index) => (
              <tr key={item.productId} className="hover:bg-blue-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{item.productName}</td>
                <td className="px-4 py-2">{item.categoryName}</td>
                <td className="px-4 py-2">{item.totalQuantity}</td>
                <td className="px-4 py-2">{item.remainingQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryStatistic;
