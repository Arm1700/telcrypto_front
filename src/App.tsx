import React, { useState, useEffect } from 'react';
import { Header } from './widgets/Header';
import { MarketStats, CryptoTable } from './widgets/Prices';
import { MarketStatsSkeleton } from './widgets/Prices/MarketStats/MarketStats.skeleton';
import { LoginModal } from './features/auth/ui';
import { CryptoPrice } from './shared/types';
import { useMarketStats } from '@/features/market/hooks/useMarketStats';
import './App.css';

function App() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data: marketStats } = useMarketStats();

  useEffect(() => {
    try {
      const cached = localStorage.getItem('latest_prices');
      if (cached) {
        const parsed: CryptoPrice[] = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setPrices(parsed);
        }
      }
    } catch {}

    const wsUrl = (import.meta as any).env?.VITE_APP_WS_URL || 'ws://localhost:8000';
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const merge = (current: CryptoPrice[], incoming: CryptoPrice[]) => {
          const bySymbol = new Map<string, CryptoPrice>();
          const put = (p: CryptoPrice) => {
            const prev = bySymbol.get(p.symbol);
            if (!prev || (p.timestamp ?? 0) >= (prev.timestamp ?? 0)) {
              bySymbol.set(p.symbol, p);
            }
          };
          current.forEach(put);
          incoming.forEach(put);
          const target = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
          return target.map(s => bySymbol.get(s)).filter(Boolean) as CryptoPrice[];
        };

        if (message?.type === 'initial_prices' && Array.isArray(message.data)) {
          const incoming = message.data as CryptoPrice[];
          setPrices(prev => {
            const merged = merge(prev, incoming);
            try { localStorage.setItem('latest_prices', JSON.stringify(merged)); } catch {}
            return merged;
          });
          return;
        }

        if (message?.type === 'price_update') {
          const data = (message.data ?? message) as CryptoPrice;
          setPrices(prev => {
            const merged = merge(prev, [data]);
            try { localStorage.setItem('latest_prices', JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
      } catch (error) {
        // swallow parse errors
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="app">
      <Header onLoginClick={handleLoginClick} isConnected={isConnected} />
      {marketStats ? <MarketStats stats={marketStats} /> : <MarketStatsSkeleton />}
      <CryptoTable prices={prices} />
      <LoginModal isOpen={showLoginModal} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
  