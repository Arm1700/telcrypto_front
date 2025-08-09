import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './TelegramLogin.module.css';
import { Send } from 'lucide-react';

type TelegramLoginProps = {
  variant?: 'button' | 'icon';
};

export const TelegramLogin: React.FC<TelegramLoginProps> = ({ variant = 'button' }) => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    (window as any).Telegram?.WebApp?.ready?.();
    (window as any).Telegram?.WebApp?.expand?.();
  }, []);

  const handleTelegramLogin = async () => {
    try {
      const { WebApp } = (window as any).Telegram || {};
      if (!WebApp) {
        const botUsername = (import.meta as any).env?.VITE_TELEGRAM_BOT_USERNAME;
        if (botUsername) {
          window.location.href = `https://t.me/${botUsername}`;
          return;
        }
        throw new Error('Telegram WebApp is not available. Open this app inside Telegram or set VITE_TELEGRAM_BOT_USERNAME for redirect.');
      }

      const initData = WebApp.initData;
      const user = WebApp.initDataUnsafe?.user;
      if (!user) {
        const botUsername = (import.meta as any).env?.VITE_TELEGRAM_BOT_USERNAME;
        if (botUsername && typeof WebApp.openTelegramLink === 'function') {
          WebApp.openTelegramLink(`https://t.me/${botUsername}?startapp=login`);
          return;
        }
        throw new Error('User data not available. Please open this app from your Telegram bot (WebApp).');
      }

      const params = new URLSearchParams(initData);
      await login({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url,
        auth_date: Number(params.get('auth_date')),
        hash: params.get('hash') || '',
        user: JSON.stringify(user),
        query_id: (WebApp as any).query_id,
      } as any);
      navigate('/dashboard', { replace: true });
    } catch (e: any) {
      const message = e?.response?.data?.error || e?.message || 'Login failed';
      alert(message);
    }
  };

  if (variant === 'icon') {
    return (
      <div
        className={styles.telegramLoginBtn}
        onClick={handleTelegramLogin}
        role="button"
        tabIndex={0}
        aria-label="Login with Telegram"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTelegramLogin();
          }
        }}
      >
        <Send size={22} color="#ffffff" aria-hidden="true" />
      </div>
    );
  }

  return (
    <button onClick={handleTelegramLogin} disabled={loading} className={styles.telegramButton}>
      {loading ? 'Logging in...' : 'Login with Telegram'}
    </button>
  );
};
