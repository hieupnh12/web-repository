import { createSlice } from "@reduxjs/toolkit";
import { loadUserFromCookie, loginV2 } from "../services/authService";
import * as status from "../constants/status";
import Cookie  from "js-cookie";

const authSlide = createSlice({
    name: "auth",
    initialState: {
        status: status.IDLE,
        data: null,
        error: null,
        userInfo: null,        // ✅ fullName, roleName
        functionIds: [],
    },
    reducers: {
        logout: (state) => {
            Cookie.remove("token");

            state.data = null;
        },
        setUserInfo: (state, action) => {
    state.userInfo = action.payload; // { fullName, roleName }
  },
  setFunctionIds: (state, action) => {
    state.functionIds = action.payload; // array of functionId
  }
    },
    extraReducers: (builder) => {
        builder.addCase(loginV2.pending, (state, action) => {
            state.status = status.PENDING;
        })

        .addCase(loginV2.fulfilled, (state, action) => {
            state.status = status.SUCCESSFULLY;
            state.data = action.payload;
        }) 

        .addCase(loginV2.rejected, (state, action) => {
            state.status = status.FAILED;
            state.error = action.error.message;
        })

        .addCase(loadUserFromCookie.fulfilled, (state, action) => {
            state.data = action.data
        })
    }
});

export const { logout, setFunctionIds, setUserInfo } = authSlide.actions;
export default authSlide.reducer;