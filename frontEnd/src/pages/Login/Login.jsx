import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Cookie from "js-cookie";
import { loginV2, takeRole } from "../../services/authService";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const token = Cookie.get("token");

  //   if (token) {
  //     // kiểm tra role và điều hướng
  //     takeRole(token)
  //       .then((res) => {
  //         const role = res.data.result.roleName;
  //         if (role === "ADMIN") navigate("/manager");
  //         else navigate("/staff");
  //       })
  //       .catch(() => {
  //         // token hết hạn hoặc lỗi
  //         Cookie.remove("token");
  //       });
  //   } else {
  //     navigate("/")
  //   }
  // }, []);

  const validateInputs = () => {
    const newErrors = {};
    if (!credentials.username.trim()) {
      newErrors.username = "Username is required.";
    }
    if (!credentials.password.trim()) {
      newErrors.password = "Password is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));

    // Real-time validation
    if (field === "username") {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, username: "Username is required." }));
      } else {
        setErrors((prev) => {
          const { username, ...rest } = prev;
          return rest;
        });
      }
    }

    if (field === "password") {
      if (!value.trim()) {
        setErrors((prev) => ({ ...prev, password: "Password is required." }));
      } else {
        setErrors((prev) => {
          const { password, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    setServerError("");

    try {
      const formattedData = {
        username: credentials.username.trim().toLowerCase(),
        password: credentials.password.trim(),
      };

      // const response = await dispatch(login(formattedData));

      // const data = unwrapResult(response);
      const response = await loginV2(formattedData);
      
      if (response.status === 200) {
        const role = await takeRole(response.data.result.token);
         sessionStorage.setItem("roleName", role.data.result.roleName);
        if (role.data.result.roleName === "ADMIN")
          navigate("/manager/dashboard");
        else navigate("/staff/dashboard");
      }
      // Sử dụng luôn role trả về từ login nếu có
    } catch (error) {
      setServerError(error?.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left: Illustration */}
      <div className="w-1/2 hidden md:flex items-center justify-center bg-white">
        <img src="/logo.png" alt="Illustration" className="w-full h-full" />
      </div>

      {/* Right: Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Log in to system
            </h2>

            {/* Username */}
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Account
              </label>
              <input
                id="username"
                type="text"
                className={`w-full px-4 py-2 border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 ${
                  errors.username ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                placeholder="e.g., admin"
                value={credentials.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
              {errors.username && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-2 pr-12 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  placeholder="e.g., admin123"
                  value={credentials.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-2 flex items-center">
                  <span className="mr-1">⚠</span>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-4">
              <Link
              to={"forgot-password"}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Server Error */}
            {serverError && (
              <p className="text-sm text-red-600 text-center mb-3">
                {serverError}
              </p>
            )}

            {/* Login Button */}
            <button
              className={`w-full py-2 rounded-md font-medium text-white transition duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Log In"
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>© 2025 Warehouse Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
