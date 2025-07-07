import { forwardRef, useImperativeHandle, useRef } from "react";
import { useEffect, useState } from "react";
import BarcodeScanner from "../../../../utils/useImeiCam";

const ProductForm = ({ selected, onAdd, editProduct, usedImeis, setEditProduct, setImei }) => {
    const formData = "";
   const handleOptionChange = "";
  const setIsModalOpen= "";
  const setShowScanner = "";
   const isModalOpen = "";
  const handleImeiChange = "";
    return (
      <div className="md:w-1/2 space-y-4">
        {/* <BarcodeScanner
          open={showScanner}
          onResult={setItemScan}
          onClose={() => {
            setShowScanner(false);
          }}
        /> */}
        <div className="bg-white rounded shadow h-[350px] p-2">
          <div className="container mx-auto p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Mã SP
                </label>
                <input
                  type="text"
                  name="maSP"
                  value={formData?.idProduct}
                  className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
                  readOnly
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  name="tenSanPham"
                  value={formData?.nameProduct}
                  className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giá xuất
                </label>
                <input
                  type="text"
                  name="giaXuat"
                  readOnly
                  value={formData?.exportPrice}
                  className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cấu hình
                </label>
                <select
                  value={formData?.selectedOption?.idProductVersion || ""}
                  onChange={handleOptionChange}
                  className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
                >
                  <option value="">Chọn cấu hình</option>
                  {selected?.options?.map((option) => (
                    <option
                      key={option.idProductVersion}
                      value={option.idProductVersion}
                    >
                      {`${option.color} - ${option.ram} - ${option.rom}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid col-span-3">
                <div className="flex gap-4 items-center">
                  <label className="block text-sm font-medium text-gray-700 py-2">
                    Số lượng tồn:
                  </label>
                  <input
                    type="text"
                    name="soLuongTon"
                    readOnly
                    value={formData?.selectedOption?.imeiList?.length || 0}
                    className=" block border border-gray-700 rounded-md shadow-sm p-1 w-1/4"
                  />
                </div>
              </div>
              <div className="col-span-3">
                <div className="flex items-center justify-between space-x-4 mb-2 gap-4">
                  <label className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                    Mã IMEI:
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 sm:w-auto"
                      disabled={!formData.selectedOption}
                    >
                      Chọn IMEI
                    </button>
                    <button
                      onClick={() => {
                        setShowScanner(true); // ✅ MỞ scanner lại
                      }}
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 w-fit"
                    >
                      Quét IMEI
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <textarea
                    value={(formData?.selectedImeis ?? []).join("\n")}
                    readOnly
                    className="mt-1 p-2 block w-full border-gray-700 rounded-md shadow-sm p-1 border h-24 resize-none"
                    placeholder="Danh sách IMEI đã chọn..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal chọn IMEI */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 w-96 max-h-[80vh] overflow-y-auto">
              <h2 className="text-lg font-medium mb-4">Chọn IMEI</h2>
              <div className="space-y-2">
                {formData.selectedOption?.imeiList
                  ?.filter((item) => item.status === "in-stock")
                  .map((item) => (
                    <div key={item.imei} className="flex items-center">
                      <input
                        id={`imei-${item.imei}`}
                        type="checkbox"
                        checked={formData?.selectedImeis.includes(item.imei)}
                        onChange={() => handleImeiChange(item.imei)}
                        className="mr-2"
                      />
                      <label htmlFor={`imei-${item.imei}`}>
                        {item.imei} ({item.status})
                      </label>
                    </div>
                  ))}
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


export default ProductForm;
