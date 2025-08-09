import { useQuery } from '@tanstack/react-query';
import { fetchGlobalMarketStats } from '../api/marketApi';
import { MarketStats } from '@/shared/types';

export function useMarketStats() {
  return useQuery<MarketStats>({
    queryKey: ['marketStats', 'global'],
    queryFn: async () => await fetchGlobalMarketStats(),
    refetchInterval: 60_000, // обновлять раз в минуту
    staleTime: 30_000,
  });
}


