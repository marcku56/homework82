import axios from 'axios';
import {api} from "./constant.ts";

const axiosApi = axios.create({
    baseURL: api,
});

export default axiosApi;