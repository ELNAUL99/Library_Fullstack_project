import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {UpdateUser, User, UserLogin, UserRegister} from "../../types/user";
import { addNotification } from "../../components/NotificationHandle";
import apiClient from "../../services/apiClient";
import { API_ENDPOINTS } from "../../config/api";

export const getUserWithToken = createAsyncThunk(
    "getUserWithToken",
    async (token: string | null) => {
        try {
            const user = await apiClient.get<User>(API_ENDPOINTS.USERS.PROFILE);
            return user;
        } catch (error: any) {
            return null;
        }
    }
);

export interface UpdateUserwToken{
    id: number,
    changes: UpdateUser,
    token: string
}

export const updateUserProfile = createAsyncThunk(
    "updateUserProfile",
    async(data:UpdateUserwToken) => {
        const {id, changes} = data;
        try {
            const res = await apiClient.put<User>(API_ENDPOINTS.USERS.UPDATE(id), changes);
            if (res){
                addNotification({notification: "Update successfully", duration: 2, type: "successful"})
            }
            return res;
        } catch (error: any) {
            addNotification({notification: `Update failed: ${error.message}`, duration: 2, type: "warning"})
            throw error;
        }
    }
)

export const login = createAsyncThunk(
    "login",
    async (credentials: UserLogin) => {
      try {
        addNotification({notification: "Logging in...", duration: 2, type: "successful"})
        const result = await apiClient.post<User>(API_ENDPOINTS.USERS.LOGIN, credentials);
        if (!result) {
          addNotification({notification: "Wrong username or password", duration: 2, type: "warning"})
          return;
        }
        localStorage.setItem("access_token", result.token)
        addNotification({notification: `Login successfully`, duration: 2, type: "successful"})
        return result;
      } catch (e:any) {
        addNotification({notification: `Something went wrong ${e.message}`, duration: 2, type: "warning"})
        throw e;
      }
    }
  )
  
export const register = createAsyncThunk(
    "register",
    async (form: UserRegister) => {
      try {
        const result = await apiClient.post<User>(API_ENDPOINTS.USERS.REGISTER, form);
        if (!result) {
          addNotification({notification: "Username or email already exist, please use another one", duration: 2, type: "warning"})
          return;
        }
        addNotification({notification: "Register successfully", duration: 2, type: "successful"})
        return result;
      } catch (e:any) {
        addNotification({notification: `Something went wrong ${e.message}`, duration: 2, type: "warning"})
        throw e;
      }   
    }
  )

const initialState: User | null = (() => {
    const data = localStorage.getItem('user');
    if(data){
        return JSON.parse(data);
    }else{
        return null;
    }
})()

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        logout(state){
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            localStorage.removeItem("userState");
            return (state = null);
        },
    },
    extraReducers: (build) => {
        build.addCase(getUserWithToken.fulfilled, (state,action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            return action.payload;
        });
        build.addCase(updateUserProfile.fulfilled, (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            return action.payload;
        });
    },
});

const userReducer = userSlice.reducer;
export default userReducer;
export const {logout} = userSlice.actions;