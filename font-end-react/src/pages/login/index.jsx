// LoginForm.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Alert, notification } from "antd";
import { login } from "../../services/authService";
const Login = () => {
  const navigate = navigator();
  const [errorServer, setErrorServer] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.preventDefault();

    try {
      const response = await login(data);
      console.log("response: ", response);
      
      if(response.status === 201) {

        // Chuyển hướng đăng nhập
        navigate("/admin");

        notification.success({
          message: "Thành công",
          description: response.data,
        })
      }
    } catch (error) {
      console.log("error", error);
      const responseError = error?.response?.data?.error;
      setErrorServer(responseError);
    }
    console.log("Đăng nhập với:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Đăng nhập hệ thống <Link to="/">du lịch</Link>
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="text"
              placeholder="username"
              {...register("username", {
                required: "Vui lòng nhập username",
                pattern: {
                  value: /^\S+/i,
                  message: "username không hợp lệ",
                },
              })}
              className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: {
                  value: 6,
                  message: "Mật khẩu tối thiểu 6 ký tự",
                },
              })}
              className={`mt-1 w-full px-4 py-2 border rounded-lg ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {errorServer && (
            <Alert
              className="mb-3"
              type="error"
              message={errorServer}
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-150"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
