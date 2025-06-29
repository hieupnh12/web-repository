import React, { useState, useEffect, useCallback } from "react";
import {
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  X,
} from "@mui/icons-material";
import AddressSelector from "./AddressSelector";

const SupplierDialog = ({ open, onClose, onSubmit, editData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
          name: "",
          email: "",
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

    if (!formData.name.trim()) {
      newErrors.name = "Supplier name is required";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^[\d\s()+-]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
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
                {isEditMode ? "Edit Supplier" : "Add New Supplier"}
              </h2>
              <p className="text-sm opacity-90">
                {isEditMode
                  ? "Update supplier information"
                  : "Fill in all required fields to add a new supplier"}
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
            {/* Supplier Name */}
            <div>
              <div className="flex items-center mb-2">
                <BusinessIcon className="text-blue-600 mr-2" size={20} />
                <span className="text-sm text-gray-600">Basic Information</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Supplier name *"
                  className={`w-full p-3 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <EmailIcon className="text-blue-600 mr-2" size={20} />
                  <span className="text-sm text-gray-600">Contact Email</span>
                </div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className={`w-full p-3 border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <PhoneIcon className="text-blue-600 mr-2" size={20} />
                  <span className="text-sm text-gray-600">Phone Number</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className={`w-full p-3 border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center mb-2">
                <LocationIcon className="text-blue-600 mr-2" size={20} />
                <span className="text-sm text-gray-600">Address</span>
              </div>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
                rows={1}
              />
            </div>

            {/* Address Selector */}
            <div>
              <hr className="my-4 border-gray-200" />
              <AddressSelector onChange={handleAddressChange} />
            </div>

            {/* Status */}
            <div
              className={`p-4 rounded-lg border ${
                formData.status
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold">Active Status</h3>
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={handleStatusChange}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm">
                      {formData.status ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>
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
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-8 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-500 transition"
          >
            {isEditMode ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplierDialog;
