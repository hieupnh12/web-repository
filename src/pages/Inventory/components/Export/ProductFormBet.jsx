import { useState } from "react";

const ProductForm = () => {
  // TODO: state cho mã SP, giá, cấu hình, ...
  const [formData, setFormData] = useState({
    maSP: "11",
    tenSanPham: "Realme 10",
    cauHinh: "256GB - 8GB ...",
    giaXuat: "640000",
    soLuongTon: "0",
    maImei: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChooseImei = () => {
    // Placeholder for choosing IMEI logic
    alert("Chọn IMEI functionality to be implemented");
  };

  const handleUpdateImei = () => {
    // Placeholder for updating IMEI logic
    alert("Cập nhật IMEI functionality to be implemented");
  };
  return (
    <div className="md:w-1/2 space-y-4">
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
                value={formData.maSP}
                onChange={handleChange}
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
                value={formData.tenSanPham}
                onChange={handleChange}
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
                value={formData.giaXuat}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Cấu hình
              </label>
              <select
                name="cauHinh"
                value={formData.cauHinh}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-700 rounded-md shadow-sm p-1 border"
              >
                <option>256GB - 8GB ...</option>
                {/* Add more options as needed */}
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
                    onClick={handleChooseImei}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 sm:w-auto"
                  >
                    Chọn IMEI
                  </button>
                  <button
                    onClick={handleUpdateImei}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 w-fit"
                  >
                    Quét IMEI
                  </button>
                </div>
              </div>
              <div className="mt-1">
                <textarea
                  name="maImei"
                  value={formData.maImei}
                  onChange={handleChange}
                  className="w-full h-24 border border-gray-300 rounded-md shadow-sm resize-none p-3"
                  placeholder="Nhập mã IMEI..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
