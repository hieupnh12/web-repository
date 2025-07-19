import React from 'react';

const TableSkeletonLoader = () => {
  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-gray-700 border border-gray-200">
        <thead className="bg-gray-50 text-xs font-medium uppercase text-center">
          <tr>
            <th className="px-4 py-2">STT</th>
                    <th className="px-4 py-2">Mã Phiếu</th>
                    <th className="px-4 py-2">Khách Hàng</th>
                    <th className="px-4 py-2">Nhân Viên Nhập</th>
                    <th className="px-4 py-2">Tổng Tiền</th>
                    <th className="px-4 py-2">Thời gian</th>
          </tr>
        </thead>
        <tbody className="divide-y text-center divide-gray-300 text-sm cursor-pointer">
          {[...Array(12)].map((_, index) => (
  <tr key={index} className="animate-pulse">
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded w-6 mx-auto"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded w-40 mx-auto"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
    </td>
    <td className="px-4 py-3">
      <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
    </td>
  </tr>
))}
        </tbody>
      </table>
    </div>
  );
};

export default TableSkeletonLoader;