export interface User {
  id: number;
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
}

export interface CryptoPrice {
  symbol: string;
  price: number;
  timestamp: number;
  change24h?: number;
  volume24h?: number;
  marketCap?: number;
  rank?: number;
}

export interface MarketStats {
  totalMarketCap: string;
  totalVolume24h: string;
  btcDominance: string;
  ethDominance: string;
}

export interface TrendingCoin {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

export interface TelegramAuthData {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
  user?: string; // JSON string of Telegram WebApp user
  query_id?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}



