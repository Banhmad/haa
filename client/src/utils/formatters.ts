type Locale = 'ar-SA' | 'en-US';

export const formatDate = (
  dateInput: string | Date,
  locale: Locale = 'ar-SA',
  options?: Intl.DateTimeFormatOptions,
): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat(locale, defaultOptions).format(date);
};

export const formatCurrency = (
  amount: number,
  currency = 'SAR',
  locale: Locale = 'ar-SA',
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (
  value: number,
  locale: Locale = 'ar-SA',
  options?: Intl.NumberFormatOptions,
): string => {
  return new Intl.NumberFormat(locale, options).format(value);
};

export const formatPercentage = (
  value: number,
  locale: Locale = 'ar-SA',
  fractionDigits = 2,
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value / 100);
};

export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + suffix;
};
