import React, { useState } from "react";

const ExportSummary = ({
  code,
  user,
  total,
  customer,
  customers,
  onCustomerChange,
  onSubmit,
  isLoading,
}) => {
  const [customerPopup, setCustomerPopup] = useState(false);
  const [searchText, setSearchText] = useState("");

  const chooseCustomer = () => setCustomerPopup(true);

  const handleSelectCustomer = (c) => {
    onCustomerChange(c); // cập nhật lên component cha
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
              value={user}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-2 py-2 bg-gray-100 text-gray-800"
              placeholder="Nhân viên nhập"
            />
          </div>
        </div>

        {/* Chọn khách hàng */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Khách hàng
          </label>
          <div className="flex space-x-2">
            <input
              disabled
              className="w-2/3 border border-gray-300 rounded-lg px-2 py-2 bg-white text-gray-800"
              type="text"
              value={customer ? customer.customerName : ""}
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
            <div className="fixed inset-0 z-50 flex  items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold">Chọn khách hàng</h2>
                  <button
                    onClick={() => setCustomerPopup(false)}
                    className="text-gray-500 hover:text-red-500 text-xl"
                  >
                    ×
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Tìm khách hàng..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full mb-3 px-3 py-2 border border-gray-300 rounded"
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {customers
                    ?.filter((c) => {
                      const search = searchText.toLowerCase();
                      return (
                        c.customerName.toLowerCase().includes(search) ||
                        c.address.toLowerCase().includes(search) ||
                        c.phone.toLowerCase().includes(search)
                      );
                    })
                    .map((c) => (
                      <div
                        key={c.customerId}
                        onClick={() => handleSelectCustomer(c)}
                        className="p-3 rounded hover:bg-gray-100 cursor-pointer border border-gray-200 bg-gray-50"
                      >
                        <div className="font-semibold text-blue-700">
                          {c.customerName}
                        </div>
                        <div className="text-sm text-gray-700">
                          <div>
                            <strong>Địa chỉ:</strong> {c.address}
                          </div>
                          <div>
                            <strong>SĐT:</strong> {c.phone}
                          </div>
                          <div>
                            <strong>Tham gia:</strong>{" "}
                            {new Date(c.joinDate).toLocaleDateString("vi-VN")}
                          </div>
                          <div>
                            <strong>Trạng thái:</strong>{" "}
                            <span
                              className={
                                c.status ? "text-green-600" : "text-red-500"
                              }
                            >
                              {c.status ? "Hoạt động" : "Ngưng hoạt động"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  {customers?.filter((c) => {
                    const search = searchText.toLowerCase();
                    return (
                      c.customerName.toLowerCase().includes(search) ||
                      c.address.toLowerCase().includes(search) ||
                      c.phone.toLowerCase().includes(search)
                    );
                  }).length === 0 && (
                    <div className="text-gray-400 text-sm italic">
                      Không tìm thấy
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tổng tiền và nút gửi */}
      <div className="mt-auto border border-gray-200 lg:w-2/4 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center text-base sm:text-lg font-semibold text-red-600">
          TỔNG TIỀN:{" "}
          <span className="text-gray-600">
            {total.toLocaleString("vi-VN")}₫
          </span>
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
              <span>Đang xuất...</span>
            </>
          ) : (
            "Xuất hàng"
          )}
        </button>
      </div>
    </div>
  );
};

export default ExportSummary;
