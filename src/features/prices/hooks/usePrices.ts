import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CryptoPrice } from '@/shared/types';
import { pricesApi } from '../api/pricesApi';
import { useWebSocket } from './useWebSocket';

export const usePrices = (symbols?: string[]) => {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const TARGET_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

  const mergePrices = useCallback((prev: CryptoPrice[], incoming: CryptoPrice[] | CryptoPrice) => {
    const list = Array.isArray(incoming) ? incoming : [incoming];
    const bySymbol = new Map<string, CryptoPrice>();
    prev.forEach(p => {
      if (TARGET_SYMBOLS.includes(p.symbol)) bySymbol.set(p.symbol, p);
    });
    list.forEach(p => {
      if (!p || !TARGET_SYMBOLS.includes(p.symbol)) return;
      const existing = bySymbol.get(p.symbol);
      if (!existing || (p.timestamp ?? 0) >= (existing.timestamp ?? 0)) {
        bySymbol.set(p.symbol, p);
      }
    });
    return TARGET_SYMBOLS.map(s => bySymbol.get(s)).filter(Boolean) as CryptoPrice[];
  }, []);

  const { data: latestPrices, isLoading, error, refetch } = useQuery({
    queryKey: ['prices', symbols],
    queryFn: () => pricesApi.getLatestPrices(symbols),
    refetchInterval: isConnected ? false : 30000,
    staleTime: 10000,
  });

  useEffect(() => {
    if (latestPrices && !isConnected) {
      const filtered = latestPrices.filter(p => TARGET_SYMBOLS.includes(p.symbol));
      setPrices(prev => mergePrices(prev, filtered));
    }
  }, [latestPrices, isConnected, mergePrices]);

  const bufferRef = useRef<Map<string, CryptoPrice>>(new Map());
  const updateScheduledRef = useRef(false);

  const updatePrice = useCallback((incoming: any) => {
    const newPrice: CryptoPrice = incoming?.data ?? incoming;
    if (!newPrice?.symbol) return;

    bufferRef.current.set(newPrice.symbol, newPrice);

    if (!updateScheduledRef.current) {
      updateScheduledRef.current = true;
      setTimeout(() => {
        setPrices(prev => mergePrices(prev, Array.from(bufferRef.current.values())));
        bufferRef.current.clear();
        updateScheduledRef.current = false;
      }, 500);
    }
  }, [mergePrices]);

  const handleInitialPrices = useCallback((initial: any[]) => {
    const normalized: CryptoPrice[] = (initial ?? []).map(p => (p?.data ?? p));
    setPrices(prev => mergePrices(prev, normalized));
  }, [mergePrices]);

  const handleWebSocketError = useCallback((error: string) => {
    console.error('WebSocket error:', error);
  }, []);

  const { isConnected: wsConnected } = useWebSocket(
    updatePrice,
    handleInitialPrices,
    handleWebSocketError
  );

  useEffect(() => {
    setIsConnected(wsConnected);
  }, [wsConnected]);

  return {
    prices,
    isLoading,
    error,
    refetch,
    updatePrice,
    isConnected
  };
};
