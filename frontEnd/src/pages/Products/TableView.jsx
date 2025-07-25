import React from "react";
import { Package, Edit, Info, Trash } from "lucide-react";

const TableView = ({
  products,
  currentPage,
  itemsPerPage,
  onSort,
  sortBy,
  sortOrder,
  onEdit,
  onDetail,
  onDelete,
}) => {
  const getStockStatus = (quantity) => {
    if (quantity == null || quantity === 0)
      return { status: "Hết hàng", color: "bg-red-100 text-red-800" };
    if (quantity < 10)
      return { status: "Sắp hết", color: "bg-yellow-100 text-yellow-800" };
    if (quantity < 20)
      return { status: "Còn ít", color: "bg-orange-100 text-orange-800" };
    return { status: "Còn nhiều", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                STT
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => onSort("productName")}
              >
                <div className="flex items-center space-x-1">
                  <span>Tên sản phẩm</span>
                  <div className="flex flex-col">
                    <div
                      className={`w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent ${
                        sortBy === "productName" && sortOrder === "asc"
                          ? "border-b-blue-500"
                          : "border-b-gray-300"
                      }`}
                      style={{ borderBottomWidth: "4px" }}
                    ></div>
                    <div
                      className={`w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent ${
                        sortBy === "productName" && sortOrder === "desc"
                          ? "border-t-blue-500"
                          : "border-t-gray-300"
                      }`}
                      style={{ borderTopWidth: "4px" }}
                    ></div>
                  </div>
                </div>
              </th>
              <th
                className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => onSort("stockQuantity")}
              >
                <div className="flex items-center space-x-1">
                  <span>Số lượng tồn</span>
                  <div className="flex flex-col">
                    <div
                      className={`w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent ${
                        sortBy === "stockQuantity" && sortOrder === "asc"
                          ? "border-b-blue-500"
                          : "border-b-gray-300"
                      }`}
                      style={{ borderBottomWidth: "4px" }}
                    ></div>
                    <div
                      className={`w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent ${
                        sortBy === "stockQuantity" && sortOrder === "desc"
                          ? "border-t-blue-500"
                          : "border-t-gray-300"
                      }`}
                      style={{ borderTopWidth: "4px" }}
                    ></div>
                  </div>
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Thương hiệu
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Hệ điều hành
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Xuất xứ
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Khu vực kho
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((product, index) => {
              const stockInfo = getStockStatus(product.stockQuantity);
              return (
                <tr
                  key={product.productId}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mr-3">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.productName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {product.stockQuantity ?? 0}
                    </div>
                    <div className="text-xs text-gray-500">cái</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.brandName || product.brandId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.operatingSystemName || product.operatingSystemId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.originName || product.originId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {product.warehouseAreaName || product.warehouseAreaId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stockInfo.color}`}
                    >
                      {stockInfo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button
                      onClick={() => onEdit && onEdit(product)}
                      className="inline-flex items-center px-2 py-1 text-yellow-600 hover:text-yellow-800 rounded-md transition"
                      title="Sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDetail && onDetail(product)}
                      className="inline-flex items-center px-2 py-1 text-blue-600 hover:text-blue-800 rounded-md transition"
                      title="Chi tiết"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(product)}
                      className="inline-flex items-center px-2 py-1 text-red-600 hover:text-red-800 rounded-md transition"
                      title="Xóa"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;