import apiClient from '@/shared/api/client';
import { CryptoPrice, ApiResponse } from '@/shared/types';

export const pricesApi = {
  // Get latest prices
  getLatestPrices: async (symbols?: string[]): Promise<CryptoPrice[]> => {
    const params = symbols ? { symbols: symbols.join(',') } : {};
    console.log('pricesApi: requesting prices for symbols:', symbols);
    const response = await apiClient.get<ApiResponse<CryptoPrice[]>>('/api/prices/latest', { params });
    console.log('pricesApi: received response:', response.data);
    return response.data.data!;
  },

  // Get price history
  getPriceHistory: async (symbol: string, limit: number = 100): Promise<CryptoPrice[]> => {
    const response = await apiClient.get<ApiResponse<CryptoPrice[]>>(`/api/prices/history/${symbol}`, {
      params: { limit }
    });
    return response.data.data!;
  },

  // Get WebSocket URL
  getWebSocketUrl: async (): Promise<{ wsUrl: string }> => {
    const response = await apiClient.get<ApiResponse<{ wsUrl: string }>>('/api/prices/ws-url');
    return response.data.data!;
  }
};



