import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../../components/ui/Button";

const EditProductModal = ({ product, onClose, onSave }) => {
  const [editedProduct, setEditedProduct] = useState({
    origin: null,
    processor: "",
    battery: 0,
    screenSize: 0.0,
    operatingSystem: null,
    chipset: null,
    rearCamera: "",
    frontCamera: "",
    warrantyPeriod: 0,
    brand: null,
    warehouseArea: null,
    stockQuantity: 0,
    status: true,
    image: null,
    imagePreview: "",
  });

  useEffect(() => {
    if (product) {
      setEditedProduct({
        ...product,
        image: null,
        imagePreview: product.image || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedProduct((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSave = () => {
    if (onSave) onSave(editedProduct);
  };

  if (!product) return null;

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-2xl font-bold text-gray-800 mb-4">
              Chỉnh sửa sản phẩm
            </Dialog.Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Xuất xứ (origin)", name: "origin" },
                { label: "Vi xử lý (processor)", name: "processor" },
                { label: "Pin (battery)", name: "battery", type: "number" },
                { label: "Kích thước màn hình (screenSize)", name: "screenSize", type: "number" },
                { label: "Hệ điều hành (operatingSystem)", name: "operatingSystem" },
                { label: "Chipset", name: "chipset" },
                { label: "Camera sau", name: "rearCamera" },
                { label: "Camera trước", name: "frontCamera" },
                { label: "Thời gian bảo hành (tháng)", name: "warrantyPeriod", type: "number" },
                { label: "Thương hiệu (brand)", name: "brand" },
                { label: "Khu vực kho (warehouseArea)", name: "warehouseArea" },
                { label: "Số lượng tồn kho", name: "stockQuantity", type: "number" },
              ].map(({ label, name, type = "text" }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={editedProduct[name] || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="status"
                    checked={editedProduct.status}
                    onChange={handleChange}
                  />
                  <span>{editedProduct.status ? "Hoạt động" : "Không hoạt động"}</span>
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh sản phẩm</label>
              <div className="flex items-center space-x-6">
                {editedProduct.imagePreview ? (
                  <img src={editedProduct.imagePreview} alt="Ảnh" className="w-32 h-32 object-contain rounded-lg border" />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 flex items-center justify-center rounded-lg border text-gray-400">
                    Chưa có ảnh
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <Button onClick={onClose} className="bg-gray-500 text-white">Hủy</Button>
              <Button onClick={handleSave} className="bg-blue-600 text-white">Lưu thay đổi</Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditProductModal;
