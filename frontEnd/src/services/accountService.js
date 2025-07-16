import BASE_URL from '../api';
import { GET, POST, PUT, DELETE } from '../constants/httpMethod';

// Lấy token từ localStorage
const getAuthToken = () => localStorage.getItem('authToken') || '';

// Header mặc định cho tất cả request
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

// Lấy danh sách tất cả tài khoản
export const fetchAccounts = async () => {
  return await BASE_URL[GET]('account', { headers: getHeaders() });
};

// Tạo tài khoản mới cho nhân viên
export const createAccount = async (staffId, payload) => {
  return await BASE_URL[POST](`account/${staffId}`, payload, { headers: getHeaders() });
};

// Cập nhật thông tin tài khoản
export const updateAccount = async (accountId, payload) => {
  return await BASE_URL[PUT](`account/${accountId}`, payload, { headers: getHeaders() });
};

// Xoá tài khoản
export const deleteAccount = async (accountId) => {
  return await BASE_URL[DELETE](`account/${accountId}`, { headers: getHeaders() });
};

// Lấy danh sách Role từ BE
export const fetchRoles = async () => {
  return await BASE_URL[GET]('role', { headers: getHeaders() });
};
