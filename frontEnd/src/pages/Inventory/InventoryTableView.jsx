import React from "react";
import { Eye } from "lucide-react";

const StockTableView = ({
  stocks,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  isLoading = false,
  onViewDetail,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mã phiếu</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Mã nhân viên</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Khu vực kho</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Ngày tạo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : stocks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Không có phiếu tồn kho nào.
                </td>
              </tr>
            ) : (
              stocks.map((stock) => (
                <tr key={stock.inventoryId} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm text-gray-800 font-semibold">{stock.inventoryId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{stock.createdId}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{stock.areaId || "Toàn kho"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{new Date(stock.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        stock.status === 1
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {stock.status === 1 ? "Đang kiểm kê" : "Hoàn tất"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => onViewDetail && onViewDetail(stock)}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-6 space-x-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Trước
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default StockTableView;