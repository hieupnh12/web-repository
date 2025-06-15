import BASE_URL from './index';

// Hàm lấy token từ localStorage
const getAuthToken = () => localStorage.getItem('authToken') || '';

// Lấy danh sách nhân viên (staff)
export const getAllEmployees = async () => {
  try {
    const res = await BASE_URL.get('/staff', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });

    console.log('res.data:', res.data); // 👈 THÊM DÒNG NÀY để kiểm tra

    // Giả sử res.data.result là object chứa danh sách nhân viên
    if (Array.isArray(res.data?.result)) return res.data.result;

    // Nếu là object chứa key 'staffs' hoặc 'data'
    if (Array.isArray(res.data?.result?.staffs)) return res.data.result.staffs;
    if (Array.isArray(res.data?.result?.data)) return res.data.result.data;

    throw new Error('Invalid response structure');
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch staff data';
  }
};

// Thêm mới nhân viên
export const addEmployee = async (emp) => {
  try {
    const payload = {
      staff_id: emp.staff_id,
      full_name: emp.full_name,
      gender: emp.gender,
      phone_number: emp.phone_number,
      email: emp.email,
      status: emp.status ?? 1,
    };
    const res = await BASE_URL.post('/staff', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return res.data.result;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add employee';
  }
};

// Cập nhật thông tin nhân viên theo staffId
export const updateEmployee = async (staffId, emp) => {
  try {
    const payload = {
      full_name: emp.full_name,
      gender: emp.gender,
      phone_number: emp.phone_number,
      email: emp.email,
      status: emp.status,
    };
    const res = await BASE_URL.put(`/staff/${staffId}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return res.data.result;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update employee';
  }
};

// Xoá nhân viên theo staffId
export const deleteEmployee = async (staffId) => {
  try {
    const res = await BASE_URL.delete(`/staff/${staffId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete employee';
  }
};
