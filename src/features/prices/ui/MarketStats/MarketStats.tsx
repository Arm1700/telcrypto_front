import React from 'react';
import { MarketStats as MarketStatsType } from '../../../../shared/types';
import styles from './MarketStats.module.css';

interface MarketStatsProps {
  stats: MarketStatsType;
}

export const MarketStats: React.FC<MarketStatsProps> = ({ stats }) => {
  return (
    <section className={styles.marketStats}>
      <div className={styles.statsContainer}>
        <div className={styles.statsHeader}>
          <h2>Cryptocurrency Prices by Market Cap</h2>
          <p>
            The global cryptocurrency market cap today is {stats.totalMarketCap}, 
            a 1.0% change in the last 24 hours.
          </p>
        </div>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalMarketCap}</div>
            <div className={styles.statLabel}>Market Cap</div>
            <div className={styles.statChange}>1.0%</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalVolume24h}</div>
            <div className={styles.statLabel}>24h Trading Volume</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.btcDominance}</div>
            <div className={styles.statLabel}>BTC Dominance</div>
          </div>
          
              <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.ethDominance}</div>
            <div className={styles.statLabel}>ETH Dominance</div>
          </div>
        </div>
      </div>
    </section>
  );
};
