import React, { useEffect, useState } from 'react';
import Accdetails from './AccountDetails';
import { createAccount, updateAccount } from '../../api/accountApi';

export default function CreateAcc({ onClose, onSave, account }) {
  const [form, setForm] = useState({
    staffId: '',
    userName: '',
    password: '',
    roleId: '',
    status: true,
    staff: null,
  });

  const [showAccDetails, setShowAccDetails] = useState(false);
  const [error, setError] = useState(null); // Thêm state để hiển thị lỗi

  // Nếu đang chỉnh sửa account, nạp dữ liệu vào form
  useEffect(() => {
    if (account) {
      setForm({
        staffId: account.staffId || '',
        userName: account.userName || '',
        password: '', // Không show password cũ
        roleId: account.role?.id?.toString() || '',
        status: account.status ?? true,
        staff: account.staff || null,
      });
    }
  }, [account]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Khi chọn nhân viên từ Accdetails
  const handleSelectEmployee = (staff) => {
    setForm((prev) => ({
      ...prev,
      staffId: staff.staff_id, // Lưu UUID
      staff: staff,
    }));
    setShowAccDetails(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.staffId) {
      setError('Please select an employee.');
      return;
    }

    const payload = {
      staffId: form.staffId, // Thêm staffId vào payload
      userName: form.userName,
      role: { id: parseInt(form.roleId) },
      status: form.status ? 1 : 0,
    };

    try {
      setError(null); // Reset lỗi
      if (account) {
        await updateAccount(form.staffId, payload);
      } else {
        const response = await createAccount(form.staffId, payload);
        console.log(response);
        
      }
      onSave(); // Làm mới danh sách
    } catch (err) {
      console.error('❌ Failed to save account:', err);
      setError(
        err.includes('Please log in')
          ? 'Unauthenticated. Please log in to save the account.'
          : 'Failed to save account. Check your input or try again.'
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          {account ? 'Edit Account' : 'Create Account'}
        </h2>
        {error && (
          <div className="mb-2 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
            {error}
            {error.includes('Please log in') && (
              <button
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                onClick={() => window.location.href = '/login'} // Thay '/login' bằng đường dẫn thực tế
              >
                Go to Login
              </button>
            )}
          </div>
        )}
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
            required={!account} // Chỉ bắt buộc khi tạo mới
          />

          <select
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Role</option>
            <option value="11">ADMIN</option>
            <option value="13">STPC</option>
            <option value="15">TEST</option>
            <option value="16">TESTOK</option>
            <option value="17">kddd</option>
            <option value="18">FFFF</option>
          </select>

          {/* Chọn nhân viên */}
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
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Select
            </button>
          </div>

          {/* Trạng thái */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
            />
            Active
          </label>

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
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Hiển thị bảng chọn nhân viên */}
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