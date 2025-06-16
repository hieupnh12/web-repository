import React, { useState, useEffect } from 'react';
import { addEmployee, updateEmployee } from '../../api/employeeApi';

export default function StaffForm({ onClose, employee }) {
  const [form, setForm] = useState({
    staff_id: '',
    full_name: '',
    gender: 'Male',
    phone_number: '',
    email: '',
    status: 1
  });

  useEffect(() => {
    if (employee) {
      setForm({
        staff_id: employee.staff_id,
        full_name: employee.full_name || '',
        gender: employee.gender || 'Male',
        phone_number: employee.phone_number || '',
        email: employee.email || '',
        status: employee.status ?? 1
      });
    }
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employee) {
        await updateEmployee(employee.staff_id, form);
      } else {
        await addEmployee(form);
      }
      onClose();
    } catch (error) {
      console.error('❌ Failed to save employee:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded w-full max-w-md shadow">
        <h3 className="text-xl font-bold mb-4">{employee ? 'Update' : 'Add'} Employee</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          {!employee && (
            <input
              name="staff_id"
              value={form.staff_id}
              onChange={handleChange}
              placeholder="Staff ID"
              className="border p-2 w-full"
              required
            />
          )}
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 w-full"
            required
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            className="border p-2 w-full"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 w-full"
            required
          />

          <div className="flex justify-end gap-2 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
            <button type="button" onClick={onClose} className="text-red-500 px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
