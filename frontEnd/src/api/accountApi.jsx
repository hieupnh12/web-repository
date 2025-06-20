import BASE_URL from '../api';
import { GET, POST } from '../constants/httpMethod';
import axios from 'axios';

// Hàm lấy token từ localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('⚠️ Không tìm thấy token trong localStorage.');
    return null;
  }
  return token;
};

// Hàm chuẩn hóa headers có hoặc không có token
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// 🔄 Fetch danh sách accounts theo staffId (ID động)
export const fetchAccounts = async (staffId) => {
  const token = getAuthToken();
  if (!token) return [];
  

  try {
    const response = await axios.get(`${BASE_URL}/account/${staffId}`, {
      headers: getHeaders(),
    });
    console.log('✅ response.data:', response.data);
    return response.data.accounts || []; // đảm bảo luôn trả về mảng
  } catch (error) {
    console.error("❌ Error fetching accounts:", error);
    return [];
  }
};

// Tạo account
export const createAccount = async (staffId, payload) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token is required to create an account.');

    const response = await BASE_URL[POST](`/account/${staffId}`, payload, {
      headers: getHeaders(),
    });

    return response.data?.result || null;
  } catch (error) {
    console.error('❌ Error creating account:', error);
    throw new Error(error.response?.data?.message || 'Failed to create account.');
  }
};

// Cập nhật account
export const updateAccount = async (staffId, payload) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token is required to update an account.');

    const response = await BASE_URL[POST](`/account/${staffId}`, payload, {
      headers: getHeaders(),
    });

    return response.data?.result || null;
  } catch (error) {
    console.error('❌ Error updating account:', error);
    throw new Error(error.response?.data?.message || 'Failed to update account.');
  }
};

// Xoá account
export const deleteAccount = async (staffId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error('Authentication token is required to delete an account.');

    const response = await axios.delete(`${BASE_URL}/account/${staffId}`, {
      headers: getHeaders(),
    });

    return response.data?.message || 'Deleted successfully';
  } catch (error) {
    console.error('❌ Error deleting account:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete account.');
  }
};
