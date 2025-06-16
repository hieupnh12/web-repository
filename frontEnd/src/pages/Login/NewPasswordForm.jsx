// src/components/NewPasswordForm.jsx
import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { takeResetPass } from '../../services/authService';

export default function NewPasswordForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [serverError, setServerError] = useState('');
  const [token, setToken] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Extract token from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get('token');
    
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setServerError('Invalid or missing reset token. Please try again.');
    }    
  }, [location]);

  // Password validation
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    if (field === 'newPassword') {
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
    }
    if (errors[field] || errors.passwordMatch) {
      setErrors({});
    }
    if (serverError) {
      setServerError('');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setErrors({});
    setServerError('');

    // Validation
    if (!newPassword.trim()) {
      setErrors({ newPassword: 'Password is required' });
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrors({
        newPassword:
          'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character',
      });
      return;
    }

    if (!confirmPassword.trim()) {
      setErrors({ confirmPassword: 'Please confirm your password' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ passwordMatch: 'Passwords do not match' });
      return;
    }

    if (!token) {
      setServerError('Invalid or missing reset token. Please try again.');
      return;
    }

    
    setIsLoading(true);
    try {
      const response = await takeResetPass({
        token,
        newPassword: newPassword.trim(),
      });
      
      
      if (response && response.status === 200) {
        setIsPasswordReset(true);
      } else {
        const errorMessage =
          response?.data?.message || response?.error || 'Failed to reset password. Please try again.';
        setServerError(errorMessage);
      }
    } catch (error) {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back to login
  const handleBackToLogin = () => {
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
    setServerError('');
    setIsPasswordReset(false);
    navigate('/');
  };

  // Success screen after password reset
  if (isPasswordReset) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-1/2 hidden md:flex items-center justify-center bg-white">
          <img src="/logo.png" alt="Illustration" className="w-full h-full" />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
              <div className="mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2 text-gray-800">
                  Password Reset Successfully
                </h2>
                <p className="text-gray-600">
                  Your password has been updated. You can now log in with your new password.
                </p>
              </div>
              <button
                onClick={handleBackToLogin}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition duration-200 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </button>
            </div>
            <div className="text-center mt-6 text-sm text-gray-500">
              <p>© 2025 Warehouse Management System. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Password reset form
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 hidden md:flex items-center justify-center bg-white">
        <img src="/logo.png" alt="Illustration" className="w-full h-full" />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Set New Password
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your new password below.
              </p>
            </div>
            <div className="mb-6">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className={`w-full px-4 py-2 border ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.newPassword ? 'focus:ring-red-500' : 'focus:ring-blue-500'
                }`}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
              {errors.newPassword && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.newPassword}
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`w-full px-4 py-2 border ${
                  errors.confirmPassword || errors.passwordMatch
                    ? 'border-red-500'
                    : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.confirmPassword || errors.passwordMatch
                    ? 'focus:ring-red-500'
                    : 'focus:ring-blue-500'
                }`}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
              />
              {(errors.confirmPassword || errors.passwordMatch) && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.confirmPassword || errors.passwordMatch}
                </p>
              )}
            </div>
            {serverError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠</span>
                  {serverError}
                </p>
              </div>
            )}
            <button
              className={`w-full py-2 rounded-md font-medium text-white transition duration-200 mb-4 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
            <button
              onClick={handleBackToLogin}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition duration-200 flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </button>
          </div>
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>© 2025 Warehouse Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}