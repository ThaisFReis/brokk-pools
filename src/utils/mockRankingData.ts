/**
 * Mock Ranking Data Loader
 * Feature: Top Position Ranking
 * Loads mock miner ranking data for development and testing
 */

import type { MiningRankingData } from '../types/dashboard';
import mockRankingData from '../data/mockRanking.json';

/**
 * Loads mock ranking data from static JSON file
 * Simulates async data fetching with a small delay
 *
 * @returns Promise resolving to MiningRankingData
 * @throws Error if data format is invalid
 */
export async function loadMockRankingData(): Promise<MiningRankingData> {
  // Simulate network delay (50-150ms)
  const delay = Math.random() * 100 + 50;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Validate data structure
  if (!mockRankingData.miners || !Array.isArray(mockRankingData.miners)) {
    throw new Error('Invalid mock data format: miners array missing');
  }

  if (typeof mockRankingData.totalNetworkHashrate !== 'number') {
    throw new Error('Invalid mock data format: totalNetworkHashrate missing');
  }

  // Return typed data
  return {
    miners: mockRankingData.miners,
    totalNetworkHashrate: mockRankingData.totalNetworkHashrate,
  };
}
