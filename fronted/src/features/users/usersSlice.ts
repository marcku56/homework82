import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { User, RegisterMutation } from '../../types';
import axiosApi from '../../axiosApi';

interface UsersState {
    user: User | null;
    registerLoading: boolean;
    registerError: string | null;
    loginLoading: boolean;
    loginError: string | null;
    logoutLoading: boolean;
}

const initialState: UsersState = {
    user: null,
    registerLoading: false,
    registerError: null,
    loginLoading: false,
    loginError: null,
    logoutLoading: false,
};

export const register = createAsyncThunk(
    'users/register',
    async (userData: RegisterMutation, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('username', userData.username);
            formData.append('password', userData.password);
            formData.append('displayName', userData.displayName);
            if (userData.avatar) {
                formData.append('avatar', userData.avatar);
            }

            const response = await axiosApi.post<User>('/users', formData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'users/login',
    async (userData: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axiosApi.post<{ message: string; user: User }>('/users/sessions', userData);
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Login failed');
        }
    }
);

export const googleLogin = createAsyncThunk(
    'users/googleLogin',
    async (credential: string, { rejectWithValue }) => {
        try {
            const response = await axiosApi.post<{ message: string; user: User }>('/users/google', { credential });
            return response.data.user;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Google login failed');
        }
    }
);

export const logout = createAsyncThunk(
    'users/logout',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            await axiosApi.delete('/users/sessions');
            dispatch(unsetUser());
        } catch (error: any) {
            dispatch(unsetUser());
            return rejectWithValue(error.response?.data?.error || 'Logout failed');
        }
    }
);

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        unsetUser: (state) => {
            state.user = null;
        },
        clearUserErrors: (state) => {
            state.registerError = null;
            state.loginError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.registerLoading = true;
                state.registerError = null;
            })
            .addCase(register.fulfilled, (state, { payload }) => {
                state.registerLoading = false;
                state.user = payload;
            })
            .addCase(register.rejected, (state, { payload }) => {
                state.registerLoading = false;
                state.registerError = payload as string;
            })
            .addCase(login.pending, (state) => {
                state.loginLoading = true;
                state.loginError = null;
            })
            .addCase(login.fulfilled, (state, { payload }) => {
                state.loginLoading = false;
                state.user = payload;
            })
            .addCase(login.rejected, (state, { payload }) => {
                state.loginLoading = false;
                state.loginError = payload as string;
            })
            .addCase(googleLogin.pending, (state) => {
                state.loginLoading = true;
                state.loginError = null;
            })
            .addCase(googleLogin.fulfilled, (state, { payload }) => {
                state.loginLoading = false;
                state.user = payload;
            })
            .addCase(googleLogin.rejected, (state, { payload }) => {
                state.loginLoading = false;
                state.loginError = payload as string;
            })
            .addCase(logout.pending, (state) => {
                state.logoutLoading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.logoutLoading = false;
            })
            .addCase(logout.rejected, (state) => {
                state.logoutLoading = false;
            });
    },
});

export const { unsetUser, clearUserErrors } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;