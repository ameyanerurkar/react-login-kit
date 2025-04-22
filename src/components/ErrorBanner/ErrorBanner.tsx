import React, { useState, useEffect } from 'react';
import { useLoginConfig } from '../ConfigContextProvider/ConfigContextProvider';

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  autoHideDuration?: number;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message,
  onDismiss,
  autoHideDuration = 5000,
}) => {
  const [visible, setVisible] = useState(true);
  const config = useLoginConfig();
  const { primaryColor } = config.branding || {};

  useEffect(() => {
    if (autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, onDismiss]);

  if (!visible || !message) return null;

  return (
    <div
      role="alert"
      className="error-banner"
      style={{
        backgroundColor: '#FEE2E2',
        borderColor: '#EF4444',
        color: '#991B1B',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        borderRadius: '0.375rem',
        borderWidth: '1px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          if (onDismiss) onDismiss();
        }}
        aria-label="Dismiss error"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#991B1B',
          cursor: 'pointer',
          padding: '0.25rem',
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorBanner; 