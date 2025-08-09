import apiClient from '@/shared/api/client';
import { TelegramAuthData, AuthResponse, ApiResponse, User } from '@/shared/types';

export const authApi = {
  // Telegram authentication
  telegramAuth: async (authData: TelegramAuthData): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/api/auth/telegram', authData);
    return response.data.data!;
  },

  // Verify token
  verifyToken: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<{ user: User }>>('/api/auth/verify');
    return response.data.data!.user;
  }
};



