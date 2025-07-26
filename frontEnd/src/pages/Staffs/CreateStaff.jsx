// CreateStaff.jsx (updated)
import React, { useState, useEffect } from "react";
import { createStaff } from "../../services/staffService";
import { useNavigate } from "react-router-dom";
import {
  Add as AddIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  X,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { fetchRoles, createAccount } from "../../services/accountService";

const AddStaff = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    birthDate: "",
    status: "1",
  });

  const [createAccountChecked, setCreateAccountChecked] = useState(false);

  const [accountForm, setAccountForm] = useState({
    userName: "",
    password: "",
    roleName: "",
  });

  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setForm({
        fullName: "",
        gender: "",
        phoneNumber: "",
        email: "",
        birthDate: "",
        status: "1",
      });
      setAccountForm({
        userName: "",
        password: "",
        roleName: "",
      });
      setCreateAccountChecked(false);
      fetchRoles().then((res) => {
        if (res.status === 200) setRoles(res.data.result);
      });
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formatted = {
        ...form,
        gender: form.gender === "Nam",
        birthDate: form.birthDate.split("-").reverse().join("-"),
        status: parseInt(form.status),
      };

      const resp = await createStaff(formatted);

      if (resp.status === 200) {
        const createdStaff = resp.data.result;

        if (createAccountChecked) {
          const selectedRole = roles.find((r) => r.roleName === accountForm.roleName);
          if (!selectedRole) {
            toast.error("Vai trò không hợp lệ");
            return;
          }

          if (!accountForm.userName || !accountForm.password) {
            toast.error("Vui lòng nhập đầy đủ thông tin tài khoản");
            return;
          }

          await createAccount(createdStaff.staffId, {
            userName: accountForm.userName,
            password: accountForm.password,
            roleId: selectedRole.roleId,
          });
        }

        onSave?.(createdStaff);
        onClose();
        navigate("/manager/staff");
        toast.success("Tạo nhân viên thành công");
      } else {
        toast.error("Tạo nhân viên thất bại");
      }
    } catch (err) {
      toast.error("Lỗi khi tạo nhân viên hoặc tài khoản");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-3xl h-[85%] overflow-y-auto custom-scroll shadow-2xl relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-6 relative">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <AddIcon />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Thêm nhân viên mới</h2>
              <p className="text-sm opacity-90">
                Vui lòng điền vào tất cả các trường bắt buộc
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 transition"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Full Name */}
          <div>
            <div className="flex items-center mb-2">
              <PersonIcon className="text-green-600 mr-2" />
              <span className="text-sm text-gray-600">Họ & Tên</span>
            </div>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Full name *"
              required
              maxLength={100}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Gender + Birth Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Gender</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block flex items-center gap-1">
                <CalendarIcon fontSize="small" /> Ngày sinh
              </label>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block flex items-center gap-1">
                <PhoneIcon fontSize="small" /> Số điện thoại
              </label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-2 block flex items-center gap-1">
                <EmailIcon fontSize="small" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Status */}
          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">Status:</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="1">Hoạt động</option>
              <option value="0">Không hoạt động</option>
            </select>
          </div>

          {/* Checkbox: Tạo tài khoản */}
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="createAccount"
              checked={createAccountChecked}
              onChange={(e) => setCreateAccountChecked(e.target.checked)}
            />
            <label htmlFor="createAccount" className="text-sm text-gray-700">
              Tạo tài khoản đăng nhập cho nhân viên này
            </label>
          </div>

          {/* Account Section (conditionally rendered) */}
          {createAccountChecked && (
            <>
              <hr className="border-gray-300 mt-6" />
              <h3 className="text-lg font-bold">Thông tin tài khoản đăng nhập</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="userName"
                  value={accountForm.userName}
                  onChange={handleAccountChange}
                  placeholder="Tên đăng nhập"
                  maxLength={30}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="password"
                  name="password"
                  value={accountForm.password}
                  onChange={handleAccountChange}
                  placeholder="Mật khẩu"
                  maxLength={64}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
                <select
                  name="roleName"
                  value={accountForm.roleName}
                  onChange={handleAccountChange}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleName}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Footer */}
          <hr className="border-gray-200 mt-6" />
          <div className="p-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-gradient-to-r from-green-600 to-green-400 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-500 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
