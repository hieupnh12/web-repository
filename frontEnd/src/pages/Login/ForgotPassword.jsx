// src/components/ForgotPassword.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import ResetPasswordForm from './ResetPasswordForm';
import NewPasswordForm from './NewPasswordForm';

export default function ForgotPassword() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  
  // Render NewPasswordForm if token exists, otherwise ResetPasswordForm
  return token ? <NewPasswordForm /> : <ResetPasswordForm />;
}