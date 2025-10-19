/**
 * useRanking Hook
 * Feature: Top Position Ranking (T023, T045, T046, T047)
 * Manages mining ranking data, loading states, user ranking calculation, and auto-refresh
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { MiningRankingData, UserRanking } from '../types/dashboard';
import { loadMockRankingData } from '../utils/mockRankingData';
import { calculateUserRanking } from '../utils/ranking';

/** Auto-refresh interval in milliseconds (30 seconds) */
const AUTO_REFRESH_INTERVAL = 30000;

interface UseRankingReturn {
  /** Current user's ranking information */
  userRanking: UserRanking | null;

  /** Loading state */
  loading: boolean;

  /** Error message if fetch failed */
  error: string | null;

  /** Retry/refresh ranking data */
  refetch: () => void;
}

/**
 * Custom hook to manage mining ranking data with auto-refresh
 * Loads data, calculates user ranking, handles loading/error states, and auto-refreshes every 30s
 *
 * @param userAddress - Current user's wallet address (null when not connected)
 * @returns User ranking, loading state, error state, and refetch function
 *
 * @example
 * const { userRanking, loading, error, refetch } = useRanking(wallet?.publicKey?.toString());
 * if (!loading && userRanking) {
 *   console.log(`You are #${userRanking.position}`);
 * }
 */
export function useRanking(userAddress?: string | null): UseRankingReturn {
  const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // T046: Track if this is the initial load for silent refresh
  const isInitialLoadRef = useRef<boolean>(true);

  /**
   * T045, T047: Loads ranking data with silent refresh support
   * @param isAutoRefresh - If true, don't show loading spinner (silent refresh)
   */
  const loadRankingData = useCallback(async (isAutoRefresh = false) => {
    // If no user address, don't fetch
    if (!userAddress) {
      setUserRanking(null);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      // T047: Only show loading spinner on initial load, not during auto-refresh
      if (!isAutoRefresh) {
        setLoading(true);
      }
      setError(null);

      // Load mock data (async)
      const data: MiningRankingData = await loadMockRankingData();

      // Calculate user ranking
      const ranking = calculateUserRanking(data, userAddress);

      // Update state
      setUserRanking(ranking);
      setLoading(false);

      // Mark that initial load is complete
      isInitialLoadRef.current = false;
    } catch (err) {
      console.error('Failed to load ranking data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load ranking data';
      setError(errorMessage);
      setLoading(false);
      setUserRanking(null);

      // T049: Don't break auto-refresh on error - initial load flag stays for retry
    }
  }, [userAddress]);

  /**
   * T045: Refetch function that can be called manually (e.g., retry button)
   * Manual refetch shows loading spinner
   */
  const refetch = useCallback(() => {
    loadRankingData(false); // Not an auto-refresh, show loading spinner
  }, [loadRankingData]);

  // T045: Load data when user address changes (initial load)
  useEffect(() => {
    loadRankingData(false); // Initial load, show loading spinner
  }, [loadRankingData]);

  // T045: Auto-refresh every 30 seconds
  useEffect(() => {
    // Don't set up auto-refresh if no user address
    if (!userAddress) {
      return;
    }

    // Set up interval for auto-refresh
    const intervalId = setInterval(() => {
      // Silent refresh (don't show loading spinner)
      loadRankingData(true);
    }, AUTO_REFRESH_INTERVAL);

    // T045: Cleanup function to clear interval on unmount or address change
    return () => {
      clearInterval(intervalId);
    };
  }, [userAddress, loadRankingData]);

  // T046: Memoize user ranking calculation to prevent unnecessary recalculations
  // This is kept for future optimization if we separate data fetching from calculation
  // Currently calculateUserRanking is called directly in loadRankingData
  // but we keep this pattern for potential future enhancements

  return {
    userRanking,
    loading,
    error,
    refetch,
  };
}
