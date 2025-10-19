/**
 * Ranking Utilities Tests - Foundation Layer
 * Feature: Top Position Ranking
 * Tasks: T012, T013, T014, T015
 *
 * Tests all core ranking utilities that ALL user stories depend on.
 * Must pass before any user story implementation can begin.
 */

import { describe, it, expect } from 'vitest';
import {
  formatHashrate,
  formatNetworkShare,
  calculateRankings,
  calculateUserRanking,
} from '../ranking';
import { HashrateUnit } from '../../types/dashboard';
import type { MinerData, MiningRankingData } from '../../types/dashboard';

// ============================================================================
// T012: Test formatHashrate() with all unit thresholds
// ============================================================================

describe('formatHashrate', () => {
  describe('unit threshold selection', () => {
    it('should select TH/s for values >= 1 TH/s', () => {
      const result = formatHashrate(4.5e12); // 4.5 TH/s
      expect(result.value).toBe(4.5);
      expect(result.unit).toBe(HashrateUnit.TH_S);
    });

    it('should select GH/s for values >= 1 GH/s', () => {
      const result = formatHashrate(3.2e9); // 3.2 GH/s
      expect(result.value).toBe(3.2);
      expect(result.unit).toBe(HashrateUnit.GH_S);
    });

    it('should select MH/s for values >= 1 MH/s', () => {
      const result = formatHashrate(5.5e6); // 5.5 MH/s
      expect(result.value).toBe(5.5);
      expect(result.unit).toBe(HashrateUnit.MH_S);
    });

    it('should select KH/s for values >= 1 KH/s', () => {
      const result = formatHashrate(750e3); // 750 KH/s
      expect(result.value).toBe(750);
      expect(result.unit).toBe(HashrateUnit.KH_S);
    });

    it('should select H/s for values < 1 KH/s', () => {
      const result = formatHashrate(500); // 500 H/s
      expect(result.value).toBe(500);
      expect(result.unit).toBe(HashrateUnit.H_S);
    });
  });

  describe('edge cases at unit boundaries', () => {
    it('should use TH/s exactly at 1 TH/s threshold', () => {
      const result = formatHashrate(1e12);
      expect(result.value).toBe(1);
      expect(result.unit).toBe(HashrateUnit.TH_S);
    });

    it('should use GH/s just below TH/s threshold', () => {
      const result = formatHashrate(999.99e9); // 999.99 GH/s
      expect(result.value).toBeCloseTo(999.99);
      expect(result.unit).toBe(HashrateUnit.GH_S);
    });

    it('should use GH/s exactly at 1 GH/s threshold', () => {
      const result = formatHashrate(1e9);
      expect(result.value).toBe(1);
      expect(result.unit).toBe(HashrateUnit.GH_S);
    });

    it('should use MH/s just below GH/s threshold', () => {
      const result = formatHashrate(999e6); // 999 MH/s
      expect(result.value).toBe(999);
      expect(result.unit).toBe(HashrateUnit.MH_S);
    });

    it('should use MH/s exactly at 1 MH/s threshold', () => {
      const result = formatHashrate(1e6);
      expect(result.value).toBe(1);
      expect(result.unit).toBe(HashrateUnit.MH_S);
    });

    it('should use KH/s just below MH/s threshold', () => {
      const result = formatHashrate(999e3); // 999 KH/s
      expect(result.value).toBe(999);
      expect(result.unit).toBe(HashrateUnit.KH_S);
    });

    it('should use KH/s exactly at 1 KH/s threshold', () => {
      const result = formatHashrate(1e3);
      expect(result.value).toBe(1);
      expect(result.unit).toBe(HashrateUnit.KH_S);
    });

    it('should use H/s just below KH/s threshold', () => {
      const result = formatHashrate(999); // 999 H/s
      expect(result.value).toBe(999);
      expect(result.unit).toBe(HashrateUnit.H_S);
    });
  });

  describe('zero and very small hashrate', () => {
    it('should handle zero hashrate', () => {
      const result = formatHashrate(0);
      expect(result.value).toBe(0);
      expect(result.unit).toBe(HashrateUnit.H_S);
    });

    it('should handle very small hashrate (1 H/s)', () => {
      const result = formatHashrate(1);
      expect(result.value).toBe(1);
      expect(result.unit).toBe(HashrateUnit.H_S);
    });

    it('should handle fractional hashes', () => {
      const result = formatHashrate(0.5);
      expect(result.value).toBe(0.5);
      expect(result.unit).toBe(HashrateUnit.H_S);
    });
  });

  describe('realistic mining scenarios', () => {
    it('should format large mining pool hashrate', () => {
      const result = formatHashrate(8.5e12); // 8.5 TH/s
      expect(result.value).toBe(8.5);
      expect(result.unit).toBe(HashrateUnit.TH_S);
    });

    it('should format medium miner hashrate', () => {
      const result = formatHashrate(4.2e9); // 4.2 GH/s
      expect(result.value).toBe(4.2);
      expect(result.unit).toBe(HashrateUnit.GH_S);
    });

    it('should format small miner hashrate (below 1 MH/s threshold)', () => {
      const result = formatHashrate(500000); // 500 KH/s
      expect(result.value).toBe(500);
      expect(result.unit).toBe(HashrateUnit.KH_S);
    });
  });
});

// ============================================================================
// T013: Test formatNetworkShare() with dynamic precision
// ============================================================================

describe('formatNetworkShare', () => {
  describe('dynamic decimal precision (≥1% = 2 decimals, <1% = 4 decimals)', () => {
    it('should use 2 decimals for shares >= 1%', () => {
      expect(formatNetworkShare(2.3456)).toBe('2.35%');
      expect(formatNetworkShare(15.5678)).toBe('15.57%');
      expect(formatNetworkShare(100)).toBe('100.00%');
    });

    it('should use 4 decimals for shares < 1%', () => {
      expect(formatNetworkShare(0.4237)).toBe('0.4237%');
      expect(formatNetworkShare(0.0567)).toBe('0.0567%');
      expect(formatNetworkShare(0.9999)).toBe('0.9999%');
    });

    it('should use 2 decimals exactly at 1% boundary', () => {
      expect(formatNetworkShare(1.0)).toBe('1.00%');
      expect(formatNetworkShare(1.0001)).toBe('1.00%');
    });
  });

  describe('boundary at 0.995% (rounding behavior)', () => {
    it('should display 0.995% with 4 decimals (stays <1%)', () => {
      expect(formatNetworkShare(0.995)).toBe('0.9950%');
    });

    it('should display 0.994% with 4 decimals', () => {
      expect(formatNetworkShare(0.994)).toBe('0.9940%');
    });

    it('should display 0.996% with 4 decimals', () => {
      expect(formatNetworkShare(0.996)).toBe('0.9960%');
    });
  });

  describe('very small values', () => {
    it('should display 0.0001% with 4 decimals', () => {
      expect(formatNetworkShare(0.0001)).toBe('0.0001%');
    });

    it('should display 0.00005% with 4 decimals (rounds to 0.0001%)', () => {
      expect(formatNetworkShare(0.00005)).toBe('0.0001%');
    });

    it('should display 0.00001% with 4 decimals (rounds to 0.0000%)', () => {
      expect(formatNetworkShare(0.00001)).toBe('0.0000%');
    });
  });

  describe('large values', () => {
    it('should display 15.5% with 2 decimals', () => {
      expect(formatNetworkShare(15.5)).toBe('15.50%');
    });

    it('should display 50% with 2 decimals', () => {
      expect(formatNetworkShare(50)).toBe('50.00%');
    });

    it('should display 99.99% with 2 decimals', () => {
      expect(formatNetworkShare(99.99)).toBe('99.99%');
    });

    it('should handle 100% network share', () => {
      expect(formatNetworkShare(100)).toBe('100.00%');
    });
  });

  describe('edge cases', () => {
    it('should handle zero percentage', () => {
      expect(formatNetworkShare(0)).toBe('0.0000%');
    });

    it('should handle rounding at 2 decimal precision', () => {
      expect(formatNetworkShare(1.234)).toBe('1.23%');
      expect(formatNetworkShare(1.235)).toBe('1.24%'); // Rounds up
      expect(formatNetworkShare(1.9999)).toBe('2.00%');
    });

    it('should handle rounding at 4 decimal precision', () => {
      expect(formatNetworkShare(0.12345)).toBe('0.1235%'); // Rounds up
      expect(formatNetworkShare(0.12344)).toBe('0.1234%');
    });
  });
});

// ============================================================================
// T014: Test calculateRankings() with tie scenarios
// ============================================================================

describe('calculateRankings', () => {
  const createMiner = (address: string, hashrate: number): MinerData => ({
    address,
    hashrate,
  });

  describe('basic ranking calculation', () => {
    it('should rank single miner as position 1', () => {
      const miners = [createMiner('addr1', 5000)];
      const rankings = calculateRankings(miners);

      expect(rankings.get('addr1')).toBe(1);
      expect(rankings.size).toBe(1);
    });

    it('should handle empty array', () => {
      const rankings = calculateRankings([]);
      expect(rankings.size).toBe(0);
    });

    it('should rank multiple miners correctly', () => {
      const miners = [
        createMiner('addr1', 5000),
        createMiner('addr2', 3000),
        createMiner('addr3', 8000),
        createMiner('addr4', 1000),
      ];

      const rankings = calculateRankings(miners);

      expect(rankings.get('addr3')).toBe(1); // 8000 - highest
      expect(rankings.get('addr1')).toBe(2); // 5000
      expect(rankings.get('addr2')).toBe(3); // 3000
      expect(rankings.get('addr4')).toBe(4); // 1000 - lowest
    });
  });

  describe('tie scenarios (same hashrate = same rank)', () => {
    it('should handle simple tie: [100, 100, 50] → ranks [1, 1, 3]', () => {
      const miners = [
        createMiner('addr1', 100),
        createMiner('addr2', 100),
        createMiner('addr3', 50),
      ];

      const rankings = calculateRankings(miners);

      expect(rankings.get('addr1')).toBe(1);
      expect(rankings.get('addr2')).toBe(1);
      expect(rankings.get('addr3')).toBe(3); // Note: skips rank 2
    });

    it('should handle all miners tied', () => {
      const miners = [
        createMiner('addr1', 1000),
        createMiner('addr2', 1000),
        createMiner('addr3', 1000),
      ];

      const rankings = calculateRankings(miners);

      expect(rankings.get('addr1')).toBe(1);
      expect(rankings.get('addr2')).toBe(1);
      expect(rankings.get('addr3')).toBe(1);
    });

    it('should handle multiple tie groups: [100, 100, 50, 50, 10]', () => {
      const miners = [
        createMiner('addr1', 100),
        createMiner('addr2', 100),
        createMiner('addr3', 50),
        createMiner('addr4', 50),
        createMiner('addr5', 10),
      ];

      const rankings = calculateRankings(miners);

      expect(rankings.get('addr1')).toBe(1);
      expect(rankings.get('addr2')).toBe(1);
      expect(rankings.get('addr3')).toBe(3); // Skips rank 2
      expect(rankings.get('addr4')).toBe(3);
      expect(rankings.get('addr5')).toBe(5); // Skips rank 4
    });

    it('should handle tie at top 10 boundary', () => {
      const miners = [
        ...Array.from({ length: 9 }, (_, i) => createMiner(`top${i}`, 1000 - i)),
        createMiner('tied1', 991), // Position 10
        createMiner('tied2', 991), // Position 10
        createMiner('below', 990), // Position 12
      ];

      const rankings = calculateRankings(miners);

      expect(rankings.get('tied1')).toBe(10);
      expect(rankings.get('tied2')).toBe(10);
      expect(rankings.get('below')).toBe(12);
    });
  });

  describe('case-insensitive address matching', () => {
    it('should store addresses in lowercase', () => {
      const miners = [
        createMiner('ABC123', 5000),
        createMiner('def456', 3000),
      ];

      const rankings = calculateRankings(miners);

      expect(rankings.get('abc123')).toBe(1);
      expect(rankings.get('ABC123')).toBeUndefined();
      expect(rankings.get('def456')).toBe(2);
      expect(rankings.get('DEF456')).toBeUndefined();
    });

    it('should handle mixed-case addresses (different addresses)', () => {
      const miners = [
        createMiner('Gk3fY2zXw5Ht8Kp2Lq6Mr9Ns1Ot4Pu7Qv0Rw3Sx6Ty9Uz', 5000),
        createMiner('Zx9yT6xS3wR0vQ7uP4tO1sN9rM6qL2pK8tH5wX2zY3fKg', 3000),
      ];

      const rankings = calculateRankings(miners);

      expect(rankings.get('gk3fy2zxw5ht8kp2lq6mr9ns1ot4pu7qv0rw3sx6ty9uz')).toBe(1);
      expect(rankings.get('zx9yt6xs3wr0vq7up4to1sn9rm6ql2pk8th5wx2zy3fkg')).toBe(2);
      expect(rankings.size).toBe(2);
    });
  });

  describe('performance with large dataset', () => {
    it('should calculate rankings for 10,000 miners in <500ms', () => {
      const miners = Array.from({ length: 10000 }, (_, i) =>
        createMiner(`miner${i}`, Math.random() * 1e12)
      );

      const startTime = performance.now();
      const rankings = calculateRankings(miners);
      const endTime = performance.now();

      const executionTime = endTime - startTime;

      expect(rankings.size).toBe(10000);
      expect(executionTime).toBeLessThan(500);
    });

    it('should handle many ties in large dataset', () => {
      // Create 1000 miners, all with same hashrate
      const miners = Array.from({ length: 1000 }, (_, i) =>
        createMiner(`miner${i}`, 5000)
      );

      const rankings = calculateRankings(miners);

      // All should be ranked 1
      miners.forEach((miner) => {
        expect(rankings.get(miner.address.toLowerCase())).toBe(1);
      });
    });
  });

  describe('realistic mining scenarios', () => {
    it('should rank realistic hashrate distribution', () => {
      const miners = [
        createMiner('largePool', 8.5e12),    // 8.5 TH/s
        createMiner('mediumPool', 4.2e12),   // 4.2 TH/s
        createMiner('smallPool', 1.5e12),    // 1.5 TH/s
        createMiner('soloMiner1', 3.8e11),   // 380 GH/s
        createMiner('soloMiner2', 3.8e11),   // 380 GH/s (tie)
        createMiner('hobbyist', 50e9),       // 50 GH/s
        createMiner('tiny', 500000),         // 500 KH/s
      ];

      const rankings = calculateRankings(miners);

      expect(rankings.get('largepool')).toBe(1);
      expect(rankings.get('mediumpool')).toBe(2);
      expect(rankings.get('smallpool')).toBe(3);
      expect(rankings.get('solominer1')).toBe(4);
      expect(rankings.get('solominer2')).toBe(4); // Tied
      expect(rankings.get('hobbyist')).toBe(6);
      expect(rankings.get('tiny')).toBe(7);
    });
  });
});

// ============================================================================
// T015: Test calculateUserRanking() for edge cases
// ============================================================================

describe('calculateUserRanking', () => {
  const createMiner = (address: string, hashrate: number): MinerData => ({
    address,
    hashrate,
  });

  const createRankingData = (miners: MinerData[]): MiningRankingData => {
    const totalNetworkHashrate = miners.reduce((sum, m) => sum + m.hashrate, 0);
    return {
      miners,
      totalNetworkHashrate,
    };
  };

  describe('user not found cases (returns null)', () => {
    it('should return null when user address not in dataset', () => {
      const data = createRankingData([
        createMiner('addr1', 5e12),
        createMiner('addr2', 3e12),
      ]);

      const result = calculateUserRanking(data, 'nonexistent');
      expect(result).toBeNull();
    });

    it('should return null for empty miners array', () => {
      const data = createRankingData([]);

      const result = calculateUserRanking(data, 'anyAddress');
      expect(result).toBeNull();
    });
  });

  describe('hashrate < 1 MH/s cases (returns null)', () => {
    it('should return null for hashrate exactly < 1 MH/s', () => {
      const data = createRankingData([
        createMiner('user1', 999999), // 999,999 H/s (< 1 MH/s)
      ]);

      const result = calculateUserRanking(data, 'user1');
      expect(result).toBeNull();
    });

    it('should return null for hashrate = 500 KH/s', () => {
      const data = createRankingData([
        createMiner('user1', 500000), // 500 KH/s
      ]);

      const result = calculateUserRanking(data, 'user1');
      expect(result).toBeNull();
    });

    it('should return null for very small hashrate', () => {
      const data = createRankingData([
        createMiner('user1', 1000), // 1 KH/s
      ]);

      const result = calculateUserRanking(data, 'user1');
      expect(result).toBeNull();
    });

    it('should return result for hashrate exactly at 1 MH/s threshold', () => {
      const data = createRankingData([
        createMiner('user1', 1e6), // Exactly 1 MH/s
      ]);

      const result = calculateUserRanking(data, 'user1');
      expect(result).not.toBeNull();
      expect(result?.hashrate).toBe(1e6);
    });

    it('should return result for hashrate just above 1 MH/s', () => {
      const data = createRankingData([
        createMiner('user1', 1000001), // Just above 1 MH/s
      ]);

      const result = calculateUserRanking(data, 'user1');
      expect(result).not.toBeNull();
    });
  });

  describe('valid user ranking calculation', () => {
    it('should return correct UserRanking for valid user', () => {
      const data = createRankingData([
        createMiner('addr1', 5e12),  // 5 TH/s
        createMiner('addr2', 3e12),  // 3 TH/s
        createMiner('addr3', 1e12),  // 1 TH/s
      ]);

      const result = calculateUserRanking(data, 'addr2');

      expect(result).not.toBeNull();
      expect(result?.position).toBe(2);
      expect(result?.totalMiners).toBe(3);
      expect(result?.hashrate).toBe(3e12);
      expect(result?.networkShare).toBeCloseTo(33.33, 2);
      expect(result?.isTopTen).toBe(true);
    });

    it('should calculate network share correctly', () => {
      const data = createRankingData([
        createMiner('addr1', 5e12),
        createMiner('addr2', 5e12),
      ]);

      const result = calculateUserRanking(data, 'addr1');

      expect(result?.networkShare).toBe(50); // 5/10 = 50%
    });

    it('should handle zero network hashrate safely', () => {
      const data: MiningRankingData = {
        miners: [createMiner('addr1', 5e12)],
        totalNetworkHashrate: 0, // Edge case: manually set to 0
      };

      const result = calculateUserRanking(data, 'addr1');

      expect(result).not.toBeNull();
      expect(result?.networkShare).toBe(0);
    });
  });

  describe('top 10 detection (isTopTen flag)', () => {
    it('should mark position 1 as top ten', () => {
      const data = createRankingData([
        createMiner('user1', 10e12),
        ...Array.from({ length: 20 }, (_, i) => createMiner(`other${i}`, (9 - i * 0.1) * 1e12)),
      ]);

      const result = calculateUserRanking(data, 'user1');

      expect(result?.position).toBe(1);
      expect(result?.isTopTen).toBe(true);
    });

    it('should mark position 10 as top ten', () => {
      const miners = Array.from({ length: 15 }, (_, i) =>
        createMiner(`user${i}`, (15 - i) * 1e12)
      );
      const data = createRankingData(miners);

      const result = calculateUserRanking(data, 'user9'); // 10th user

      expect(result?.position).toBe(10);
      expect(result?.isTopTen).toBe(true);
    });

    it('should NOT mark position 11 as top ten', () => {
      const miners = Array.from({ length: 15 }, (_, i) =>
        createMiner(`user${i}`, (15 - i) * 1e12)
      );
      const data = createRankingData(miners);

      const result = calculateUserRanking(data, 'user10'); // 11th user

      expect(result?.position).toBe(11);
      expect(result?.isTopTen).toBe(false);
    });

    it('should mark tied users at position 10 as top ten', () => {
      const miners = [
        ...Array.from({ length: 9 }, (_, i) => createMiner(`top${i}`, (100 - i) * 1e12)),
        createMiner('tied1', 90e12), // Position 10
        createMiner('tied2', 90e12), // Position 10
        createMiner('below', 89e12), // Position 12
      ];
      const data = createRankingData(miners);

      const result1 = calculateUserRanking(data, 'tied1');
      const result2 = calculateUserRanking(data, 'tied2');
      const result3 = calculateUserRanking(data, 'below');

      expect(result1?.position).toBe(10);
      expect(result1?.isTopTen).toBe(true);
      expect(result2?.position).toBe(10);
      expect(result2?.isTopTen).toBe(true);
      expect(result3?.position).toBe(12);
      expect(result3?.isTopTen).toBe(false);
    });
  });

  describe('case-insensitive address matching', () => {
    it('should find user with lowercase query', () => {
      const data = createRankingData([
        createMiner('ABC123', 5e12),
      ]);

      const result = calculateUserRanking(data, 'abc123');

      expect(result).not.toBeNull();
      expect(result?.position).toBe(1);
    });

    it('should find user with uppercase query', () => {
      const data = createRankingData([
        createMiner('abc123', 5e12),
      ]);

      const result = calculateUserRanking(data, 'ABC123');

      expect(result).not.toBeNull();
      expect(result?.position).toBe(1);
    });

    it('should find user with mixed-case query', () => {
      const data = createRankingData([
        createMiner('Gk3fY2zXw5Ht8Kp2Lq6Mr9Ns1Ot4Pu7Qv0Rw3Sx6Ty9Uz', 5e12),
      ]);

      const result1 = calculateUserRanking(data, 'gk3fy2zxw5ht8kp2lq6mr9ns1ot4pu7qv0rw3sx6ty9uz');
      const result2 = calculateUserRanking(data, 'GK3FY2ZXW5HT8KP2LQ6MR9NS1OT4PU7QV0RW3SX6TY9UZ');

      expect(result1).not.toBeNull();
      expect(result2).not.toBeNull();
      expect(result1?.position).toBe(result2?.position);
    });
  });

  describe('integration with calculateRankings (tie handling)', () => {
    it('should correctly handle user in tied group', () => {
      const data = createRankingData([
        createMiner('addr1', 100e12),
        createMiner('addr2', 50e12),
        createMiner('addr3', 50e12), // Tied with addr2
        createMiner('addr4', 50e12), // Tied with addr2 and addr3
        createMiner('addr5', 10e12),
      ]);

      const result = calculateUserRanking(data, 'addr3');

      expect(result?.position).toBe(2); // All three at position 2
    });
  });

  describe('realistic mining scenarios', () => {
    it('should calculate ranking for user in realistic dataset', () => {
      const data = createRankingData([
        createMiner('largePool', 8.5e12),
        createMiner('mediumPool', 4.2e12),
        createMiner('currentUser', 3.8e12),
        createMiner('smallPool', 1.5e12),
        createMiner('soloMiner', 5e11),
      ]);

      const result = calculateUserRanking(data, 'currentUser');

      expect(result).not.toBeNull();
      expect(result?.position).toBe(3);
      expect(result?.totalMiners).toBe(5);
      expect(result?.hashrate).toBe(3.8e12);
      expect(result?.isTopTen).toBe(true);

      // Network share calculation
      const expectedShare = (3.8e12 / data.totalNetworkHashrate) * 100;
      expect(result?.networkShare).toBeCloseTo(expectedShare, 2);
    });
  });
});
