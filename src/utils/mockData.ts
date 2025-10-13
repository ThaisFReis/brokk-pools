/**
 * Mock Data Loader
 * Feature: Brokkr Finance Main Dashboard
 * Loads and validates mock LP position data
 */

import type { Position } from '../types/dashboard';
import { isValidPosition } from '../types/dashboard';
import mockDataRaw from '../data/mockPositions.json';

/**
 * Mock data structure from JSON file
 */
interface MockDataFile {
  positions: Position[];
  metadata: {
    version: string;
    generatedAt: string;
    walletAddress: string;
  };
}

/**
 * Loads mock positions from JSON file
 * Validates each position against the Position interface
 *
 * @throws {Error} If mock data file is invalid or positions fail validation
 * @returns Array of validated Position objects
 *
 * @example
 * const positions = loadMockPositions();
 * console.log(`Loaded ${positions.length} positions`);
 */
export function loadMockPositions(): Position[] {
  const mockData = mockDataRaw as MockDataFile;

  // Validate metadata
  if (!mockData.metadata || !mockData.metadata.version) {
    throw new Error('Mock data file is missing required metadata');
  }

  // Validate positions array exists
  if (!Array.isArray(mockData.positions)) {
    throw new Error('Mock data file does not contain a valid positions array');
  }

  // Validate each position
  const validPositions: Position[] = [];
  const errors: string[] = [];

  for (let i = 0; i < mockData.positions.length; i++) {
    const position = mockData.positions[i];

    if (!isValidPosition(position)) {
      errors.push(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        `Position at index ${i} (id: ${(position as any)?.id || 'unknown'}) failed validation`
      );
      continue;
    }

    validPositions.push(position as Position);
  }

  // Throw error if any positions failed validation
  if (errors.length > 0) {
    throw new Error(`Mock data validation failed:\n${errors.join('\n')}`);
  }

  // Ensure we have the required number of positions (10-15 per spec)
  if (validPositions.length < 10 || validPositions.length > 15) {
    throw new Error(`Mock data must contain 10-15 positions, found ${validPositions.length}`);
  }

  return validPositions;
}

/**
 * Gets mock wallet metadata
 *
 * @returns Wallet metadata object
 */
export function getMockWalletMetadata() {
  const mockData = mockDataRaw as MockDataFile;
  return mockData.metadata;
}

/**
 * Simulates loading delay for realistic UX testing
 * Use this to test loading states in development
 *
 * @param delayMs - Delay in milliseconds (default: 500ms)
 * @returns Promise that resolves to positions array
 *
 * @example
 * const positions = await loadMockPositionsWithDelay(1000);
 */
export async function loadMockPositionsWithDelay(delayMs: number = 500): Promise<Position[]> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return loadMockPositions();
}
