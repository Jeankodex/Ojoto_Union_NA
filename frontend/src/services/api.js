import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.error || error.message || 'An error occurred';
        
        // Auto logout on 401
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        return Promise.reject(message);
    }
);

// Auth service
export const authService = {
    register: async (userData) => {
        return await api.post('/auth/register', userData);
    },
    
    login: async (credentials) => {
        return await api.post('/auth/login', credentials);
    },
    
    getCurrentUser: async () => {
        return await api.get('/auth/me');
    },
    
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
    
    getToken: () => {
        return localStorage.getItem('token');
    },
    
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

export default api;