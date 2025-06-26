import React, { useState, useEffect } from 'react';
import { updateEmployee } from '../../api/employeeApi';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const EditStaff = () => {
  const { state } = useLocation();
  const { staffId } = useParams();
  const [form, setForm] = useState({
    staffId: '',
    fullName: '',
    gender: '',
    phoneNumber: '',
    email: '',
    status: '1', // Mặc định '1' theo backend
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.staff) {
      console.error('No staff data found in state for staffId:', staffId);
      navigate('/staff');
    } else {
      // Ánh xạ dữ liệu từ state.staff vào form
      setForm({
        staffId: state.staff.staffId || '',
        fullName: state.staff.fullName || '',
        gender: state.staff.gender === '1' ? 'Nam' : 'Nữ', // Ánh xạ '1' -> Nam, '0' -> Nữ
        phoneNumber: state.staff.phoneNumber || '',
        email: state.staff.email || '',
        status: state.staff.status || '1', // Ánh xạ status từ backend
      });
      console.log('Initial form data:', state.staff); // Debug dữ liệu ban đầu
    }
  }, [state, staffId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data being sent:', form);
    try {
      const payload = {
        staffId: form.staffId,
        fullName: form.fullName,
        gender: form.gender === 'Nam' ? '1' : '0', // Chuyển Nam -> '1', Nữ -> '0'
        phoneNumber: form.phoneNumber,
        email: form.email,
        status: form.status === 'Nam' ? '1' : '0', // Điều chỉnh logic status (có thể cần sửa nếu sai)
      };
      console.log('Payload sent to API:', payload); // Debug payload
      await updateEmployee(form.staffId, payload);
      // navigate('/staff');
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';
      alert('Không thể cập nhật nhân viên: ' + errorMessage);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chỉnh sửa nhân viên</h2>
      <form onSubmit={handleSubmit} className="grid gap-3 max-w-md">
        <input
          name="staffId"
          placeholder="Staff ID"
          value={form.staffId}
          onChange={handleChange}
          className="border p-2 rounded"
          readOnly // Chỉ hiển thị, không cho sửa
        />
        <input
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select name="gender" value={form.gender} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <input
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded" required>
          <option value="">Chọn trạng thái</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Cập nhật</button>
      </form>
    </div>
  );
};

export default EditStaff;