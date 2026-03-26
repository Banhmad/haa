import { useContext, useCallback } from 'react';
import {
  NotificationContext,
  NotificationContextValue,
  NotificationType,
} from '../context/NotificationContext';

export interface UseNotificationReturn extends NotificationContextValue {
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

export const useNotification = (): UseNotificationReturn => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  const { addNotification } = ctx;

  const makeShorthand = useCallback(
    (type: NotificationType) =>
      (message: string, duration?: number) =>
        addNotification(type, message, duration),
    [addNotification],
  );

  return {
    ...ctx,
    showSuccess: makeShorthand('success'),
    showError: makeShorthand('error'),
    showWarning: makeShorthand('warning'),
    showInfo: makeShorthand('info'),
  };
};

export default useNotification;
