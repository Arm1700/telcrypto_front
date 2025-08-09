import React from 'react';
import styles from './CryptoTable.module.css';

export const CryptoTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <section className={styles.cryptoTableSection}>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className="skeleton skel-title" />
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
              {Array.from({ length: rows }).map((_, i) => (
                <tr key={i} className={styles.cryptoRow}>
                  <td className={styles.rankCell}><div className="skeleton skel-dot" /></td>
                  <td className={styles.nameCell}><div className="skeleton skel-text" /></td>
                  <td className={styles.priceCell}><div className="skeleton skel-text" /></td>
                  <td className={styles.changeCell}><div className="skeleton skel-text" /></td>
                  <td className={styles.marketCapCell}><div className="skeleton skel-text" /></td>
                  <td className={styles.volumeCell}><div className="skeleton skel-text" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};


