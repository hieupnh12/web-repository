import BASE_URL from '../api';
import { GET } from '../constants/httpMethod';

// Hàm lấy token từ localStorage
const getAuthToken = () => localStorage.getItem('authToken') || '';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const fetchStaffList = () => {
  return BASE_URL[GET]("staff");
};

export const createStaff = async (staff) => {
  try {
    const payload = {
      staffId: staff.staffId,
      fullName: staff.fullName,
      gender: staff.gender === 'Nam' || staff.gender === true ? true : false,
      phoneNumber: staff.phoneNumber,
      email: staff.email,
      status: staff.status ?? 1,
      birthDate: staff.birthDate,
    };

    const res = await BASE_URL.post('/staff', payload, {
      headers: getHeaders(),
    });
    return res;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create staff";
  }
};

export const editStaff = async (id, staff) => {
  try {
    const payload = {
      staffId: id,
      fullName: staff.fullName,
      gender: staff.gender === 'Nam' || staff.gender === true ? true : false,
      phoneNumber: staff.phoneNumber,
      email: staff.email,
      birthDate: staff.birthDate,
      status: staff.status === '1' || staff.status === 1 ? 1 : 0,
    };

    console.log(`Calling API to: /staff/${id}`);
    console.log('Payload:', payload);

    const res = await BASE_URL.put(`/staff/${id}`, payload, {
      headers: getHeaders(),
    });
    return res.data.result;
  } catch (error) {
    console.log('Error response:', error.response); // Debug the full response
    throw error.response?.data?.message || "Failed to update staff";
  }
};

export const removeStaff = async (id) => {
  try {
    const res = await BASE_URL.delete(`/staff/${id}`, {
      headers: getHeaders(),
    });
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete staff";
  }
};