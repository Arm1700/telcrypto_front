import axios from 'axios';
import apiClient from '@/shared/api/client';

// Minimal mapping from base asset symbol to CoinGecko coin id
const BASE_TO_COINGECKO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
};

function toBase(symbol: string): string {
  // e.g. BTCUSDT -> BTC
  return symbol.replace(/USDT$/i, '').toUpperCase();
}

export async function fetchMarketCaps(symbols: string[]): Promise<Record<string, number>> {
  // Try backend cache first
  try {
    const { data } = await apiClient.get<{ success: boolean; data: Record<string, number> }>(
      '/api/market/caps'
    );
    if (data?.success && data?.data) return data.data;
  } catch (_) {}

  const bases = Array.from(new Set(symbols.map(toBase)));
  const ids = bases
    .map((b) => BASE_TO_COINGECKO_ID[b])
    .filter(Boolean)
    .join(',');

  if (!ids) return {};

  // https://www.coingecko.com/api/documentations/v3#/simple/get_simple_price
  const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
    params: {
      ids,
      vs_currencies: 'usd',
      include_market_cap: 'true',
    },
  });

  const result: Record<string, number> = {};
  for (const base of bases) {
    const id = BASE_TO_COINGECKO_ID[base];
    const cap = data?.[id]?.usd_market_cap;
    if (typeof cap === 'number') {
      result[base] = cap;
    }
  }
  return result;
}


