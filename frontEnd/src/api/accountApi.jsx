import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/account'; // Adjust if backend uses /warehouse/account

// Lấy token từ localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  return token;
};

// Headers chuẩn
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`,
});

// 📌 Lấy danh sách tài khoản
export const fetchAccounts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      headers: getHeaders(),
    });
    console.log('API Response:', response.data); // Debug response structure
    return response.data?.result || response.data?.data || [];
  } catch (error) {
    console.error('Error fetching accounts:', error);
    const message = error.response?.data?.message || 'Failed to fetch accounts.';
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('Unauthenticated. Please log in.');
    }
    throw new Error(message);
  }
};

// 📌 Tạo tài khoản mới theo staffId (MaNV)
export const createAccount = async (staffId, payload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${staffId}`, payload, {
      headers: getHeaders(),
    });
    return response.data?.result;
  } catch (error) {
    console.error('Error creating account:', error);
    throw error.response?.data?.message || 'Failed to create account.';
  }
};

// 📌 Cập nhật tài khoản theo staffId
export const updateAccount = async (staffId, payload) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${staffId}`, payload, {
      headers: getHeaders(),
    });
    return response.data?.result;
  } catch (error) {
    console.error('Error updating account:', error);
    throw error.response?.data?.message || 'Failed to update account.';
  }
};

// 📌 Xoá tài khoản theo staffId
export const deleteAccount = async (staffId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${staffId}`, {
      headers: getHeaders(),
    });
    return response.data?.message || 'Deleted successfully';
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error.response?.data?.message || 'Failed to delete account.';
  }
};