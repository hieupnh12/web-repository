import React, { useState } from 'react';
import { addEmployee } from '../../api/employeeApi';
import { useNavigate } from 'react-router-dom';

const CreateStaff = () => {
  const [form, setForm] = useState({
    staffId: '',
    fullName: '',
    gender: '',
    phoneNumber: '',
    email: '',
    status: 1,
    birthDate: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Chuyển đổi birthDate từ YYYY-MM-DD sang DD-MM-YYYY nếu API yêu cầu
      const formattedForm = {
        ...form,
        birthDate: form.birthDate.split('-').reverse().join('-'), // Chuyển từ YYYY-MM-DD sang DD-MM-YYYY
        gender: form.gender === 'Nam' ? true : false, // Ánh xạ Nam=true, Nữ=false
      };
      await addEmployee(formattedForm);
      alert('Thêm nhân viên thành công!');
      // navigate('/manager/staff');
    } catch (err) {
      console.error('Lỗi khi thêm nhân viên:', err);
      alert('Đã xảy ra lỗi khi thêm nhân viên.');
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">Thêm nhân viên</h2>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            name="staffId"
            placeholder="Mã nhân viên"
            value={form.staffId}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />

          <input
            name="fullName"
            placeholder="Họ và tên"
            value={form.fullName}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />

          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>

          <input
            name="phoneNumber"
            placeholder="Số điện thoại"
            value={form.phoneNumber}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />

          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />

          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          />

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Thêm
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStaff;