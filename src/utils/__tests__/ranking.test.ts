/**
 * Ranking Utilities Tests
 * Feature: Top Position Display
 * Tests ranking calculation logic, including tie scenarios
 */

import { describe, it, expect } from 'vitest';
import {
  formatHashrate,
  calculateUserRanking,
  sortMinersByHashrate,
  shortenAddress,
  calculatePercentile,
} from '../ranking';
import type { MinerData } from '../../types/dashboard';

describe('formatHashrate', () => {
  it('should format hashrate with TH/s for terahashes', () => {
    expect(formatHashrate(2.5e12)).toBe('2.5 TH/s');
    expect(formatHashrate(1e12)).toBe('1 TH/s');
  });

  it('should format hashrate with GH/s for gigahashes', () => {
    expect(formatHashrate(5.3e9)).toBe('5.3 GH/s');
    expect(formatHashrate(1e9)).toBe('1 GH/s');
  });

  it('should format hashrate with MH/s for megahashes', () => {
    expect(formatHashrate(150e6)).toBe('150 MH/s');
    expect(formatHashrate(1e6)).toBe('1 MH/s');
  });

  it('should format hashrate with KH/s for kilohashes', () => {
    expect(formatHashrate(750e3)).toBe('750 KH/s');
    expect(formatHashrate(1e3)).toBe('1 KH/s');
  });

  it('should format hashrate with H/s for hashes', () => {
    expect(formatHashrate(500)).toBe('500 H/s');
    expect(formatHashrate(1)).toBe('1 H/s');
  });

  it('should handle zero hashrate', () => {
    expect(formatHashrate(0)).toBe('0 H/s');
  });

  it('should trim trailing zeros', () => {
    expect(formatHashrate(2e12)).toBe('2 TH/s');
    expect(formatHashrate(1.5e9)).toBe('1.5 GH/s');
  });
});

describe('calculateUserRanking', () => {
  const createMiner = (id: string, hashrate: number, isCurrentUser = false): MinerData => ({
    minerId: id,
    hashrate,
    isCurrentUser,
  });

  it('should calculate correct position for user', () => {
    const miners: MinerData[] = [
      createMiner('user1', 5000),
      createMiner('user2', 4000),
      createMiner('current', 3000, true),
      createMiner('user3', 2000),
    ];

    const ranking = calculateUserRanking(miners, 'current');

    expect(ranking).not.toBeNull();
    expect(ranking?.position).toBe(3);
    expect(ranking?.totalMiners).toBe(4);
    expect(ranking?.hashrate).toBe(3000);
  });

  it('should handle tie scenarios - same hashrate gets same position', () => {
    const miners: MinerData[] = [
      createMiner('user1', 5000),
      createMiner('user2', 4000),
      createMiner('user3', 4000), // Tied with user2
      createMiner('current', 4000, true), // Tied with user2 and user3
      createMiner('user4', 3000),
    ];

    const ranking = calculateUserRanking(miners, 'current');

    expect(ranking).not.toBeNull();
    // All three miners with 4000 hashrate should be at position 2
    expect(ranking?.position).toBe(2);
  });

  it('should rank top user as position 1', () => {
    const miners: MinerData[] = [
      createMiner('current', 10000, true),
      createMiner('user1', 5000),
      createMiner('user2', 3000),
    ];

    const ranking = calculateUserRanking(miners, 'current');

    expect(ranking).not.toBeNull();
    expect(ranking?.position).toBe(1);
    expect(ranking?.isTopTen).toBe(true);
  });

  it('should identify top 10 miners correctly', () => {
    const miners: MinerData[] = Array.from({ length: 15 }, (_, i) =>
      createMiner(
        i === 9 ? 'current' : `user${i}`,
        (15 - i) * 1000,
        i === 9 // Current user at position 10
      )
    );

    const ranking = calculateUserRanking(miners, 'current');

    expect(ranking).not.toBeNull();
    expect(ranking?.position).toBe(10);
    expect(ranking?.isTopTen).toBe(true);
  });

  it('should not mark position 11 as top ten', () => {
    const miners: MinerData[] = Array.from({ length: 15 }, (_, i) =>
      createMiner(
        i === 10 ? 'current' : `user${i}`,
        (15 - i) * 1000,
        i === 10 // Current user at position 11
      )
    );

    const ranking = calculateUserRanking(miners, 'current');

    expect(ranking).not.toBeNull();
    expect(ranking?.position).toBe(11);
    expect(ranking?.isTopTen).toBe(false);
  });

  it('should calculate network percentage correctly', () => {
    const miners: MinerData[] = [
      createMiner('user1', 5000),
      createMiner('current', 5000, true),
    ];

    const ranking = calculateUserRanking(miners, 'current');

    expect(ranking).not.toBeNull();
    expect(ranking?.networkPercentage).toBe(50); // 5000 / 10000 = 50%
  });

  it('should return null if user not found', () => {
    const miners: MinerData[] = [
      createMiner('user1', 5000),
      createMiner('user2', 3000),
    ];

    const ranking = calculateUserRanking(miners, 'nonexistent');

    expect(ranking).toBeNull();
  });

  it('should return null for empty miners array', () => {
    const ranking = calculateUserRanking([], 'current');
    expect(ranking).toBeNull();
  });

  it('should be case-insensitive for address matching', () => {
    const miners: MinerData[] = [
      createMiner('ABC123', 5000),
      createMiner('DEF456', 3000, true),
    ];

    const ranking = calculateUserRanking(miners, 'def456');

    expect(ranking).not.toBeNull();
    expect(ranking?.position).toBe(2);
  });

  it('should handle multiple ties correctly', () => {
    const miners: MinerData[] = [
      createMiner('user1', 10000),
      createMiner('user2', 5000),
      createMiner('user3', 5000),
      createMiner('user4', 5000),
      createMiner('current', 5000, true), // 4 miners tied at 5000
      createMiner('user5', 3000),
    ];

    const ranking = calculateUserRanking(miners, 'current');

    expect(ranking).not.toBeNull();
    expect(ranking?.position).toBe(2); // All tied miners at position 2
  });
});

describe('sortMinersByHashrate', () => {
  it('should sort miners by hashrate descending', () => {
    const miners: MinerData[] = [
      { minerId: 'user1', hashrate: 3000, isCurrentUser: false },
      { minerId: 'user2', hashrate: 5000, isCurrentUser: false },
      { minerId: 'user3', hashrate: 1000, isCurrentUser: false },
    ];

    const sorted = sortMinersByHashrate(miners);

    expect(sorted[0].hashrate).toBe(5000);
    expect(sorted[1].hashrate).toBe(3000);
    expect(sorted[2].hashrate).toBe(1000);
  });

  it('should not mutate original array', () => {
    const miners: MinerData[] = [
      { minerId: 'user1', hashrate: 3000, isCurrentUser: false },
      { minerId: 'user2', hashrate: 5000, isCurrentUser: false },
    ];

    const original = [...miners];
    sortMinersByHashrate(miners);

    expect(miners).toEqual(original);
  });
});

describe('shortenAddress', () => {
  it('should shorten long addresses', () => {
    const address = 'Gk3fY2zXw5Ht8Kp2Lq6Mr9Ns1Ot4Pu7Qv0Rw3Sx6Ty9Uz';
    expect(shortenAddress(address)).toBe('Gk3f...y9Uz');
  });

  it('should use custom prefix and suffix lengths', () => {
    const address = 'Gk3fY2zXw5Ht8Kp2Lq6Mr9Ns1Ot4Pu7Qv0Rw3Sx6Ty9Uz';
    expect(shortenAddress(address, 6, 6)).toBe('Gk3fY2...6Ty9Uz');
  });

  it('should return full address if too short', () => {
    const address = 'short';
    expect(shortenAddress(address)).toBe('short');
  });
});

describe('calculatePercentile', () => {
  it('should calculate percentile correctly', () => {
    expect(calculatePercentile(1, 100)).toBe(100); // Top 1%
    expect(calculatePercentile(50, 100)).toBe(51); // Middle
    expect(calculatePercentile(100, 100)).toBe(1); // Bottom
  });

  it('should handle edge cases', () => {
    expect(calculatePercentile(1, 1)).toBe(100); // Only miner
    expect(calculatePercentile(0, 100)).toBe(101); // Invalid position
  });

  it('should return 0 for totalMiners <= 0', () => {
    expect(calculatePercentile(1, 0)).toBe(0);
    expect(calculatePercentile(1, -5)).toBe(0);
  });
});
