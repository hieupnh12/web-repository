import axios from "axios";
import Cookie from "js-cookie";

const BASE_URL = axios.create({
  baseURL: "http://localhost:8080/warehouse/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Gắn token trước mỗi request
BASE_URL.interceptors.request.use((config) => {
  const token = Cookie.get("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Xử lý khi token hết hạn
BASE_URL.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và không phải refresh request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:8080/warehouse/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.result.token;

        // Lưu token mới
        Cookie.set("token", newToken, {
          expires: 1,
          secure: true,
          sameSite: "Strict",
        });

        // Gắn token mới vào request cũ
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        // Gửi lại request cũ
        return BASE_URL(originalRequest);
      } catch (err) {
        console.error("❌ Token refresh failed", err);

        // Dọn dẹp & chuyển về trang login
        Cookie.remove("token");
        Cookie.remove("refreshToken");
        // dispatch(logout()); // nếu có dùng redux
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default BASE_URL;
