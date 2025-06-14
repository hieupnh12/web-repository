import React, { useEffect, useState } from 'react';
import Accdetails from './AccountDetails';
import { createAccount, updateAccount } from '../../api/accountApi';

export default function CreateAcc({ onClose, onSave, account }) {
  const [form, setForm] = useState({
    staffId: '',
    userName: '',
    password: '',
    roleId: '',
    staff: null,
  });
  const [showAccDetails, setShowAccDetails] = useState(false);

  useEffect(() => {
    if (account) {
      setForm({
        staffId: account.staffId,
        userName: account.userName || '',
        password: '',
        roleId: account.role?.id || '',
        staff: account.staff || null,
      });
    }
  }, [account]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectEmployee = (staff) => {
    setForm({
      ...form,
      staffId: staff.id,
      staff: staff,
    });
    setShowAccDetails(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      staffId: form.staffId,
      userName: form.userName,
      password: form.password,
      role: { id: parseInt(form.roleId) },
      status: true,
    };

    try {
      if (account) {
        await updateAccount(form.staffId, payload);
      } else {
        await createAccount(form.staffId, payload);
      }
      onSave(payload);
    } catch (err) {
      console.error('❌ Failed to save account:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {account ? 'Edit Account' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border px-3 py-2 rounded"
            required={!account}
          />
          <select
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Role</option>
            <option value="1">Admin</option>
            <option value="2">Staff</option>
            <option value="3">Manager</option>
          </select>

          <div className="flex gap-2">
            <input
              type="text"
              value={form.staff?.fullName || ''}
              readOnly
              placeholder="Select employee..."
              className="flex-1 border px-3 py-2 rounded bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowAccDetails(true)}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Select
            </button>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {account ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>

        {showAccDetails && (
          <Accdetails
            onSelect={handleSelectEmployee}
            onClose={() => setShowAccDetails(false)}
          />
        )}
      </div>
    </div>
  );
}
