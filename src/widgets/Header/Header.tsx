import React from 'react';
import styles from './Header.module.css';
import { TelegramLogin } from '@/features/auth/components/TelegramLogin';

interface HeaderProps {
  onLoginClick?: () => void;
  isConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, isConnected }) => {
  // onLoginClick is kept for backward compatibility, but not used now

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <h1>Crypto Tracker</h1>
          </div>
        </div>
        
        <div className={styles.headerRight}>
          <div className={styles.connectionStatus}>
            <div className={`${styles.statusDot} ${isConnected ? styles.connected : styles.disconnected}`}></div>
            <span className={styles.statusText}>
              {isConnected ? 'Live Data' : 'Static Data'}
            </span>
          </div>
          <div className={styles.authSection}>
            <TelegramLogin variant="icon" />
          </div>
        </div>
      </div>
    </header>
  );
};



