// pages/admin/staff/StaffList.js
import React from "react";

export default function StaffList({ staffList }) {
  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Danh sách nhân viên
      </h2>

      {Array.isArray(staffList) &&
        staffList.map((staff) => (
          <div
            key={staff.staffId}
            className="bg-white p-4 rounded-lg shadow-md"
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
          </div>
        ))}
    </div>
  );
}
