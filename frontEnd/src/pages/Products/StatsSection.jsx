import React from 'react';
import { Package } from 'lucide-react';

const StatsSection = ({ products }) => {
  const totalProducts = products.length;
  const inStock = products.filter((p) => p.stockQuantity >= 20).length;
  const lowStock = products.filter((p) => p.stockQuantity < 10 && p.stockQuantity > 0).length;
  const outOfStock = products.filter((p) => p.stockQuantity === 0).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
            <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-green-600 rounded-full"></div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Còn nhiều</p>
            <p className="text-2xl font-bold text-green-600">{inStock}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-yellow-600 rounded-full"></div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Sắp hết</p>
            <p className="text-2xl font-bold text-yellow-600">{lowStock}</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 bg-red-600 rounded-full"></div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Hết hàng</p>
            <p className="text-2xl font-bold text-red-600">{outOfStock}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;