import React from 'react';
import { TelegramLogin } from '../../components/TelegramLogin';
import styles from './LoginModal.module.css';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h2>Welcome to Crypto Tracker</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </header>

        <section className={styles.modalBody}>
          <p>Login with your Telegram account to get personalized insights and track your portfolio.</p>

          <div className={styles.loginOptions}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <TelegramLogin variant="icon" />
            </div>
          </div>
        </section>

        <footer className={styles.modalFooter}>
          <p className={styles.terms}>
            By continuing, you acknowledge that you've read and agree to our{' '}
            <a href="#" className={styles.link}>Terms of Service</a> and{' '}
            <a href="#" className={styles.link}>Privacy Policy</a>.
          </p>
        </footer>
      </div>
    </div>
  );
};
