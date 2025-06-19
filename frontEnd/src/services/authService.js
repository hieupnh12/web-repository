import axios from "axios";
import BASE_URL from "../api/index";
import { GET, POST } from "../constants/httpMethod"
import { createAsyncThunk } from "@reduxjs/toolkit";
// import { Cookie } from "lucide-react";
import Cookie from "js-cookie";


// Login chính thức
export const login = createAsyncThunk("auth/login", async (user) => {
    const responds = BASE_URL[POST]("auth/login", user);
    Cookie.set("token", (await responds).data.result.token)
    return (await responds).data;
});

export const loginV3 = async (user) => {
    const responds = BASE_URL[POST]("auth/login", user);
    return (await responds).data;
};

// Login để test trực tiếp k cần đổi api
export const loginV2 = async (user) => {
    const responds = axios.post("http://localhost:8080/warehouse/auth/login", user)
        Cookie.set("token", (await responds).data.result.token)

    return responds;
};

/**
 * Giải mã token sau khi đăng nhập
 * @param {*} token  chuỗi token cần giải mã
 * @returns thông tin chi tiết user
 */
export const verifyToken = (token) => {
    const responds = BASE_URL[GET]("staff/myInfo", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return responds.data;
}

export const takeRole = (token) => {
    const responds = BASE_URL[GET]("role/myRole", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return responds;
}

export const takeInfo = () => {
    const responds = BASE_URL[GET]("staff/myInfo");
    return responds;
}

export const takeFunction = () => {
    const responds = BASE_URL[GET]("function/functionByRole");
    return responds;
}

export const takeForgotPass = (data) => {
    const responds = BASE_URL[POST]("auth/forgot", data);
    return responds;
}

export const takeResetPass = async (data) => {
    const response = await BASE_URL[POST]('auth/reset', data);
    
    return response;
};


/**
 * Lấy data từ cookie và lưu vào redux
 */
export const loadUserFromCookie = createAsyncThunk(
    "auth/loadUserFromCookie", async (token) => {
        return token; 
    }
)