import React, { useState, useEffect, useCallback } from "react";
import {
  Add as AddIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  X,
} from "@mui/icons-material";
import AddressSelector from "./AddressSelector";

const CustomerDialog = ({ open, onClose, onSubmit, editData = null }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    status: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (editData) {
        setFormData(editData);
      } else {
        setFormData({
          customerName: "",
          phone: "",
          address: "",
          status: true,
        });
      }
      setErrors({});
    }
  }, [open, editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({ ...prev, status: e.target.checked }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Tên khách hàng là bắt buộc";
    }

    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^((\+84)|0)(3|5|7|8|9)\d{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (theo định dạng Việt Nam)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onClose();
      onSubmit(formData);
    }
  };

  const handleAddressChange = useCallback((addr) => {
    setFormData((prev) => ({
      ...prev,
      address: `${addr.ward}, ${addr.district}, ${addr.province}`,
    }));
  }, []);

  const isEditMode = !!editData;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl h-[85%] overflow-y-auto custom-scroll">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-6 relative">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <AddIcon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {isEditMode ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
              </h2>
              <p className="text-sm opacity-90">
                {isEditMode
                  ? "Cập nhật thông tin khách hàng"
                  : "Điền đầy đủ các trường bắt buộc để thêm khách hàng mới"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Tên khách hàng */}
            <div>
              <div className="flex items-center mb-2">
                <PersonIcon className="text-blue-600 mr-2" size={20} />
                <span className="text-sm text-gray-600">Thông tin cơ bản</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Tên khách hàng *"
                  className={`w-full p-3 border ${
                    errors.customerName ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  required
                />
                {errors.customerName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.customerName}
                  </p>
                )}
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <PhoneIcon className="text-blue-600 mr-2" size={20} />
                  <span className="text-sm text-gray-600">Số điện thoại</span>
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  className={`w-full p-3 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Địa chỉ */}
            <div>
              <div className="flex items-center mb-2">
                <LocationIcon className="text-blue-600 mr-2" size={20} />
                <span className="text-sm text-gray-600">Địa chỉ</span>
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Địa chỉ đầy đủ"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                rows={1}
                
              />
            </div>

            {/* Bộ chọn địa chỉ */}
            <div>
              <hr className="my-4 border-gray-200" />
              <AddressSelector onChange={handleAddressChange} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <hr className="border-gray-200" />
        <div className="p-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-500 transition"
          >
            {isEditMode ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDialog;
