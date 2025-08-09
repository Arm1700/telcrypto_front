import apiClient from '@/shared/api/client';
import axios from 'axios';
import type { MarketStats, ApiResponse } from '@/shared/types';

// Fetch via backend (adds cache and avoids CORS rate limits)
export async function fetchGlobalMarketStats(): Promise<MarketStats> {
  try {
    const resp = await apiClient.get<ApiResponse<MarketStats>>('/api/market/global');
    const payload = resp.data;
    if (payload && payload.success && payload.data) {
      return payload.data;
    }
    throw new Error('Backend responded without data');
  } catch (err) {
    // Fallback: fetch from Binance directly (best-effort)
    try {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
      const { data } = await axios.get('https://api.binance.com/api/v3/ticker/24hr', {
        params: { symbols: JSON.stringify(symbols) },
      });
      const arr: any[] = Array.isArray(data) ? data : [];
      const map: Record<string, any> = {};
      for (const item of arr) {
        if (item?.symbol && typeof item.quoteVolume === 'string') map[item.symbol] = item;
      }
      const sum = (keys: string[]) => keys.reduce((acc, k) => acc + parseFloat(map[k]?.quoteVolume || '0'), 0);
      const totalVol = sum(symbols);
      const btcVol = parseFloat(map['BTCUSDT']?.quoteVolume || '0');
      const ethVol = parseFloat(map['ETHUSDT']?.quoteVolume || '0');
      const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(n);
      const pct = (part: number, total: number) => (total > 0 ? (part / total) * 100 : 0);
      return {
        totalMarketCap: 'N/A',
        totalVolume24h: formatCurrency(totalVol),
        btcDominance: `${pct(btcVol, totalVol).toFixed(1)}%`,
        ethDominance: `${pct(ethVol, totalVol).toFixed(1)}%`,
      };
    } catch (_) {
      // Last resort: return placeholder to avoid undefined
      return {
        totalMarketCap: 'N/A',
        totalVolume24h: '$0',
        btcDominance: '0.0%',
        ethDominance: '0.0%',
      };
    }
  }
}


