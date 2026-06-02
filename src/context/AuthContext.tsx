import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { UserAuthData } from '../services/userAuthService';

interface AuthContextType {
  user: UserAuthData | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: UserAuthData, token: string) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  openLoginModal: (onSuccess?: () => void) => void;
  closeLoginModal: () => void;
  loginSuccessCallback: (() => void) | null;
  updateUser: (userData: UserAuthData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'tobeque_user_token';
const USER_KEY = 'tobeque_user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage so session persists on refresh
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<UserAuthData | null>(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginSuccessCallback, setLoginSuccessCallback] = useState<(() => void) | null>(null);

  const login = useCallback((userData: UserAuthData, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem(TOKEN_KEY, userToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }, []);

  const openLoginModal = useCallback((onSuccess?: () => void) => {
    setLoginSuccessCallback(onSuccess ? () => onSuccess : null);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setLoginSuccessCallback(null);
  }, []);

  const updateUser = useCallback((userData: UserAuthData) => {
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginSuccessCallback,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
