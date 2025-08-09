import { useEffect, useRef, useCallback } from 'react';
import { CryptoPrice } from '@/shared/types';

interface WebSocketMessage {
  type: 'initial_prices' | 'price_update';
  data: CryptoPrice | CryptoPrice[];
}

export const useWebSocket = (
  onPriceUpdate: (price: CryptoPrice) => void,
  onInitialPrices: (prices: CryptoPrice[]) => void,
  onError?: (error: string) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      const wsUrl = ((import.meta as any).env?.VITE_APP_WS_URL as string) || 'ws://localhost:8000';
      
      // Create WebSocket connection
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'initial_prices':
              if (Array.isArray(message.data)) {
                onInitialPrices(message.data);
              } else {
                // ignore
              }
              break;
            case 'price_update':
              if (!Array.isArray(message.data)) {
                onPriceUpdate(message.data);
              }
              break;
            default:
              // ignore
          }
        } catch (error) {
          // ignore
        }
      };

      wsRef.current.onerror = () => {
        onError?.('WebSocket connection error');
      };

      wsRef.current.onclose = () => {
        
        // Reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 5000);
      };
    } catch {
      onError?.('Failed to create WebSocket connection');
    }
  }, [onPriceUpdate, onInitialPrices, onError]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    disconnect
  };
};
