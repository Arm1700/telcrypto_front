import { useState, useEffect, useCallback } from 'react';
import { User, TelegramAuthData } from '@/shared/types';
import { authApi } from '../api/authApi';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (authData: TelegramAuthData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (authData: TelegramAuthData) => {
    try {
      const response = await authApi.telegramAuth(authData);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const verifyToken = useCallback(async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.verifyToken();
      setUser(userData);
    } catch (error) {
      console.error('Token verification failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};








