import React, { useEffect, useState } from "react";
import { getInventoryStatistic } from "../../../../services/statisticService";
import { Search } from "lucide-react";

const InventoryStatistic = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchData = async () => {
    const payload = {
      startTime: startDate ? `${startDate} 00:00:00` : undefined,
      endTime: endDate ? `${endDate} 23:59:59` : undefined,
      productName: search || undefined,
    };

    const res = await getInventoryStatistic(payload);
    if (res.status === 200) {
      setInventoryData(res.result || []);
    } else {
      setInventoryData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // initial load

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 px-4 py-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Thống kê tồn kho</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Tên sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl"
          />
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
          >
            Lọc
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Tên sản phẩm</th>
              <th className="px-4 py-2">Loại</th>
              <th className="px-4 py-2">Tổng số lượng</th>
              <th className="px-4 py-2">Số lượng còn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {inventoryData.map((item, index) => (
              <tr key={item.productId} className="hover:bg-blue-50">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2 font-medium">{item.productName}</td>
                <td className="px-4 py-2">{item.categoryName}</td>
                <td className="px-4 py-2">{item.totalQuantity}</td>
                <td className="px-4 py-2">{item.remainingQuantity}</td>
              </tr>
            ))}
            {inventoryData.length === 0 && (
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

export default InventoryStatistic;
