import axios from 'axios';
import { api } from './constant';
import type { Store } from '@reduxjs/toolkit';
import type { RootState } from './app/store';

const axiosApi = axios.create({
    baseURL: api,
});

export const addInterceptors = (store: Store<RootState>) => {
    axiosApi.interceptors.request.use((config) => {
        const token = store.getState().users.user?.token;
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    });
};

export default axiosApi;