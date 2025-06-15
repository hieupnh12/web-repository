import React, { useState } from 'react';

export default function AddEmployeeForm() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    gender: 'Nam',
    birth_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const { full_name, email, phone_number, birth_date } = form;
    if (!full_name || !email || !phone_number || !birth_date) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Gọi API thêm nhân viên ở đây
    console.log('Dữ liệu thêm:', form);
    alert('Đã thêm nhân viên thành công!');
  };

  const handleCancel = () => {
    // Reset form hoặc điều hướng trang
    setForm({
      full_name: '',
      email: '',
      phone_number: '',
      gender: 'Nam',
      birth_date: '',
    });
  };

  return (
    <div className="w-[400px] mx-auto mt-10 rounded border shadow-lg bg-white font-sans">
      {/* Header */}
      <div className="bg-blue-600 text-white text-center py-3 rounded-t">
        <h2 className="text-lg font-bold">THÊM NHÂN VIÊN</h2>
      </div>

      {/* Form */}
      <div className="p-4 space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Họ và tên</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập họ tên"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập email"
            type="email"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Số điện thoại</label>
          <input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Giới tính</label>
          <div className="flex gap-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Nam"
                checked={form.gender === 'Nam'}
                onChange={handleChange}
                className="mr-2"
              />
              Nam
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Nữ"
                checked={form.gender === 'Nữ'}
                onChange={handleChange}
                className="mr-2"
              />
              Nữ
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-700">Ngày sinh</label>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Thêm người dùng
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleCancel}
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
}
