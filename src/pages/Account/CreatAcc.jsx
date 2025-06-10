import React, { useState, useEffect } from 'react';

export default function CreateAcc({ account, onClose, onSave }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: '',
    status: ''
  });

  useEffect(() => {
    if (account) {
      setForm(account);
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username || !form.password || !form.role || !form.status) {
      alert('Please fill in all fields!');
      return;
    }

    if (onSave && typeof onSave === 'function') {
      onSave(form);  // 👈 Gọi đúng hàm từ prop
      onClose();
    } else {
      console.error('❌ onSave is not a function or missing');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{account ? 'Edit Account' : 'Create New Account'}</h2>
          <button onClick={onClose} className="text-xl text-gray-500 hover:text-black">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password || ''}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Select --</option>
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">-- Select --</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {account ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
}
