import React, { useState, useEffect } from 'react';
import { editStaff } from '../../services/staffService';
import { X, User } from 'lucide-react';

const EditStaff = ({ staff, onClose, onSave }) => {
  const [form, setForm] = useState({
    fullName: '',
    gender: '',
    phoneNumber: '',
    email: '',
    status: '1',
    birthDate: '',
  });

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
        staffId: staff.staffId,
        fullName: form.fullName,
        gender: form.gender === 'Nam',
        phoneNumber: form.phoneNumber,
        email: form.email,
        birthDate: form.birthDate.split('-').reverse().join('-'),
        status: parseInt(form.status),
      };
      await onSave?.(formattedForm);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  if (!staff) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-3xl h-[85%] overflow-y-auto shadow-2xl relative">
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white p-6 relative">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <User />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Edit Staff</h2>
              <p className="text-sm opacity-90">Update staff details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <input name="fullName" value={form.fullName} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          <div className="grid grid-cols-2 gap-4">
            <select name="gender" value={form.gender} onChange={handleChange} className="p-3 border rounded-lg" required>
              <option value="">Select Gender</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} className="p-3 border rounded-lg" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="p-3 border rounded-lg" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} className="p-3 border rounded-lg" required />
          </div>
          <select name="status" value={form.status} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;
