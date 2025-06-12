import React from 'react';
import { Package } from 'lucide-react';

const CardView = ({ products, currentPage, itemsPerPage }) => {
  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'Hết hàng', color: 'bg-red-100 text-red-800' };
    if (quantity < 10) return { status: 'Sắp hết', color: 'bg-yellow-100 text-yellow-800' };
    if (quantity < 20) return { status: 'Còn ít', color: 'bg-orange-100 text-orange-800' };
    return { status: 'Còn nhiều', color: 'bg-green-100 text-green-800' };
  };
  

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => {
        const stockInfo = getStockStatus(product.stockQuantity);
        return (
          <div
            key={product.idProduct}
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.nameProduct}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Số lượng:</span>
                  <span className="text-sm font-semibold text-gray-900">{product.stockQuantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Thương hiệu:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.brandName || product.brand || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Hệ điều hành:</span>
                  <span className="text-sm text-gray-900">{product.os || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Xuất xứ:</span>
                  <span className="text-sm text-gray-900">{product.origin || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Khu vực:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {product.warehouseArea || product.area || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${stockInfo.color}`}>
                  {stockInfo.status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardView;