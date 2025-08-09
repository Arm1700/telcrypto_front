import apiClient from '@/shared/api/client';
import { MarketStats } from '@/shared/types';

// Fetch via backend (adds cache and avoids CORS rate limits)
export async function fetchGlobalMarketStats(): Promise<MarketStats> {
  const { data } = await apiClient.get<{ success: boolean; data: MarketStats }>(
    '/api/market/global'
  );
  return data.data;
}


