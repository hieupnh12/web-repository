import React, { useEffect, useState } from "react";
import { getStockById } from "../../services/inventoryService";
import Button from "../../components/ui/Button";

const StockDetailPage = ({ inventoryId, onBack }) => {
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await getStockById(inventoryId);
        setStockData(data);
      } catch (err) {
        alert("Không thể tải chi tiết kiểm kê");
      }
    };
    fetchStock();
  }, [inventoryId]);

  if (!stockData) {
    return <div className="text-center py-12 text-gray-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Chi tiết phiếu #{inventoryId}</h2>

      <div className="mb-6">
        <p><strong>Nhân viên:</strong> {stockData.createdId}</p>
        <p><strong>Khu vực kho:</strong> {stockData.areaId || "Toàn kho"}</p>
        <p><strong>Trạng thái:</strong> {stockData.status === 1 ? "Đang kiểm kê" : "Hoàn tất"}</p>
      </div>

      <h3 className="text-md font-medium mb-2">Chi tiết số lượng</h3>
      <table className="min-w-full table-auto border rounded-xl overflow-hidden">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phiên bản sản phẩm</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Hệ thống</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Thực tế</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Ghi chú</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {stockData.inventoryDetails?.map((item) => (
            <tr key={item.productVersionId}>
              <td className="px-4 py-2 text-sm text-gray-800">{item.productVersionId}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{item.systemQuantity}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{item.quantity}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-between">
        <Button onClick={onBack} className="bg-gray-300 text-gray-800 hover:bg-gray-400">
          Quay lại
        </Button>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Quét IMEI
        </Button>
      </div>
    </div>
  );
};

export default StockDetailPage;