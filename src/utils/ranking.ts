/**
 * Mining Ranking Utilities
 * Feature: Top Position Display
 * Calculates user ranking based on hashrate and handles tie scenarios
 */

import type { MinerData, UserRanking, MiningRankingData } from '../types/dashboard';
import { HashrateUnit } from '../types/dashboard';

/**
 * Formats hashrate to human-readable string with appropriate unit
 * @param hashrate - Hashrate in H/s
 * @returns Formatted string (e.g., "2.5 TH/s", "150 GH/s")
 */
export function formatHashrate(hashrate: number): string {
  const units: Array<{ threshold: number; unit: HashrateUnit }> = [
    { threshold: 1e12, unit: HashrateUnit.TH },
    { threshold: 1e9, unit: HashrateUnit.GH },
    { threshold: 1e6, unit: HashrateUnit.MH },
    { threshold: 1e3, unit: HashrateUnit.KH },
    { threshold: 1, unit: HashrateUnit.H },
  ];

  for (const { threshold, unit } of units) {
    if (hashrate >= threshold) {
      const value = hashrate / threshold;
      // Format with 1-2 decimal places, trimming trailing zeros
      const formatted = value.toFixed(2).replace(/\.?0+$/, '');
      return `${formatted} ${unit}`;
    }
  }

  return `0 ${HashrateUnit.H}`;
}

/**
 * Calculates user ranking from miner data
 * Handles tie scenarios: miners with the same hashrate receive the same rank
 * @param miners - Array of all miners with hashrate data
 * @param currentUserAddress - Wallet address of current user
 * @returns UserRanking or null if user not found
 */
export function calculateUserRanking(
  miners: MinerData[],
  currentUserAddress: string
): UserRanking | null {
  if (miners.length === 0) {
    return null;
  }

  // Sort miners by hashrate descending (highest first)
  const sortedMiners = [...miners].sort((a, b) => b.hashrate - a.hashrate);

  // Find current user
  const userIndex = sortedMiners.findIndex(
    (miner) => miner.minerId.toLowerCase() === currentUserAddress.toLowerCase()
  );

  if (userIndex === -1) {
    return null;
  }

  const currentUser = sortedMiners[userIndex];

  // Calculate position accounting for ties
  // Miners with same hashrate get same position
  let position = 1;
  for (let i = 0; i < userIndex; i++) {
    if (sortedMiners[i].hashrate > currentUser.hashrate) {
      position++;
    }
  }

  // Calculate total network hashrate
  const totalNetworkHashrate = sortedMiners.reduce((sum, miner) => sum + miner.hashrate, 0);

  // Calculate network percentage
  const networkPercentage =
    totalNetworkHashrate > 0 ? (currentUser.hashrate / totalNetworkHashrate) * 100 : 0;

  return {
    position,
    totalMiners: miners.length,
    hashrate: currentUser.hashrate,
    hashrateFormatted: formatHashrate(currentUser.hashrate),
    isTopTen: position <= 10,
    networkPercentage,
  };
}

/**
 * Sorts miners by hashrate (descending) and adds ranking positions
 * @param miners - Array of miners to sort
 * @returns Sorted array with ranking information
 */
export function sortMinersByHashrate(miners: MinerData[]): MinerData[] {
  return [...miners].sort((a, b) => b.hashrate - a.hashrate);
}

/**
 * Validates mining ranking data
 * @param data - Mining ranking data to validate
 * @returns true if valid, false otherwise
 */
export function isValidRankingData(data: unknown): data is MiningRankingData {
  const d = data as MiningRankingData;
  return (
    Array.isArray(d?.miners) &&
    d.miners.every(
      (m) => typeof m.minerId === 'string' && typeof m.hashrate === 'number' && m.hashrate >= 0
    ) &&
    typeof d?.lastUpdated === 'string' &&
    typeof d?.totalNetworkHashrate === 'number'
  );
}

/**
 * Generates a shortened wallet address for display
 * @param address - Full wallet address
 * @param prefixLength - Number of characters to show at start (default: 4)
 * @param suffixLength - Number of characters to show at end (default: 4)
 * @returns Shortened address (e.g., "Gk3f...xY2z")
 */
export function shortenAddress(
  address: string,
  prefixLength: number = 4,
  suffixLength: number = 4
): string {
  if (address.length <= prefixLength + suffixLength) {
    return address;
  }
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Calculates the percentile rank of a user
 * @param position - User's position (1-indexed)
 * @param totalMiners - Total number of miners
 * @returns Percentile (0-100)
 */
export function calculatePercentile(position: number, totalMiners: number): number {
  if (totalMiners <= 0) return 0;
  return ((totalMiners - position + 1) / totalMiners) * 100;
}
