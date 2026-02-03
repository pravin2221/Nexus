import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the JWT token
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('nexus_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors (expired token)
client.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear token and redirect to login if 401 occurs (except on login page)
            if (!window.location.pathname.includes('/login')) {
                localStorage.removeItem('nexus_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;
