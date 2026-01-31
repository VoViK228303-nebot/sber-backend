/**
 * Format amount as currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'RUB',
  locale: string = 'ru-RU'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format number with thousands separator
 */
export function formatNumber(
  num: number,
  decimals: number = 2,
  locale: string = 'ru-RU'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Mask card number (show only last 4 digits)
 */
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  if (cleaned.length < 4) return cleaned;
  return `**** ${cleaned.slice(-4)}`;
}

/**
 * Mask account number (show only last 4 digits)
 */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length < 4) return accountNumber;
  return `**** ${accountNumber.slice(-4)}`;
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string,
  locale: string = 'ru-RU',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat(locale, options || defaultOptions).format(d);
}

/**
 * Format date and time
 */
export function formatDateTime(
  date: Date | string,
  locale: string = 'ru-RU'
): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'ru-RU'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return rtf.format(-diffInMinutes, 'minute');
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return rtf.format(-diffInHours, 'hour');
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return rtf.format(-diffInDays, 'day');
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return rtf.format(-diffInMonths, 'month');
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return rtf.format(-diffInYears, 'year');
}

/**
 * Generate account number
 */
export function generateAccountNumber(): string {
  // Russian bank account format: 40817 + currency code + 8 digits
  const prefix = '40817810';
  const random = Math.floor(Math.random() * 100000000)
    .toString()
    .padStart(8, '0');
  return `${prefix}${random}`;
}

/**
 * Generate card number (test format)
 */
export function generateCardNumber(): string {
  // Test card number starting with 4276 (Visa-like)
  const prefix = '4276';
  const random = Math.floor(Math.random() * 1000000000000)
    .toString()
    .padStart(12, '0');
  return `${prefix}${random}`;
}

/**
 * Generate expiry date (3 years from now)
 */
export function generateExpiryDate(): string {
  const now = new Date();
  const expiry = new Date(now.getFullYear() + 3, now.getMonth());
  const month = (expiry.getMonth() + 1).toString().padStart(2, '0');
  const year = expiry.getFullYear().toString().slice(-2);
  return `${month}/${year}`;
}

/**
 * Generate CVV
 */
export function generateCVV(): string {
  return Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}
