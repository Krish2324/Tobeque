import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
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
  
  // Custom Toast State for Authentication actions
  const [toast, setToast] = useState<{ message: string; type: 'login' | 'logout'; visible: boolean } | null>(null);

  const showToast = useCallback((message: string, type: 'login' | 'logout') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, visible: false } : null);
      setTimeout(() => setToast(null), 500); // Wait for fade-out animation
    }, 3500);
  }, []);

  const login = useCallback((userData: UserAuthData, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem(TOKEN_KEY, userToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    const name = userData.firstName || 'there';
    showToast(`Welcome back, ${name}! 🎉`, 'login');
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    showToast('Logged out successfully 👋', 'logout');
  }, [showToast]);

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
      
      {/* Animated Auth Toast */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 pointer-events-none flex items-center justify-center ${
          toast.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-10 scale-95'
        }`}>
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-2xl border border-white/20 dark:border-white/10 px-6 py-4 rounded-full flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              toast.type === 'login' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
            }`}>
              <span className="material-symbols-outlined text-[18px]">
                {toast.type === 'login' ? 'how_to_reg' : 'logout'}
              </span>
            </div>
            <span className="font-bold text-sm tracking-wide text-neutral-800 dark:text-neutral-200">
              {toast.message}
            </span>
          </div>
        </div>
      )}
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
