import BASE_URL from '../api';
import { GET, POST } from '../constants/httpMethod';

// Hàm lấy token từ localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.warn('⚠️ Không tìm thấy token trong localStorage.');
  }
  return token;
};

// Hàm chuẩn hóa headers
const getHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const takePermission = () => {
  try {
    const responds = BASE_URL[GET]('role', {
      headers: getHeaders(),
    });
    return responds;
  } catch (error) {
    console.error('❌ Error fetching permissions:', error);
    throw new Error(error?.message || 'Failed to fetch permissions.');
  }
};

export const fetchAccounts = () => {
  try {
    const responds = BASE_URL[GET]('account', {
      headers: getHeaders(),
    });
    return responds;
  } catch (error) {
    console.error('❌ Failed to fetch accounts:', error);
    throw new Error(error?.message || 'Failed to fetch accounts.');
  }
};

export const createAccount = (id, data) => {
  try {
    const responds = BASE_URL[POST](`account/${id}`, data, {
      headers: getHeaders(),
    });
    return responds;
  } catch (error) {
    console.error('❌ Error creating account:', error);
    throw new Error(error?.message || 'Failed to create account.');
  }
};

export const updateAccount = (staffId, data) => {
  try {
    const responds = BASE_URL.put(`account/update/${staffId}`, data, {
      headers: getHeaders(),
    });
    return responds;
  } catch (error) {
    console.error('❌ Error updating account:', error);
    throw new Error(error?.message || 'Failed to update account.');
  }
};


export const deleteAccount = async (id) => {
  try {
    const res = await BASE_URL.delete(`account/${id}`, {
      headers: getHeaders(),
    });
    return res.data;
  } catch (error) {
    console.error('Delete error:', error.response?.status, error.response?.data);
    throw error.response?.data?.message || 'Failed to delete account. Server may not allow DELETE.';
  }
};