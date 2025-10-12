/**
 * Number Formatting Utilities
 * Feature: Brokkr Finance Main Dashboard
 * All formatters use Intl.NumberFormat for internationalization
 */

import { DECIMALS, type FormattingOptions } from '../types/dashboard';

/**
 * Formats a number as USD currency with 2 decimal places
 * @param value - The numeric value to format
 * @param options - Optional formatting options
 * @returns Formatted string (e.g., "$1,234.56", "-$1,234.56")
 *
 * @example
 * formatUSD(1234.56) // "$1,234.56"
 * formatUSD(-1234.56) // "-$1,234.56"
 * formatUSD(0) // "$0.00"
 * formatUSD(1234.567) // "$1,234.57" (rounds to 2 decimals)
 * formatUSD(1234.56, { showPositiveSign: true }) // "+$1,234.56"
 */
export function formatUSD(value: number, options: FormattingOptions = {}): string {
  const {
    currency = '$',
    showPositiveSign = false,
    minimumFractionDigits = DECIMALS.USD,
    maximumFractionDigits = DECIMALS.USD,
  } = options;

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const formattedNumber = formatter.format(Math.abs(value));
  const sign = value < 0 ? '-' : showPositiveSign && value > 0 ? '+' : '';

  return `${sign}${currency}${formattedNumber}`;
}

/**
 * Formats a token amount with up to 6 decimals, trimming trailing zeros
 * @param value - The token amount to format
 * @param options - Optional formatting options
 * @returns Formatted string (e.g., "1,234.56", "0.000123", "1,234")
 *
 * @example
 * formatToken(1234.56) // "1,234.56"
 * formatToken(1234.560000) // "1,234.56" (trailing zeros trimmed)
 * formatToken(0.000123) // "0.000123"
 * formatToken(0.0001234567) // "0.000123" (max 6 decimals)
 * formatToken(1234) // "1,234"
 */
export function formatToken(value: number, options: FormattingOptions = {}): string {
  const { minimumFractionDigits = 0, maximumFractionDigits = DECIMALS.TOKEN_MAX } = options;

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return formatter.format(value);
}

/**
 * Formats large numbers with K/M notation for compact display
 * @param value - The numeric value to format
 * @param options - Optional formatting options
 * @returns Formatted string (e.g., "1.2K", "1.5M", "1.23B")
 *
 * @example
 * formatLargeNumber(1234) // "1.23K"
 * formatLargeNumber(1234567) // "1.23M"
 * formatLargeNumber(1234567890) // "1.23B"
 * formatLargeNumber(123) // "123" (no suffix for values < 1000)
 * formatLargeNumber(-1234567) // "-1.23M"
 */
export function formatLargeNumber(value: number, options: FormattingOptions = {}): string {
  const { minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  // No suffix for values less than 1000
  if (absValue < 1000) {
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits,
      maximumFractionDigits,
    });
    return sign + formatter.format(absValue);
  }

  // Determine suffix and divisor
  let suffix = '';
  let divisor = 1;

  if (absValue >= 1_000_000_000) {
    suffix = 'B';
    divisor = 1_000_000_000;
  } else if (absValue >= 1_000_000) {
    suffix = 'M';
    divisor = 1_000_000;
  } else if (absValue >= 1_000) {
    suffix = 'K';
    divisor = 1_000;
  }

  const scaledValue = absValue / divisor;

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return sign + formatter.format(scaledValue) + suffix;
}

/**
 * Formats a percentage value with 2 decimal places
 * @param value - The percentage value (e.g., 12.34 for 12.34%)
 * @param options - Optional formatting options
 * @returns Formatted string (e.g., "12.34%", "-12.34%", "+12.34%")
 *
 * @example
 * formatPercentage(12.34) // "12.34%"
 * formatPercentage(-12.34) // "-12.34%"
 * formatPercentage(12.34, { showPositiveSign: true }) // "+12.34%"
 * formatPercentage(150.123) // "150.12%" (rounds to 2 decimals)
 * formatPercentage(0) // "0.00%"
 */
export function formatPercentage(value: number, options: FormattingOptions = {}): string {
  const {
    showPositiveSign = false,
    minimumFractionDigits = DECIMALS.PERCENTAGE,
    maximumFractionDigits = DECIMALS.PERCENTAGE,
  } = options;

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  const formattedNumber = formatter.format(Math.abs(value));
  const sign = value < 0 ? '-' : showPositiveSign && value > 0 ? '+' : '';

  return `${sign}${formattedNumber}%`;
}
