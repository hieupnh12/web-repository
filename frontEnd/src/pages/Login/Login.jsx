import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Lock, ArrowRight, Shield } from "lucide-react";
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFormFocused, setIsFormFocused] = useState(false);

  const slides = [
    { image: "/ip16.png", title: "Warehouse Management", subtitle: "Efficient inventory control" },
    { image: "/s25ultra.png", title: "Real-time Tracking", subtitle: "Monitor your stock 24/7" },
    { image: "/ip16.png", title: "Advanced Analytics", subtitle: "Data-driven decisions" }
  ];

  // Slideshow effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handle Enter key press
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !isLoading) {
        handleLogin();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [credentials, isLoading]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Left Panel - Slideshow */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_50%)] z-10"></div>
        
        {/* Slideshow */}
        <div className="relative w-full h-full flex items-center justify-center z-20">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex flex-col items-center justify-center text-white p-12 transition-all duration-1000 ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="w-80 h-80 mb-8 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-4xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {slide.title}
              </h2>
              <p className="text-xl text-gray-300 text-center max-w-md">
                {slide.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-tl from-white/5 to-transparent"></div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400">Log in to system</p>
          </div>

          {/* Login Form */}
          <div className={`bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl transition-all duration-300 ${
            isFormFocused ? 'bg-white/15 border-blue-500/50' : ''
          }`}>
            
            {/* Username Field */}
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Account
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="username"
                  type="text"
                  className={`w-full pl-12 pr-4 py-4 bg-white/5 border-2 ${
                    errors.username ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all duration-300`}
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  onFocus={() => setIsFormFocused(true)}
                  onBlur={() => setIsFormFocused(false)}
                />
                {errors.username && (
                  <div className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.username}
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-12 pr-12 py-4 bg-white/5 border-2 ${
                    errors.password ? 'border-red-500' : 'border-white/20 focus:border-blue-500'
                  } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/10 transition-all duration-300`}
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  onFocus={() => setIsFormFocused(true)}
                  onBlur={() => setIsFormFocused(false)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <div className="absolute -bottom-6 left-0 text-red-400 text-sm flex items-center">
                    <span className="mr-1">⚠</span>
                    {errors.password}
                  </div>
                )}
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right mb-4">
              <Link
                to="forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mb-3 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                {serverError}
              </div>
            )}

            {/* Login Button */}
            <button
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
              }`}
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loging...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Log In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              )}
            </button>

          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-gray-400 text-sm">
            <p>© 2025 Warehouse Management System. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}