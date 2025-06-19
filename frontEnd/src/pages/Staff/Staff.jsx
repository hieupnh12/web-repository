import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, deleteEmployee } from '../../api/employeeApi';

const Staff = () => {
  const [staffs, setStaffs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const navigate = useNavigate();

  const fetchStaffs = async () => {
    try {
      const data = await getAllEmployees();
      const cleaned = data
        .filter(emp => emp && emp.staffId)
        .filter((emp, idx, self) =>
          idx === self.findIndex(s => s.staffId === emp.staffId)
        );
      setStaffs(cleaned);
      setFiltered(cleaned);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    const lower = value.toLowerCase();
    const result = staffs.filter(staff =>
      staff.fullName?.toLowerCase().includes(lower) ||
      staff.email?.toLowerCase().includes(lower) ||
      staff.phoneNumber?.includes(lower)
    );
    setFiltered(result);
  };

  const handleDelete = async (id) => {
    console.log('Deleting staff with ID:', id);
    if (window.confirm('Bạn chắc chắn muốn xoá nhân viên này?')) {
      try {
        await deleteEmployee(id);
        fetchStaffs();
        setSelectedStaffId(null);
      } catch (err) {
        console.error('Delete error:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Lỗi không xác định';
        alert('Không thể xóa nhân viên: ' + errorMessage);
      }
    }
  };

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <div className="text-blue-700 font-semibold mb-3">
        <span className="mr-2">Home</span>  <span className="ml-2">Nhân viên</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
          onClick={() => navigate('/manager/staff/add')}
        >
          Add
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => {
            if (!selectedStaffId) return alert('Vui lòng chọn nhân viên để sửa.');
            const staffToEdit = staffs.find(staff => staff.staffId === selectedStaffId);
            if (!staffToEdit) return alert('Nhân viên không tồn tại.');
            navigate(`/staff/edit/${selectedStaffId}`, { state: { staff: staffToEdit } });
          }}
        >
          Update
        </button>

        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          onClick={() => {
            if (!selectedStaffId) return alert('Vui lòng chọn nhân viên để xoá.');
            handleDelete(selectedStaffId);
          }}
        >
          Delete
        </button>

        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
          onClick={() => {
            if (!selectedStaffId) return alert('Vui lòng chọn nhân viên để xem chi tiết.');
            navigate(`staff/details/${selectedStaffId}`);
          }}
        >
          Details
        </button>

        <div className="ml-auto flex gap-2">
          <input
            className="w-[200px] border border-gray-300 px-2 py-1 rounded"
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded"
            onClick={fetchStaffs}
          >
            Reload
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Full Name</th>
            <th className="p-2 border">Gender</th>
            <th className="p-2 border">Birth Date</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4">Không có nhân viên nào.</td>
            </tr>
          ) : (
            filtered.map((staff) => (
              <tr
                key={staff.staffId}
                className={`cursor-pointer ${selectedStaffId === staff.staffId ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedStaffId(staff.staffId)}
              >
                <td className="p-2 border">{staff.staffId}</td>
                <td className="p-2 border">{staff.fullName}</td>
                <td className="p-2 border">{staff.gender ? 'Nam' : 'Nữ'}</td>
                <td className="p-2 border">{staff.birthDate || 'N/A'}</td>
                <td className="p-2 border">{staff.phoneNumber}</td>
                <td className="p-2 border">{staff.email}</td>
                <td className="p-2 border text-red-500">
                  {staff.status === 1 ? '0' : '1'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="bg-[#d6e9e9] h-[100px] rounded-b-xl mt-[-5px]" />
    </div>
  );
};

export default Staff;