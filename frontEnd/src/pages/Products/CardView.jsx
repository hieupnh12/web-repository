import React from "react";
import { Package, Edit, Info, Trash } from "lucide-react";

const CardView = ({
  products,
  currentPage,
  itemsPerPage,
  brandMap,
  osMap,
  originMap,
  areaMap,
  ramMap,
  romMap,
  colorMap,
  chipsetMap,
  onEdit,
  onDetail,
  onDelete,
}) => {
  const getStockStatus = (quantity) => {
    if (quantity == null || quantity === 0) return { status: "Hết hàng", color: "bg-red-100 text-red-800" };
    if (quantity < 10) return { status: "Sắp hết", color: "bg-yellow-100 text-yellow-800" };
    if (quantity < 20) return { status: "Còn ít", color: "bg-orange-100 text-orange-800" };
    return { status: "Còn nhiều", color: "bg-green-100 text-green-800" };
  };

  const formatPrice = (price) => {
    if (price == null) return "N/A";
    return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => {
        const stockInfo = getStockStatus(product.stockQuantity);

        return (
          <div
            key={product.productId}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-white text-sm font-medium">
                  #{(currentPage - 1) * itemsPerPage + index + 1}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.productName}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Số lượng tồn kho:</span>
                  <span className="text-sm font-semibold text-gray-900">{product.stockQuantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Thương hiệu:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {brandMap?.[product.brandId] || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Hệ điều hành:</span>
                  <span className="text-sm text-gray-900">{osMap?.[product.operatingSystemId] || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Xuất xứ:</span>
                  <span className="text-sm text-gray-900">{originMap?.[product.originId] || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Khu vực kho:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {areaMap?.[product.warehouseAreaId] || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">RAM:</span>
                  <span className="text-sm text-gray-900">{ramMap?.[product.ramId] || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">ROM:</span>
                  <span className="text-sm text-gray-900">{romMap?.[product.romId] || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Màu sắc:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    {colorMap?.[product.colorId] || "N/A"}
                  </span>
                </div>
                {product.chipsetId && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Chipset:</span>
                    <span className="text-sm text-gray-900">{chipsetMap?.[product.chipsetId] || "N/A"}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Bảo hành:</span>
                  <span className="text-sm text-gray-900">{product.warrantyPeriod || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Giá nhập:</span>
                  <span className="text-sm font-semibold text-gray-900">{formatPrice(product.importPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Giá bán:</span>
                  <span className="text-sm font-semibold text-gray-900">{formatPrice(product.exportPrice)}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${stockInfo.color}`}>
                  {stockInfo.status}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => onEdit && onEdit(product)}
                    className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                    title="Sửa"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Sửa</span>
                  </button>
                  <button
                    onClick={() => onDetail && onDetail(product)}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    title="Chi tiết"
                  >
                    <Info className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Chi tiết</span>
                  </button>
                  <button
                    onClick={() => onDelete && onDelete(product)}
                    className="inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    title="Xóa"
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardView;