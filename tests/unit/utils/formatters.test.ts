/**
 * Unit Tests: Formatters
 * Tests all number formatting functions for correctness
 */

import { describe, it, expect } from 'vitest';
import {
  formatUSD,
  formatToken,
  formatLargeNumber,
  formatPercentage,
} from '../../../src/utils/formatters';

describe('formatUSD', () => {
  it('should format positive numbers with 2 decimals', () => {
    expect(formatUSD(1234.56)).toBe('$1,234.56');
    expect(formatUSD(0.01)).toBe('$0.01');
    expect(formatUSD(999999.99)).toBe('$999,999.99');
  });

  it('should format negative numbers correctly', () => {
    expect(formatUSD(-1234.56)).toBe('-$1,234.56');
    expect(formatUSD(-0.01)).toBe('-$0.01');
    expect(formatUSD(-999999.99)).toBe('-$999,999.99');
  });

  it('should format zero correctly', () => {
    expect(formatUSD(0)).toBe('$0.00');
    expect(formatUSD(-0)).toBe('$0.00');
  });

  it('should round to 2 decimal places', () => {
    expect(formatUSD(1234.567)).toBe('$1,234.57');
    expect(formatUSD(1234.564)).toBe('$1,234.56');
    expect(formatUSD(1234.999)).toBe('$1,235.00');
  });

  it('should handle very large numbers', () => {
    expect(formatUSD(1234567890.12)).toBe('$1,234,567,890.12');
    expect(formatUSD(999999999999.99)).toBe('$999,999,999,999.99');
  });

  it('should handle very small numbers', () => {
    expect(formatUSD(0.001)).toBe('$0.00');
    expect(formatUSD(0.005)).toBe('$0.01');
  });

  it('should show positive sign when requested', () => {
    expect(formatUSD(1234.56, { showPositiveSign: true })).toBe('+$1,234.56');
    expect(formatUSD(0, { showPositiveSign: true })).toBe('$0.00');
    expect(formatUSD(-1234.56, { showPositiveSign: true })).toBe('-$1,234.56');
  });

  it('should support custom currency symbol', () => {
    expect(formatUSD(1234.56, { currency: '€' })).toBe('€1,234.56');
    expect(formatUSD(1234.56, { currency: 'SOL ' })).toBe('SOL 1,234.56');
  });

  it('should support custom decimal precision', () => {
    expect(formatUSD(1234.56789, { minimumFractionDigits: 4, maximumFractionDigits: 4 })).toBe('$1,234.5679');
    expect(formatUSD(1234.5, { minimumFractionDigits: 0, maximumFractionDigits: 0 })).toBe('$1,235');
  });
});

describe('formatToken', () => {
  it('should format tokens with up to 6 decimals', () => {
    expect(formatToken(1234.56)).toBe('1,234.56');
    expect(formatToken(0.123456)).toBe('0.123456');
    expect(formatToken(0.000123)).toBe('0.000123');
  });

  it('should trim trailing zeros', () => {
    expect(formatToken(1234.560000)).toBe('1,234.56');
    expect(formatToken(1234.100000)).toBe('1,234.1');
    expect(formatToken(1234.000000)).toBe('1,234');
  });

  it('should handle integers without decimals', () => {
    expect(formatToken(1234)).toBe('1,234');
    expect(formatToken(1000000)).toBe('1,000,000');
  });

  it('should truncate to max 6 decimals', () => {
    expect(formatToken(0.1234567890)).toBe('0.123457');
    expect(formatToken(0.0000001234)).toBe('0');
  });

  it('should handle very small token amounts', () => {
    expect(formatToken(0.000001)).toBe('0.000001');
    expect(formatToken(0.0000001)).toBe('0');
  });

  it('should handle very large token amounts', () => {
    expect(formatToken(1234567890.123456)).toBe('1,234,567,890.123456');
    // Note: Very large numbers lose precision in JavaScript (floating point)
    expect(formatToken(999999999999.999999)).toBe('1,000,000,000,000');
  });

  it('should handle zero correctly', () => {
    expect(formatToken(0)).toBe('0');
    expect(formatToken(0.000000)).toBe('0');
  });

  it('should support custom decimal precision', () => {
    expect(formatToken(1234.56789, { maximumFractionDigits: 2 })).toBe('1,234.57');
    expect(formatToken(1234.56789, { maximumFractionDigits: 8 })).toBe('1,234.56789');
  });
});

describe('formatLargeNumber', () => {
  it('should not use suffix for numbers < 1000', () => {
    expect(formatLargeNumber(0)).toBe('0');
    expect(formatLargeNumber(123)).toBe('123');
    expect(formatLargeNumber(999)).toBe('999');
  });

  it('should format thousands with K suffix', () => {
    expect(formatLargeNumber(1000)).toBe('1K');
    expect(formatLargeNumber(1234)).toBe('1.23K');
    expect(formatLargeNumber(9999)).toBe('10K');
    // Numbers still formatted with commas even with suffix
    expect(formatLargeNumber(999999)).toBe('1,000K');
  });

  it('should format millions with M suffix', () => {
    expect(formatLargeNumber(1000000)).toBe('1M');
    expect(formatLargeNumber(1234567)).toBe('1.23M');
    expect(formatLargeNumber(9999999)).toBe('10M');
    // Numbers still formatted with commas even with suffix
    expect(formatLargeNumber(999999999)).toBe('1,000M');
  });

  it('should format billions with B suffix', () => {
    expect(formatLargeNumber(1000000000)).toBe('1B');
    expect(formatLargeNumber(1234567890)).toBe('1.23B');
    expect(formatLargeNumber(9999999999)).toBe('10B');
  });

  it('should handle negative numbers', () => {
    expect(formatLargeNumber(-1234)).toBe('-1.23K');
    expect(formatLargeNumber(-1234567)).toBe('-1.23M');
    expect(formatLargeNumber(-1234567890)).toBe('-1.23B');
  });

  it('should round to 2 decimals by default', () => {
    expect(formatLargeNumber(1234.567)).toBe('1.23K');
    expect(formatLargeNumber(1234567.89)).toBe('1.23M');
  });

  it('should support custom decimal precision', () => {
    expect(formatLargeNumber(1234567, { maximumFractionDigits: 3 })).toBe('1.235M');
    expect(formatLargeNumber(1234567, { maximumFractionDigits: 0 })).toBe('1M');
  });

  it('should handle edge cases', () => {
    // 999.99 rounds to 1000, but still < 1000 threshold, so no suffix
    expect(formatLargeNumber(999.99)).toBe('999.99');
    expect(formatLargeNumber(999499)).toBe('999.5K');
    expect(formatLargeNumber(999999999.99)).toBe('1,000M');
  });
});

describe('formatPercentage', () => {
  it('should format positive percentages with 2 decimals', () => {
    expect(formatPercentage(12.34)).toBe('12.34%');
    expect(formatPercentage(0.01)).toBe('0.01%');
    expect(formatPercentage(150.12)).toBe('150.12%');
  });

  it('should format negative percentages', () => {
    expect(formatPercentage(-12.34)).toBe('-12.34%');
    expect(formatPercentage(-0.01)).toBe('-0.01%');
    expect(formatPercentage(-150.12)).toBe('-150.12%');
  });

  it('should format zero correctly', () => {
    expect(formatPercentage(0)).toBe('0.00%');
    expect(formatPercentage(-0)).toBe('0.00%');
  });

  it('should round to 2 decimal places', () => {
    expect(formatPercentage(12.345)).toBe('12.35%');
    expect(formatPercentage(12.344)).toBe('12.34%');
    expect(formatPercentage(99.999)).toBe('100.00%');
  });

  it('should show positive sign when requested', () => {
    expect(formatPercentage(12.34, { showPositiveSign: true })).toBe('+12.34%');
    expect(formatPercentage(0, { showPositiveSign: true })).toBe('0.00%');
    expect(formatPercentage(-12.34, { showPositiveSign: true })).toBe('-12.34%');
  });

  it('should handle very large percentages', () => {
    expect(formatPercentage(1234.56)).toBe('1,234.56%');
    expect(formatPercentage(999999.99)).toBe('999,999.99%');
  });

  it('should handle very small percentages', () => {
    expect(formatPercentage(0.001)).toBe('0.00%');
    expect(formatPercentage(0.005)).toBe('0.01%');
  });

  it('should support custom decimal precision', () => {
    expect(formatPercentage(12.34567, { minimumFractionDigits: 4, maximumFractionDigits: 4 })).toBe('12.3457%');
    expect(formatPercentage(12.34567, { minimumFractionDigits: 0, maximumFractionDigits: 0 })).toBe('12%');
  });
});
