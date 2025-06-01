import React, { useState } from "react";
import { deleteStaff, updateStaff } from "../../../services/authService";

export default function StaffList({ staffList, onStaffCreated }) {
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    gender: 1,
    phoneNumber: "",
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá nhân viên này?")) return;
    try {
      await deleteStaff(id);
      onStaffCreated();
    } catch (error) {
      console.error("Xoá thất bại:", error);
    }
  };

  const openEditPopup = (staff) => {
    setEditingStaff(staff);
    setFormData({
      fullName: staff.fullName || "",
      email: staff.email || "",
      gender: staff.gender || 1,
      phoneNumber: staff.phoneNumber || "",
    });
  };

  const closePopup = () => {
    setEditingStaff(null);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    console.log(editingStaff.staffId);

    try {
      await updateStaff(editingStaff.staffId, formData);
      onStaffCreated();
      closePopup();
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Danh sách nhân viên
      </h2>

      {staffList.map((staff) => (
        <div
          key={staff.staffId}
          className="bg-white p-4 rounded-lg shadow-md space-y-2"
        >
          <div className="flex justify-between">
            <span className="text-gray-600">Họ tên:</span>
            <span className="font-medium text-gray-900">
              {staff.fullName || "Chưa có"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-900">{staff.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Giới tính:</span>
            <span className="font-medium text-gray-900">
              {staff.gender === 1 ? "Nam" : "Nữ"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">SĐT:</span>
            <span className="font-medium text-gray-900">
              {staff.phoneNumber || "Chưa có"}
            </span>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => openEditPopup(staff)}
              className="mt-2 px-4 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
            >
              Sửa
            </button>
            <button
              onClick={() => handleDelete(staff.staffId)}
              className="mt-2 px-4 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Xoá
            </button>
          </div>
        </div>
      ))}

      {/* POPUP FORM CẬP NHẬT */}
      {editingStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] space-y-4">
            <h3 className="text-xl font-semibold text-center">
              Cập nhật nhân viên
            </h3>
            <input
              type="text"
              name="fullName"
              placeholder="Họ tên"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value={1}>Nam</option>
              <option value={0}>Nữ</option>
            </select>
            <input
              type="text"
              name="phoneNumber"
              placeholder="SĐT"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
              >
                Lưu
              </button>
              <button
                onClick={closePopup}
                className="px-4 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
