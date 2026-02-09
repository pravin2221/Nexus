import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AUTH_STORAGE_KEY = 'nexus_auth';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { team_name, token }
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.team_name && parsed?.token) setUser(parsed);
      } catch (_) {}
    }
    setIsValidating(false);
  }, []);

  const persist = (team_name, token) => {
    const userData = { team_name, token };
    setUser(userData);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
  };

  const login = async (team_name, password) => {
    const res = await api.login(team_name, password);
    if (!res.ok) return false;
    const token = res.data?.access_token;
    if (!token) return false;
    persist(team_name, token);
    return true;
  };

  const register = async (team_name, password) => {
    if (!team_name || !password)
      return { success: false, message: 'Missing fields' };
    const res = await api.signup(team_name, password);
    if (!res.ok) return { success: false, message: res.error };
    // Auto login after signup
    const didLogin = await login(team_name, password);
    if (!didLogin) return { success: false, message: 'Signup ok, login failed' };
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const validateSession = async () => {
    if (!user?.token) return false;
    const res = await api.getTeamActivity(user.token);
    if (!res.ok) {
      // 401/403 -> invalidate session
      logout();
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        validateSession,
        isLoggedIn: !!user,
        isValidating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
