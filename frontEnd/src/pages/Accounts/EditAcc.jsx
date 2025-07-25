// EditAcc.jsx
import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import { toast } from "react-toastify"; 


export default function EditAcc({ account, roles, onClose, onSave }) {
  const [form, setForm] = useState({
    userName: "",
    roleId: "",
    status: "1",
  });

  useEffect(() => {
    if (account) {
      setForm({
        userName: account.userName || "",
        roleId: account.roleId ? account.roleId.toString() : "",
        status: account.status === true || account.status === 1 ? "1" : "0",
      });
    }
  }, [account]);

  if (!account) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.userName || !form.roleId) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const payload = {
      userName: form.userName,
      roleId: parseInt(form.roleId, 10),
      status: form.status === "1",
    };

    onSave?.(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white p-4 relative rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 rounded-full p-2">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Chỉnh sửa tài khoản</h2>
              <p className="text-sm opacity-90">Cập nhật thông tin tài khoản</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="flex flex-col space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Tên đăng nhập</label>
              <input
                name="userName"
                value={form.userName}
                onChange={handleChange}
                required
                placeholder="Nhập tên đăng nhập"
                maxLength={30}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Vai trò</label>
              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="">Chọn vai trò</option>
                {roles && roles.length > 0 ? (
                  roles.map((role) => (
                    <option key={role.roleId} value={role.roleId.toString()}>
                      {role.roleName}
                    </option>
                  ))
                ) : (
                  <option disabled>Không có vai trò nào</option>
                )}
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Trạng thái</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
              >
                <option value="1">Hoạt động</option>
                <option value="0">Ngừng</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <hr className="border-gray-200" />
          <div className="p-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-yellow-400 text-white rounded-lg font-semibold hover:from-yellow-700 hover:to-yellow-500 transition"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
