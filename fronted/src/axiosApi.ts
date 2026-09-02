import axios from 'axios';
import { api } from './constant';
import { store } from './app/store';

const axiosApi = axios.create({
    baseURL: api,
});

axiosApi.interceptors.request.use((config) => {
    const token = store.getState().users.user?.token;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default axiosApi;