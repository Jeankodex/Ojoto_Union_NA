
//AuthContext.jsx//

import React, { createContext, useState, useContext } from 'react';
import api from '../services/api'; // Add this import

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await api.auth.register(userData);
            
            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            }

            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await api.auth.login(credentials);
            
            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
            }

            return data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    const updateUser = (userData) => {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const value = {
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateUser,
        isAuthenticated: !!localStorage.getItem('token')
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};