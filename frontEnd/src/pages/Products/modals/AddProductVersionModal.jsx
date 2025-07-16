import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../../components/ui/Button";
import {
  getAllROMs,
  getAllRAMs,
  getAllColors,
} from "../../../services/attributeService";
import { createProductVersion } from "../../../services/productVersionService";

const AddProductVersionModal = ({ productId, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    romId: "",
    ramId: "",
    colorId: "",
    importPrice: "",
    exportPrice: "",
    status: true,
  });

  const [roms, setRoms] = useState([]);
  const [rams, setRams] = useState([]);
  const [colors, setColors] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  Promise.all([getAllROMs(), getAllRAMs(), getAllColors()])
    .then(([romsData, ramsData, colorsData]) => {
      setRoms(romsData);
      setRams(ramsData);
      setColors(colorsData);
    })
    .catch(() => setApiError("Không thể tải dữ liệu thuộc tính sản phẩm."));
}, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.romId) newErrors.romId = "Chọn ROM";
    if (!formData.ramId) newErrors.ramId = "Chọn RAM";
    if (!formData.colorId) newErrors.colorId = "Chọn màu";
    if (!formData.importPrice) newErrors.importPrice = "Nhập giá nhập";
    if (!formData.exportPrice) newErrors.exportPrice = "Nhập giá bán";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await createProductVersion({
        productId,
        romId: Number(formData.romId),
        ramId: Number(formData.ramId),
        colorId: Number(formData.colorId),
        importPrice: Number(formData.importPrice),
        exportPrice: Number(formData.exportPrice),
        status: formData.status,
      });
      setSuccessMessage("Tạo phiên bản thành công");
      if (onSuccess) onSuccess();
      setTimeout(() => onClose && onClose(), 3000);
    } catch (err) {
      setApiError("Không thể tạo phiên bản. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSelect = (label, name, value, options, getId, getName, error) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">-- Chọn --</option>
        {options.map((opt) => (
          <option key={getId(opt)} value={getId(opt)}>
            {getName(opt)}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment}>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <Dialog.Title className="text-xl font-semibold text-gray-800 mb-4">
              Thêm phiên bản sản phẩm
            </Dialog.Title>

            {apiError && <p className="text-red-500 mb-3">{apiError}</p>}
            {successMessage && <p className="text-green-600 mb-3">{successMessage}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelect("ROM", "romId", formData.romId, roms, (r) => r.rom_id, (r) => r.rom_size, errors.romId)}
                {renderSelect("RAM", "ramId", formData.ramId, rams, (r) => r.id, (r) => r.name, errors.ramId)}
                {renderSelect("Màu sắc", "colorId", formData.colorId, colors, (c) => c.id, (c) => c.name, errors.colorId)}
                <FormInput label="Giá nhập" name="importPrice" value={formData.importPrice} onChange={handleChange} error={errors.importPrice} />
                <FormInput label="Giá bán" name="exportPrice" value={formData.exportPrice} onChange={handleChange} error={errors.exportPrice} />
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
                <span className="ml-2">Trạng thái hoạt động</span>
              </div>
              <div className="flex justify-end gap-3 pt-6">
                <Button onClick={onClose} type="button" className="bg-gray-500 text-white">Hủy</Button>
                <Button type="submit" className="bg-blue-600 text-white" disabled={isSubmitting}>
                  {isSubmitting ? "Đang lưu..." : "Lưu phiên bản"}
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

const FormInput = ({ label, name, value, onChange, error, type = "number" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring ${
        error ? "border-red-500" : "border-gray-300"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default AddProductVersionModal;