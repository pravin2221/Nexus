import { createContext, useState, useEffect, useContext } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('nexus_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Decode token or fetch user profile could go here
            // For now, we assume if token exists, user is logged in
            setUser({ email: localStorage.getItem('nexus_email') || 'hacker' });
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const response = await client.post('/auth/login', { team_name : email, password });
            const { access_token } = response.data;

            localStorage.setItem('nexus_token', access_token);
            localStorage.setItem('nexus_email', email);

            setToken(access_token);
            setUser({ email });
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                error: error.response?.data?.error || 'Connection failed'
            };
        }
    };

    const signup = async (email, password) => {
        try {
            await client.post('/auth/signup', { team_name : email, password });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('nexus_token');
        localStorage.removeItem('nexus_email');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
