import React from 'react';
import styles from './MarketStats.module.css';

export const MarketStatsSkeleton: React.FC = () => {
  return (
    <section className={styles.marketStats}>
      <div className={styles.statsContainer}>
        <div className={styles.statsHeader}>
          <div className={`${styles.skeleton} ${styles.skelTitle}`} />
          <div className={`${styles.skeleton} ${styles.skelSubtitle}`} />
        </div>

        <div className={styles.statsGrid}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={styles.statCard}>
              <div className={`${styles.skeleton} ${styles.skelValue}`} />
              <div className={`${styles.skeleton} ${styles.skelLabel}`} />
              <div className={`${styles.skeleton} ${styles.skelChip}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};




