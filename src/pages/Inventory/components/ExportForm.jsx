import React from "react";
import { Link } from 'react-router-dom';

export default function ExportForm({
  tableData,
  supplierDetails,
  filter,
  onFilterChange,
  onReload,
  currentPage,
  totalPages,
  onPageChange,
}) {
  // Xử lý thay đổi bộ lọc
  const handleSupplierChange = (e) => {
    onFilterChange({ ...filter, supplier: e.target.value });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ ...filter, searchQuery: e.target.value });
  };

  return (
    <main className="flex-1 bg-[#EFF6FF] rounded-2xl">
      {/* Thanh chức năng */}
      <div className="flex items-center justify-between bg-white/60 p-4 rounded-2xl shadow-sm flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Link
            to="/addexport"
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium"
          >
            Add Patient
          </Link>

          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
            onClick={() => {
              // TODO: Viết logic export Excel tại đây
              console.log("Export Excel clicked");
            }}
          >
            Export Excel
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter.supplier}
            onChange={handleSupplierChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">All</option>
            <option value="supplier1">Nhà cung cấp A</option>
            <option value="supplier2">Nhà cung cấp B</option>
            <option value="supplier3">Nhà cung cấp C</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={filter.searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
          <button
            onClick={onReload}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Reload
          </button>
        </div>
      </div>

      {/* Standings và thống kê */}
      <div className="container mx-auto">
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl shadow w-full max-w-screen-xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Chi tiết nhà cung cấp */}
            <div className="w-full md:w-1/4 bg-white shadow-sm h-[500px] overflow-y-auto bg-gray-100 p-4 rounded-xl text-sm text-gray-700 flex flex-col justify-between custom-scrollbar">
              <div className="space-y-4">
                <div className="p-2 rounded-lg shadow-sm">
                  <div className="block mb-1 font-semibold">
                    Suppliers: {supplierDetails.supplier}
                  </div>
                  <span id="detail-supplier">{supplierDetails.supplier}</span>
                </div>
                <div className="p-2 rounded-lg shadow-sm">
                  <label className="block mb-1 font-semibold">
                    Input by staff
                  </label>
                  <span id="detail-inputby">{supplierDetails.inputBy}</span>
                </div>
                <div className="p-2 rounded-lg shadow-sm">
                  <label className="block mb-1 font-semibold">
                    Time <span id="detail-from">{supplierDetails.time}</span>
                  </label>
                </div>
                <div className="p-2 rounded-lg shadow-sm">
                  <label className="block mb-1 font-semibold">
                    Quantity{" "}
                    <span id="detail-to">{supplierDetails.quantity}</span>
                  </label>
                </div>
                <div className="p-2 rounded-lg shadow-sm">
                  <label className="block mb-1 font-semibold">
                    Price Total{" "}
                    <span id="detail-from-money">
                      {supplierDetails.priceTotal}
                    </span>
                  </label>
                </div>
                <div className="p-2 rounded-lg shadow-sm">
                  <label className="block mb-1 font-semibold">
                    Description
                  </label>
                  <span id="detail-to-money">
                    {supplierDetails.description}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200">
                  Cancel receipt
                </button>
              </div>
            </div>

            {/* Dòng phân cách */}
            <div className="hidden md:block w-px bg-gray-300"></div>

            {/* Bảng và phân trang */}
            <div className="flex-1 bg-white py-4 px-4 rounded-2xl overflow-x-auto">
              <table className="w-full text-sm text-gray-700">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="px-4 py-2">STT</th>
                    <th className="px-4 py-2">Code</th>
                    <th className="px-4 py-2">Suppliers</th>
                    <th className="px-4 py-2">Input By Staff</th>
                    <th className="px-4 py-2">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tableData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {(currentPage - 1) * 5 + index + 1}
                      </td>
                      <td className="px-4 py-2 font-bold">{item.code}</td>
                      <td className="px-4 py-2">{item.supplier}</td>
                      <td className="px-4 py-2">{item.inputBy}</td>
                      <td className="px-4 py-2">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="mt-4 flex justify-center space-x-2 text-sm text-gray-600">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  « Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-1 rounded-lg ${
                        page === currentPage
                          ? "bg-teal-500 text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Sau »
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
