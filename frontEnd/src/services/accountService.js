import BASE_URL from '../api';
import { GET, POST, PUT, DELETE } from '../constants/httpMethod';

const getAuthToken = () => localStorage.getItem('authToken') || '';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const fetchAccounts = () => {
  return BASE_URL[GET]('account', { headers: getHeaders() });
};

export const createAccount = async (staffId, payload) => {
  return await BASE_URL[POST](`account/${staffId}`, payload, { headers: getHeaders() });
};

export const updateAccount = async (staffId, payload) => {
  return await BASE_URL[PUT](`account/${staffId}`, payload, { headers: getHeaders() });
};

export const deleteAccount = async (staffId) => {
  return await BASE_URL[DELETE](`account/${staffId}`, { headers: getHeaders() });
};
