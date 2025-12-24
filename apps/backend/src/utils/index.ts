/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { addDays, format, isValid, parseISO, subDays } from 'date-fns';
/* eslint-disable @typescript-eslint/no-unused-vars */
export function excludePassword<T extends { password?: string }>(user: T) {
  const { password, ...rest } = user;
  return rest;
}

// Generate a strong password
export const generateStrongPassword = (length = 12) => {
  // Character sets
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  // Ensure minimum length is 8
  if (length < 8) {
    length = 8;
  }

  let password = '';

  // Guarantee at least one character from each required set
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));

  // Fill remaining positions with random characters from all sets
  const allCharacters = uppercase + lowercase + numbers;

  for (let i = 3; i < length; i++) {
    password += allCharacters.charAt(
      Math.floor(Math.random() * allCharacters.length),
    );
  }

  // Shuffle the password to randomize the order
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

// Generate Booking Reference Number

export const generateBookingReference = () => {
  const timestamp = Date.now().toString(36); // Convert timestamp to base-36
  const randomPart = Math.random().toString(36).substring(2, 8); // Random string part
  return `BR-${timestamp}-${randomPart}`.toUpperCase(); // Combine and format
};

// Calcualte Date Difference in Days

export const calculateTotalDays = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const localeMap = {
  usd: 'en-US',
  eur: 'de-DE',
  gbp: 'en-GB',
  jpy: 'ja-JP',
  cny: 'zh-CN',
  inr: 'en-IN',
  cad: 'en-CA',
  aud: 'en-AU',
  chf: 'de-CH',
  krw: 'ko-KR',
  rub: 'ru-RU',
  brl: 'pt-BR',
  mxn: 'es-MX',
  try: 'tr-TR',
  zar: 'en-ZA',
  sgd: 'en-SG',
  hkd: 'zh-HK',
  nzd: 'en-NZ',
  nok: 'nb-NO',
  sek: 'sv-SE',
  dkk: 'da-DK',
  thb: 'th-TH',
  bdt: 'bn-BD',
  pkr: 'ur-PK',
  aed: 'ar-AE',
  sar: 'ar-SA',
  php: 'en-PH',
  vnd: 'vi-VN',
  idr: 'id-ID',
  myr: 'ms-MY',
};

/**
 * Parses various currency formats and returns the lowercase currency code for Stripe
 * @param {string} currencyInput - Currency in various formats like "USD", "USD - US Dollar", "usd", etc.
 * @returns {string} - Lowercase currency code or 'usd' if not found
 */
export function parseCurrencyForStripe(currencyInput: string): string {
  if (!currencyInput || typeof currencyInput !== 'string') {
    return 'usd';
  }

  const cleanInput = currencyInput.trim().toLowerCase();

  const currencyMatch = cleanInput.match(/^([a-z]{3})/);

  if (!currencyMatch) {
    return 'usd';
  }

  const currencyCode = currencyMatch[1];

  if (currencyCode in localeMap) {
    return currencyCode;
  }

  return 'usd';
}

// Date formatting utility
export const DateFormatStyles = {
  short: 'M/d/yy', // 7/2/25
  medium: 'MMM d, yyyy', // Jul 2, 2025
  long: 'EEEE, MMMM d, yyyy', // Wednesday, July 2, 2025
  iso: 'yyyy-MM-dd', // 2025-07-02
  isoDateTime: "yyyy-MM-dd'T'HH:mm:ss'Z'", // 2025-07-02T00:00:00Z
  custom: 'EEE, MMM d, yyyy', // Wed, Jul 2, 2025
  full: 'EEEE, MMMM d, yyyy', // Wednesday, July 2, 2025
  numeric: 'MM/dd/yyyy', // 07/02/2025
  compact: 'MMdd', // 0702
  year: 'yyyy', // 2025
  month: 'MMM', // Jul
  day: 'd', // 2
  dayName: 'EEEE', // Wednesday
  shortDay: 'EEE', // Wed
  fullMonth: 'MMMM', // July
  monthYear: 'MMM yyyy', // Jul 2025
  dayMonth: 'd MMM', // 2 Jul
  time: 'HH:mm', // 00:00 (if time available)
  dateTime: 'MMM d, yyyy HH:mm', // Jul 2, 2025 00:00
  relative: 'MMM d', // Jul 2
  us: 'M/d/yyyy', // 7/2/2025
  uk: 'd/M/yyyy', // 2/7/2025
  monthDay: 'MMMM d', // July 2
  shortYear: 'yy', // 25
  quarter: 'QQQ yyyy', // Q3 2025
};

function formatDateWithOffset(
  date,
  style,
  dayCount,
  after = false,
  previous = false,
) {
  // Validate inputs
  if (!date || !dayCount || dayCount < 0) {
    return 'Invalid input';
  }

  // Parse the date if it's a string
  let baseDate;
  if (typeof date === 'string') {
    baseDate = parseISO(date);
  } else if (date instanceof Date) {
    baseDate = date;
  } else {
    return 'Invalid date format';
  }

  // Check if the parsed date is valid
  if (!isValid(baseDate)) {
    return 'Invalid date';
  }

  // Calculate the target date based on flags
  let targetDate;
  if (after) {
    targetDate = addDays(baseDate, dayCount);
  } else if (previous) {
    targetDate = subDays(baseDate, dayCount);
  } else {
    // Default to after if neither flag is specified
    targetDate = addDays(baseDate, dayCount);
  }

  // Get the format pattern
  const formatPattern = DateFormatStyles[style] || DateFormatStyles.medium;

  // Return formatted date
  return format(targetDate, formatPattern);
}

// Simple date formatter function
interface FormateDate {
  (date: string | Date, style: keyof typeof DateFormatStyles): string;
}

const formateDate: FormateDate = (date, style) => {
  const parsed = typeof date === 'string' ? parseISO(date) : date || new Date();
  const formatPattern = DateFormatStyles[style] || DateFormatStyles.medium;
  return format(parsed, formatPattern || 'MMM d, yyyy');
};

export { formatDateWithOffset, formateDate };
