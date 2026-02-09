import React, { createContext, useContext, useState, useEffect } from 'react';

const AUTH_STORAGE_KEY = 'nexus_ctf_user';

const testCredentials = { username: 'jayzo', password: '1234' };

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.username) setUser(parsed);
      } catch (_) {}
    }
  }, []);

  const login = (username, password) => {
    if (
      username === testCredentials.username &&
      password === testCredentials.password
    ) {
      const userData = { username };
      setUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
