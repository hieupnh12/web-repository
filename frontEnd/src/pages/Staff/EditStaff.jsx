import React, { useState, useEffect } from 'react';
import { editStaff } from '../../services/staffService';
import { useNavigate } from 'react-router-dom';

const EditStaff = ({ staff, onClose, onSave }) => {
  const [form, setForm] = useState({
    fullName: '',
    gender: '',
    phoneNumber: '',
    email: '',
    status: '1',
    birthDate: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (staff) {
      setForm({
        fullName: staff.fullName || '',
        gender: staff.gender === true || staff.gender === '1' ? 'Nam' : 'Nữ',
        phoneNumber: staff.phoneNumber || '',
        email: staff.email || '',
        status: staff.status === 1 || staff.status === '1' ? '1' : '0',
        birthDate: staff.birthDate?.split('-').reverse().join('-') || '',
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedForm = {
        staffId: staff.staffId, // Include staffId to identify the record to update
        fullName: form.fullName,
        gender: form.gender === 'Nam' ? true : false,
        phoneNumber: form.phoneNumber,
        email: form.email,
        birthDate: form.birthDate.split('-').reverse().join('-'),
        status: parseInt(form.status),
      };

      await editStaff(staff.staffId, formattedForm);
      alert('Cập nhật nhân viên thành công!');
      await onSave?.(formattedForm);
      onClose();
      navigate('/manager/staff');
    } catch (err) {
      console.error('Lỗi khi cập nhật nhân viên:', err);
      alert('Đã xảy ra lỗi khi cập nhật nhân viên.');
    }
  };

  const handleClose = () => {
    onClose();
    setForm({
      fullName: '',
      gender: '',
      phoneNumber: '',
      email: '',
      status: '1',
      birthDate: '',
    });
  };

  if (!staff) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Staff</h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            name="fullName"
            placeholder="Full Name"
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
            <option value="">Select Gender</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <input
            name="phoneNumber"
            placeholder="Phone Number"
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
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            required
          >
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;