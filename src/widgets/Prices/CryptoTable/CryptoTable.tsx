import React from 'react';
  import { CryptoPrice } from '../../../../shared/types';
import styles from './CryptoTable.module.css';

interface CryptoTableProps {
  prices: CryptoPrice[];
  isConnected?: boolean;
}

const targetSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];

export const CryptoTable: React.FC<CryptoTableProps> = ({ prices, isConnected = false }) => {
  const safePrices = prices.map(p => (p && (p as any).data ? (p as any).data : p));

  const stableMapRef = React.useRef<Record<string, CryptoPrice | undefined>>({});

  targetSymbols.forEach((symbol) => {
    const latest = safePrices
      .filter(p => p.symbol === symbol)
      .reduce((acc: CryptoPrice | undefined, cur: CryptoPrice) => {
        if (!acc) return cur;
        return (cur.timestamp ?? 0) > (acc.timestamp ?? 0) ? cur : acc;
      }, undefined);

    if (latest) {
      const prev = stableMapRef.current[symbol];
      if (!prev || (latest.timestamp ?? 0) >= (prev.timestamp ?? 0)) {
        stableMapRef.current[symbol] = latest;
      }
    }
  });

  const orderedRows = targetSymbols.map((symbol, idx) => {
    const item = stableMapRef.current[symbol];
    return item
      ? { ...item, rank: idx + 1 }
      : { symbol, price: null, change24h: null, volume24h: null, marketCap: null, rank: idx + 1 } as any;
  });

  const formatPrice = (price?: number | null) => {
    if (price === null || price === undefined || isNaN(price)) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(price);
  };

  const formatPercent = (p?: number | null) => {
    if (p === null || p === undefined || isNaN(p)) return '0.00%';
    return (p > 0 ? '+' : '') + p.toFixed(2) + '%';
  };

  const formatVolume = (v?: number | null) => {
    if (!v || isNaN(v)) return '$0';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(v);
  };

  const getChangeClass = (change?: number | null) => {
    if (!change || isNaN(change)) return '';
    return change > 0 ? styles.positive : styles.negative;
  };

  return (
    <section className={styles.cryptoTableSection}>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Top Cryptocurrencies</h3>
          <div className={styles.tableControls}>
            <div className={styles.connectionStatus}>
              <span className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`}></span>
              <span className={styles.statusText}>{isConnected ? 'Live Data' : 'Static Data'}</span>
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.cryptoTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>24h %</th>
                <th>Market Cap</th>
                <th>Volume(24h)</th>
              </tr>
            </thead>
            <tbody>
              {orderedRows.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                    {isConnected ? 'Waiting for price data...' : 'No price data available'}
                  </td>
                </tr>
              ) : (
                orderedRows.map((price, idx) => (
                  <tr key={(price as any).symbol ?? idx} className={styles.cryptoRow}>
                    <td className={styles.rankCell}>{(price as any).rank}</td>
                    <td className={styles.nameCell}>{(price as any).symbol.replace('USDT', '')}</td>
                    <td className={styles.priceCell}>{formatPrice((price as any).price)}</td>
                    <td className={`${styles.changeCell} ${getChangeClass((price as any).change24h)}`}>{formatPercent((price as any).change24h)}</td>
                    <td className={styles.marketCapCell}>{formatPrice((price as any).marketCap)}</td>
                    <td className={styles.volumeCell}>{formatVolume((price as any).volume24h)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};



