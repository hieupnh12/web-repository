import BASE_URL from "./index";

// Hàm lấy token từ localStorage
const getAuthToken = () => localStorage.getItem('authToken') || '';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
};

// Lấy danh sách nhân viên
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
    throw error.response?.data?.message || "Failed to fetch staff data";
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
    const res = await BASE_URL.post('/staff', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
      },
    });
    return res.data.result;
  } catch (error) {
    throw error.response?.data?.message || "Failed to add employee";
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


// Xóa nhân viên
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
    throw error.response?.data?.message || "Failed to delete employee";
  }
};