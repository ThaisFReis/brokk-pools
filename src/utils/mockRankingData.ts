/**
 * Mock Ranking Data Loader
 * Feature: Top Position Display
 * Loads and validates mock mining ranking data
 */

import type { MiningRankingData, MinerData } from '../types/dashboard';
import { isValidRankingData } from './ranking';
import mockRankingRaw from '../data/mockRanking.json';

/**
 * Mock ranking data structure from JSON file
 */
interface MockRankingFile {
  metadata: {
    version: string;
    generatedAt: string;
    totalMiners: number;
    description: string;
  };
  miners: MinerData[];
  totalNetworkHashrate: number;
  lastUpdated: string;
}

/**
 * Loads mock ranking data from JSON file
 * Validates data structure and miner information
 *
 * @throws {Error} If mock data file is invalid or fails validation
 * @returns MiningRankingData object
 *
 * @example
 * const rankingData = loadMockRanking();
 * console.log(`Loaded ${rankingData.miners.length} miners`);
 */
export function loadMockRanking(): MiningRankingData {
  const mockData = mockRankingRaw as MockRankingFile;

  // Validate metadata
  if (!mockData.metadata || !mockData.metadata.version) {
    throw new Error('Mock ranking data file is missing required metadata');
  }

  // Validate miners array exists
  if (!Array.isArray(mockData.miners)) {
    throw new Error('Mock ranking data file does not contain a valid miners array');
  }

  // Validate each miner
  const validMiners: MinerData[] = [];
  const errors: string[] = [];

  for (let i = 0; i < mockData.miners.length; i++) {
    const miner = mockData.miners[i];

    // Validate required fields
    if (
      !miner.minerId ||
      typeof miner.minerId !== 'string' ||
      typeof miner.hashrate !== 'number' ||
      miner.hashrate < 0 ||
      typeof miner.isCurrentUser !== 'boolean'
    ) {
      errors.push(
        `Miner at index ${i} (id: ${miner?.minerId || 'unknown'}) failed validation`
      );
      continue;
    }

    validMiners.push(miner);
  }

  // Throw error if any miners failed validation
  if (errors.length > 0) {
    throw new Error(`Mock ranking data validation failed:\n${errors.join('\n')}`);
  }

  // Create ranking data structure
  const rankingData: MiningRankingData = {
    miners: validMiners,
    userRanking: null, // Will be calculated by useRanking hook
    lastUpdated: mockData.lastUpdated,
    totalNetworkHashrate: mockData.totalNetworkHashrate,
  };

  // Validate complete structure
  if (!isValidRankingData(rankingData)) {
    throw new Error('Constructed ranking data failed validation');
  }

  return rankingData;
}

/**
 * Gets current user's miner ID from mock data
 * @returns Miner ID of current user, or null if not found
 */
export function getMockCurrentUserMinerId(): string | null {
  try {
    const mockData = mockRankingRaw as MockRankingFile;
    const currentUser = mockData.miners.find((m) => m.isCurrentUser);
    return currentUser?.minerId || null;
  } catch {
    return null;
  }
}

/**
 * Gets mock ranking metadata
 * @returns Ranking metadata object
 */
export function getMockRankingMetadata() {
  const mockData = mockRankingRaw as MockRankingFile;
  return mockData.metadata;
}

/**
 * Simulates loading delay for realistic UX testing
 * Use this to test loading states in development
 *
 * @param delayMs - Delay in milliseconds (default: 500ms)
 * @returns Promise that resolves to ranking data
 *
 * @example
 * const ranking = await loadMockRankingWithDelay(1000);
 */
export async function loadMockRankingWithDelay(
  delayMs: number = 500
): Promise<MiningRankingData> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return loadMockRanking();
}
