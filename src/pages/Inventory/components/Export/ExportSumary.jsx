import React from "react";

const ExportSummary = ({ code, user, supplier, total, onSubmit }) => (
  <div className="flex flex-col lg:flex-row justify-between h-full space-y-6 text-sm sm:text-sm">
    {/* Form Inputs */}
    <div className="space-y-4 lg:w-2/4 px-2">
      <div className="flex space-x-4">
        <div className="w-1/2">
          <label className="block font-medium text-gray-700 mb-1">
            Mã phiếu nhập
          </label>
          <input
            type="text"
            value={code}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-2 py-2 bg-gray-100 text-gray-800"
            placeholder="Mã phiếu nhập"
          />
        </div>
        <div className="w-1/2">
          <label className="block font-medium text-gray-700 mb-1">
            Nhân viên nhập
          </label>
          <input
            type="text"
            value={user.name}
            readOnly
            className="w-full border border-gray-300 rounded-lg px-2 py-2 bg-gray-100 text-gray-800"
            placeholder="Nhân viên nhập"
          />
        </div>
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-1">
          Khách hàng
        </label>
        <select className="w-full border border-gray-300 rounded-lg px-1 py-2 bg-white text-gray-800">
          {supplier.map((s) => (
            <option key={s.id}>{s.name}</option>
          ))}
        </select>
      </div>
    </div>

    {/* Total and Submit Button - Always at the bottom */}
<div className="mt-auto border border-gray-200 lg:w-2/4 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
  <div className="text-center text-base sm:text-lg font-semibold text-red-600">
    TỔNG TIỀN: <span className="text-gray-600">{total.toLocaleString("vi-VN")}₫</span>
  </div>
  <button
    className="w-full sm:w-1/3 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-150 text-base font-medium"
    onClick={onSubmit}
  >
    Nhập hàng
  </button>
</div>
  </div>
);

export default ExportSummary;
