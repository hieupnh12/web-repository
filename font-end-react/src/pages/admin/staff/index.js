import React, { useState } from "react";
import { createStaff } from "../../../services/authService";
import { notification } from "antd";
import StaffList from "./showStaff";

export default function Staff() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Vui lòng nhập tên";
    if (!formData.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Email không hợp lệ";
    if (formData.gender !== "1" && formData.gender !== "0")
      errs.gender = "Chọn giới tính";
    if (!formData.phoneNumber.trim())
      errs.phoneNumber = "Vui lòng nhập số điện thoại";
    else if (!/^0\d{9,10}$/.test(formData.phoneNumber))
      errs.phoneNumber = "Số điện thoại không hợp lệ";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const res = await createStaff(formData);
        if (res.status === 200 || res.status === 201) {
          notification.success({
            message: "Thêm nhân viên thành công!",
          });
          console.log("Successfully created staff");
        } else {
          console.error("Tạo nhân viên thất bại:", res);
        }
      } catch (error) {
        console.error("Lỗi khi gửi:", error);
      }
    }
  };

  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-green-100 px-4">
      
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl space-y-6 transform transition-all duration-500 hover:scale-[1.01]"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Tạo nhân viên mới
        </h2>

        {/* Họ tên */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Họ tên</label>
          <input
            type="text"
            name="fullName"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Giới tính */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Giới tính
          </label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="1"
                checked={formData.gender === "1"}
                onChange={handleChange}
                className="mr-2"
              />
              Nam
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="0"
                checked={formData.gender === "0"}
                onChange={handleChange}
                className="mr-2"
              />
              Nữ
            </label>
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
          )}
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            type="text"
            name="phoneNumber"
            className="w-full border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          Thêm nhân viên
        </button>
      </form>

      
    </div>
    <div className="bg-gray-100 min-h-screen p-4">
        <StaffList />
      </div>
    </>
  );
}
