import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../../../components/ui/Button";
import {
  getAllRoms,
  getAllRams,
  getAllColors,
  createProductVersion,
} from "../../../services/productService";

const FormSelect = ({ label, name, value, onChange, options, getId, getName, error }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
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

const AddProductVersionModal = ({ productId, onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    ramId: "",
    romId: "",
    colorId: "",
    importPrice: "",
    exportPrice: "",
    status: true,
  });

  const [roms, setRoms] = useState([]);
  const [rams, setRams] = useState([]);
  const [colors, setColors] = useState([]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    Promise.all([getAllRoms(), getAllRams(), getAllColors()])
      .then(([romRes, ramRes, colorRes]) => {
        setRoms(romRes?.data || []);
        setRams(ramRes?.data || []);
        setColors(colorRes?.data || []);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu:", err);
        setApiError("Không thể tải dữ liệu thuộc tính sản phẩm.");
      });
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
    if (!formData.romId) newErrors.romId = "Chọn bộ nhớ ROM";
    if (!formData.ramId) newErrors.ramId = "Chọn bộ nhớ RAM";
    if (!formData.colorId) newErrors.colorId = "Chọn màu sắc";
    if (!formData.importPrice) newErrors.importPrice = "Giá nhập là bắt buộc";
    if (!formData.exportPrice) newErrors.exportPrice = "Giá bán là bắt buộc";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        productId,
        romId: Number(formData.romId),
        ramId: Number(formData.ramId),
        colorId: Number(formData.colorId),
        importPrice: Number(formData.importPrice),
        exportPrice: Number(formData.exportPrice),
        status: formData.status,
      };

      const response = await createProductVersion(payload);
      setSuccessMessage("Thêm phiên bản thành công!");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        if (onClose) onClose();
      }, 3000);
    } catch (err) {
      console.error("Lỗi khi tạo phiên bản sản phẩm:", err);
      setApiError("Không thể thêm phiên bản. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="Bộ nhớ ROM"
                  name="romId"
                  value={formData.romId}
                  onChange={handleChange}
                  options={roms}
                  getId={(r) => r.id}
                  getName={(r) => r.name}
                  error={errors.romId}
                />
                <FormSelect
                  label="Bộ nhớ RAM"
                  name="ramId"
                  value={formData.ramId}
                  onChange={handleChange}
                  options={rams}
                  getId={(r) => r.id}
                  getName={(r) => r.name}
                  error={errors.ramId}
                />
                <FormSelect
                  label="Màu sắc"
                  name="colorId"
                  value={formData.colorId}
                  onChange={handleChange}
                  options={colors}
                  getId={(c) => c.id}
                  getName={(c) => c.name}
                  error={errors.colorId}
                />
                <FormInput
                  label="Giá nhập"
                  name="importPrice"
                  value={formData.importPrice}
                  onChange={handleChange}
                  error={errors.importPrice}
                />
                <FormInput
                  label="Giá bán"
                  name="exportPrice"
                  value={formData.exportPrice}
                  onChange={handleChange}
                  error={errors.exportPrice}
                />
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                  <span>Trạng thái hoạt động</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <Button onClick={onClose} type="button" className="bg-gray-500 text-white">
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white"
                  disabled={isSubmitting}
                >
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

export default AddProductVersionModal;
