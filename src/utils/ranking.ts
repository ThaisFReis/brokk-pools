/**
 * Mining Ranking Utilities
 * Feature: Top Position Ranking
 * Provides functions for ranking calculation, formatting, and data processing
 */

import type { MinerData, UserRanking, MiningRankingData } from '../types/dashboard';
import { HashrateUnit } from '../types/dashboard';

/**
 * T008: Formats hashrate with automatic unit selection
 * Selects appropriate unit (TH/s, GH/s, MH/s, KH/s, H/s) based on magnitude
 *
 * @param hashrate - Hashrate in H/s (base unit)
 * @returns Object with value and unit
 *
 * @example
 * formatHashrate(4500000000000) // { value: 4.5, unit: 'TH/s' }
 * formatHashrate(3200000000) // { value: 3.2, unit: 'GH/s' }
 */
export function formatHashrate(hashrate: number): { value: number; unit: HashrateUnit } {
  const units = [
    { threshold: 1e12, unit: HashrateUnit.TH_S },
    { threshold: 1e9, unit: HashrateUnit.GH_S },
    { threshold: 1e6, unit: HashrateUnit.MH_S },
    { threshold: 1e3, unit: HashrateUnit.KH_S },
    { threshold: 1, unit: HashrateUnit.H_S },
  ];

  for (const { threshold, unit } of units) {
    if (hashrate >= threshold) {
      return {
        value: hashrate / threshold,
        unit,
      };
    }
  }

  return { value: hashrate, unit: HashrateUnit.H_S };
}

/**
 * T009: Formats network share percentage with dynamic decimal precision
 * Uses 2 decimals for ≥1%, 4 decimals for <1%
 *
 * @param share - Network share as percentage (0-100)
 * @returns Formatted string with appropriate precision
 *
 * @example
 * formatNetworkShare(2.3456) // "2.35%"
 * formatNetworkShare(0.4237) // "0.4237%"
 */
export function formatNetworkShare(share: number): string {
  const decimals = share >= 1 ? 2 : 4;
  return `${share.toFixed(decimals)}%`;
}

/**
 * T010: Calculates rankings for all miners with tie handling
 * Implements O(n log n) sort-based algorithm
 * Case-insensitive address matching
 *
 * @param miners - Array of miner data
 * @returns Map of address (lowercase) to ranking position
 *
 * @example
 * // Hashrates: [100, 100, 50] → Ranks: [1, 1, 3]
 * const rankings = calculateRankings(miners);
 * rankings.get('address1') // 1
 */
export function calculateRankings(miners: MinerData[]): Map<string, number> {
  if (miners.length === 0) {
    return new Map();
  }

  // Sort descending by hashrate (O(n log n))
  const sorted = [...miners].sort((a, b) => b.hashrate - a.hashrate);

  const rankings = new Map<string, number>();
  let currentRank = 1;
  let currentHashrate = sorted[0].hashrate;

  sorted.forEach((miner, index) => {
    // If hashrate decreased, update rank to current index + 1
    if (miner.hashrate < currentHashrate) {
      currentRank = index + 1;
      currentHashrate = miner.hashrate;
    }

    // Store with lowercase address for case-insensitive matching
    rankings.set(miner.address.toLowerCase(), currentRank);
  });

  return rankings;
}

/**
 * T011: Calculates user ranking from mining data
 * Derives UserRanking from MiningRankingData + user address
 * Handles "not found" and hashrate < 1 MH/s cases
 *
 * @param rankingData - Complete mining ranking dataset
 * @param userAddress - User's wallet address
 * @returns UserRanking or null if not found or hashrate too low
 *
 * @example
 * const userRanking = calculateUserRanking(data, "Gk3f...Uz");
 * if (userRanking) {
 *   console.log(`Position: ${userRanking.position}`);
 * }
 */
export function calculateUserRanking(
  rankingData: MiningRankingData,
  userAddress: string
): UserRanking | null {
  // Find user's miner data (case-insensitive)
  const userMiner = rankingData.miners.find(
    (m) => m.address.toLowerCase() === userAddress.toLowerCase()
  );

  // Return null if user not found
  if (!userMiner) {
    return null;
  }

  // Return null if hashrate < 1 MH/s (1,000,000 H/s)
  if (userMiner.hashrate < 1e6) {
    return null;
  }

  // Calculate all rankings
  const rankings = calculateRankings(rankingData.miners);

  // Get user's position
  const position = rankings.get(userAddress.toLowerCase());
  if (!position) {
    return null; // Should not happen, but type safety
  }

  // Calculate network share
  const networkShare =
    rankingData.totalNetworkHashrate > 0
      ? (userMiner.hashrate / rankingData.totalNetworkHashrate) * 100
      : 0;

  return {
    position,
    totalMiners: rankingData.miners.length,
    hashrate: userMiner.hashrate,
    networkShare,
    isTopTen: position <= 10,
  };
}
