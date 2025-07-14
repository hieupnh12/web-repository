import React, { useEffect, useState } from 'react';
import CreateStaff from './CreateStaff';
import EditStaff from './EditStaff';
import { fetchStaffList, createStaff, editStaff, removeStaff } from '../../services/staffService';
import { Plus, Edit, Trash, RotateCw, Search } from 'lucide-react';

export default function Staff() {
  const [staffs, setStaffs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const selectedStaff = staffs.find((s) => s.staffId === selectedId);

  const loadStaffs = async () => {
    try {
      setError(null);
      const response = await fetchStaffList();
      setStaffs(response?.data?.result || []);
    } catch (err) {
      console.error('❌ Lỗi tải danh sách:', err);
      setError('Không thể tải danh sách nhân viên.');
    }
  };

  useEffect(() => {
    loadStaffs();
  }, []);

  const handleSave = async (formData) => {
    try {
      const payload = {
        ...(editMode && selectedStaff ? { staffId: selectedStaff.staffId } : {}),
        fullName: formData.fullName,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        birthDate: formData.birthDate,
        status: formData.status,
      };

      if (editMode) {
        await editStaff(selectedStaff.staffId, payload);
      } else {
        await createStaff(payload);
      }

      await loadStaffs();
      setShowForm(false);
      setEditMode(false);
      setSelectedId(null);
    } catch (err) {
      console.error('❌ Lỗi lưu nhân viên:', err);
      setError(err.message || 'Lỗi khi lưu nhân viên');
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return alert('Vui lòng chọn nhân viên để xoá!');
    if (window.confirm('Bạn có chắc chắn muốn xoá?')) {
      try {
        await removeStaff(selectedId);
        await loadStaffs();
        setSelectedId(null);
      } catch (err) {
        console.error('❌ Lỗi xoá:', err);
        setError(err.message || 'Lỗi khi xoá nhân viên');
      }
    }
  };

  const filtered = staffs.filter((staff) =>
    staff.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    staff.email?.toLowerCase().includes(search.toLowerCase()) ||
    staff.phoneNumber?.includes(search)
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
            <button
              onClick={() => {
                setEditMode(false);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-green-600 text-white hover:bg-green-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm rounded"
            >
              <Plus className="w-4 h-4" /> Thêm mới
            </button>

            <button
              onClick={() => {
                if (!selectedId) return setError('Vui lòng chọn nhân viên để sửa!');
                setEditMode(true);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm rounded"
            >
              <Edit className="w-4 h-4" /> Sửa
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm rounded"
            >
              <Trash className="w-4 h-4" /> Xoá
            </button>

            <button
              onClick={loadStaffs}
              className="flex items-center gap-2 bg-gray-500 text-white hover:bg-gray-600 hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl px-3 py-2 text-sm rounded"
            >
              <RotateCw className="w-4 h-4" /> Tải lại
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-sm text-center">
          <thead className="bg-blue-100 text-gray-700 font-semibold">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Họ tên</th>
              <th className="px-4 py-2">Giới tính</th>
              <th className="px-4 py-2">Ngày sinh</th>
              <th className="px-4 py-2">SĐT</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((staff, index) => (
              <tr
                key={staff.staffId}
                className={`hover:bg-blue-50 cursor-pointer ${selectedId === staff.staffId ? 'bg-blue-100 font-bold' : ''}`}
                onClick={() => setSelectedId(staff.staffId)}
              >
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{staff.fullName}</td>
                <td className="px-4 py-2">{staff.gender === true || staff.gender === '1' ? 'Nam' : 'Nữ'}</td>
                <td className="px-4 py-2">{staff.birthDate || 'N/A'}</td>
                <td className="px-4 py-2">{staff.phoneNumber}</td>
                <td className="px-4 py-2">{staff.email}</td>
                <td className="px-4 py-2">{staff.status === '1' || staff.status === 1 ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        editMode ? (
          <EditStaff
            staff={selectedStaff}
            onClose={() => {
              setShowForm(false);
              setEditMode(false);
              setSelectedId(null);
            }}
            onSave={handleSave}
          />
        ) : (
          <CreateStaff
            staff={null}
            onClose={() => {
              setShowForm(false);
              setEditMode(false);
              setSelectedId(null);
            }}
            onSave={handleSave}
          />
        )
      )}
    </div>
  );
}