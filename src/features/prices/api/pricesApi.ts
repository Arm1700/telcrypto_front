import apiClient from '@/shared/api/client';
import { CryptoPrice, ApiResponse } from '@/shared/types';

export const pricesApi = {
  getLatestPrices: async (symbols?: string[]): Promise<CryptoPrice[]> => {
    const params = symbols ? { symbols: symbols.join(',') } : {};
    const response = await apiClient.get<ApiResponse<CryptoPrice[]>>('/api/prices/latest', { params });
    return response.data.data!;
  },

  getPriceHistory: async (symbol: string, limit: number = 100): Promise<CryptoPrice[]> => {
    const response = await apiClient.get<ApiResponse<CryptoPrice[]>>(`/api/prices/history/${symbol}`, {
      params: { limit }
    });
    return response.data.data!;
  },

  getWebSocketUrl: async (): Promise<{ wsUrl: string }> => {
    const response = await apiClient.get<ApiResponse<{ wsUrl: string }>>('/api/prices/ws-url');
    return response.data.data!;
  }
};



