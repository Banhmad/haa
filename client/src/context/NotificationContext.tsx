import React, { createContext, useCallback, useMemo, useState } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

let counter = 0;

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback(
    (type: NotificationType, message: string, duration = 5000) => {
      const id = `notification-${++counter}`;
      setNotifications((prev) => [...prev, { id, type, message, duration }]);
      if (duration > 0) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
      }
    },
    [],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({ notifications, addNotification, removeNotification }),
    [notifications, addNotification, removeNotification],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </NotificationContext.Provider>
  );
};

const typeLabels: Record<NotificationType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const NotificationContainer: React.FC<{
  notifications: Notification[];
  onRemove: (id: string) => void;
}> = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;
  return (
    <div style={containerStyle}>
      {notifications.map((n) => (
        <div key={n.id} style={{ ...notifStyle, ...typeStyles[n.type] }}>
          <span style={{ marginLeft: '8px' }}>{typeLabels[n.type]}</span>
          <span style={{ flex: 1 }}>{n.message}</span>
          <button onClick={() => onRemove(n.id)} style={closeBtnStyle}>×</button>
        </div>
      ))}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  top: '20px',
  left: '20px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  maxWidth: '360px',
};

const notifStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 16px',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  direction: 'rtl',
};

const typeStyles: Record<NotificationType, React.CSSProperties> = {
  success: { backgroundColor: '#48bb78' },
  error: { backgroundColor: '#fc8181' },
  warning: { backgroundColor: '#ed8936' },
  info: { backgroundColor: '#4299e1' },
};

const closeBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontSize: '18px',
  cursor: 'pointer',
  padding: '0 4px',
  lineHeight: 1,
};
