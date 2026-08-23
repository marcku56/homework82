import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { User } from '../../types';
import axiosApi from '../../axiosApi';

interface UsersState {
    user: User | null;
    registerLoading: boolean;
    registerError: string | null;
    loginLoading: boolean;
    loginError: string | null;
}

const initialState: UsersState = {
    user: null,
    registerLoading: false,
    registerError: null,
    loginLoading: false,
    loginError: null,
};

export const register = createAsyncThunk(
    'users/register',
    async (userData: { username: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axiosApi.post<User>('/users', userData);
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
            });
    },
});

export const { unsetUser, clearUserErrors } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;