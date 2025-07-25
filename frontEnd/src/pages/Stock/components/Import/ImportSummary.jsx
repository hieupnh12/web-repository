import React, { useState } from "react";
import { X } from "@mui/icons-material";
const ImportSummary = ({
  importInfo,
  suppliers,
  dispatch,
  onSubmit,
  chooseSupplier,
  isLoading,
}) => {
  const [customerPopup, setCustomerPopup] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectSupplier, setSelectSupplier] = useState(null);
  const chooseCustomer = () => {
    setCustomerPopup(true);
    chooseSupplier();
  };

  const handleSelectCustomer = (c) => {
    dispatch({ type: "SET_SUPPLIER", payload: `${c.id}` });
    setSelectSupplier(c);
    setCustomerPopup(false);
    setSearchText("");
  };

  return (
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
              value={importInfo?.import_id}
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
              value={importInfo?.staffName}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-2 py-2 bg-gray-100 text-gray-800"
              placeholder="Nhân viên nhập"
            />
          </div>
        </div>

        {/* Chọn khách hàng */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg p-2 border border-green-200">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            Supplier
          </label>
          <div className="flex space-x-2">
            <input
              disabled
              className="w-2/3 border border-gray-300 rounded-lg px-2 py-2 bg-white text-gray-800"
              type="text"
              value={selectSupplier ? selectSupplier.name : ""}
              placeholder="Chưa chọn khách hàng"
            />
            <button
              onClick={chooseCustomer}
              className="w-1/3 border border-gray-300 rounded-lg px-2 py-2 bg-blue-500 text-white"
            >
              Choose
            </button>
          </div>

          {/* Popup chọn khách hàng */}
          {customerPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Supplier</h2>
                  <button
                    onClick={() => setCustomerPopup(false)}
                    className="text-white hover:bg-blue-400 text-xl bg-blue-300 p-2 rounded-[100%]"
                  >
                    <X size={20} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Tìm khách hàng..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
                />
                <div className="max-h-80 overflow-y-auto space-y-1">
                  {suppliers
                    ?.filter((c) =>
                      c.name.toLowerCase().includes(searchText.toLowerCase())
                    )
                    .map((c) => (
                      <div
                        key={c.id}
                        onClick={() => handleSelectCustomer(c)}
                        className="p-3 rounded hover:bg-gray-300 hover:border cursor-pointer border-b border-blue-300"
                      >
                        <div className="font-medium text-blue-600">
                          {c.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          📍 {c.address}
                        </div>
                        <div className="text-sm text-gray-600">
                          📧 {c.email}
                        </div>
                        <div className="text-sm text-gray-600">
                          📞 {c.phone}
                        </div>
                      </div>
                    ))}
                  {suppliers?.filter((c) =>
                    c.name.toLowerCase().includes(searchText.toLowerCase())
                  ).length === 0 && (
                    <div className="text-gray-400 text-sm italic p-2">
                      Không tìm thấy nhà cung cấp nào
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tổng tiền và nút gửi */}
      <div className="mt-auto border border-gray-200 lg:w-2/4 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-br from-white to-gray-50">
        <div className="w-full bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-center">
            <div className="text-sm font-medium text-red-600 mb-1">
              TỔNG TIỀN
            </div>
            <div className="text-2xl font-bold text-red-700">
              {importInfo?.totalAmount?.toLocaleString("vi-VN")}₫
            </div>
          </div>
        </div>
        <button
          className="w-full sm:w-1/3 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-150 text-base font-medium flex justify-center items-center gap-2"
          onClick={onSubmit}
          disabled={isLoading} // Ngăn người dùng bấm nhiều lần
        >
          {isLoading ? (
            <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
            </svg>
            <span>Đang nhập...</span>
            </>
          ) : (
            "Nhập hàng"
          )}
        </button>
      </div>
    </div>
  );
};

export default ImportSummary;
