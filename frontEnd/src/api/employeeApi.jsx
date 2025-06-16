import BASE_URL from './index';

const getAuthToken = () => localStorage.getItem('authToken') || '';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
};

// Lấy danh sách nhân viên
export const getAllEmployees = async () => {
  try {
    const res = await BASE_URL.get('/staff', { headers });
    if (Array.isArray(res.data?.result)) return res.data.result;
    throw new Error('Invalid response structure');
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch staff data';
  }
};

// Thêm nhân viên
export const addEmployee = async (emp) => {
  try {
    const payload = {
      staffId: emp.staffId,
      fullName: emp.fullName,
      gender: emp.gender === 'Nam' ? true : false,
      phoneNumber: emp.phoneNumber,
      email: emp.email,
      status: emp.status ?? 1,
      birthDate: emp.birthDate, // Giả định nhận DD-MM-YYYY từ form
    };
    const res = await BASE_URL.post('/staff', payload, { headers });
    return res.data.result;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add employee';
  }
};

// Cập nhật nhân viên
export const updateEmployee = async (staffId, emp) => {
  try {
    const payload = {
      fullName: emp.fullName,
      gender: emp.gender === 'Nam' ? '1' : '0', // Ánh xạ Nam=1, Nữ=0
      phoneNumber: emp.phoneNumber,
      email: emp.email,
      status: emp.status ? '1' : '0', // Ánh xạ status=1 thành '1', khác 1 thành '0'
    };
    console.log('Sending update payload:', payload); // Log payload
    const res = await BASE_URL.put(`/warehouse/staff/${staffId}`, payload, { headers }); // Sửa endpoint
    console.log('Update response:', res.data);
    return res.data.result;
  } catch (error) {
    console.error('Update error details:', error.response?.data || error.message);
    throw error.response?.data?.message || 'Failed to update employee';
  }
};


// Xóa nhân viên
export const deleteEmployee = async (staffId) => {
  try {
    await BASE_URL.delete(`/staff/${staffId}`, { headers });
    return true;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete employee';
  }
};