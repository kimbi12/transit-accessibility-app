import axios from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        if (__DEV__) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data ? config.data : '');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        if (__DEV__) {
            console.log(`[API Response] ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        if (__DEV__) {
            console.error(`[API Error] ${error.message} ${error.config?.url}`, error.response?.data);
        }
        return Promise.reject(error);
    }
);
