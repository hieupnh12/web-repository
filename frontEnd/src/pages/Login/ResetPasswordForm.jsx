// src/components/ResetPasswordForm.jsx
import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { takeForgotPass } from "../../services/authService";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (value) => {
    setEmail(value);
    if (errors.email) {
      setErrors({});
    }
    if (serverError) {
      setServerError("");
    }
  };

  const handleSubmit = async () => {
    setErrors({});
    setServerError("");

    // Validation
    if (!email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await takeForgotPass({ email: email.trim() });
      if (response && response.status === 200) {
        setIsEmailSent(true);
      } else {
        const errorMessage =
          response?.data?.message || response?.error || "Check in your email";
        setServerError(errorMessage);
      }
    } catch (error) {
      setServerError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  const handleBackToLogin = () => {
    setEmail("");
    setErrors({});
    setServerError("");
    setIsEmailSent(false);
    navigate("/");
  };

  const handleResendEmail = () => {
    handleSubmit();
  };

  if (isEmailSent) {
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
                  Check your email
                </h2>
                <p className="text-gray-600">
                  We've sent a password reset link to
                </p>
                <p className="text-blue-600 font-medium mt-1">{email}</p>
              </div>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                {serverError ? (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md mt-2">
                    <p className="text-sm text-red-600 flex">
                      <span className="mr-1">⚠</span>
                      {serverError}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">
                    Didn't receive the email? Check your spam folder or
                    <button
                      onClick={handleResendEmail}
                      disabled={isLoading}
                      className="text-blue-600 hover:underline ml-1 font-medium"
                    >
                      {isLoading ? "Sending..." : "resend email"}
                    </button>
                  </p>
                )}
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

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/2 hidden md:flex items-center justify-center bg-white">
        <img src="/logo.png" alt="Illustration" className="w-full h-full" />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Reset your password
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`w-full px-4 py-2 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                placeholder="e.g., admin@company.com"
                value={email}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.email}
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
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending Email...
                </div>
              ) : (
                "Send Reset Link"
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
