/**
 * useRanking Hook
 * Feature: Top Position Display
 * Manages mining ranking data, loading states, and user ranking calculation
 */

import { useState, useEffect, useCallback } from 'react';
import type { MiningRankingData, UserRanking, RankingLoadingState } from '../types/dashboard';
import { loadMockRanking, getMockCurrentUserMinerId } from '../utils/mockRankingData';
import { calculateUserRanking } from '../utils/ranking';

interface UseRankingReturn {
  /** Complete ranking data */
  rankingData: MiningRankingData | null;

  /** Current user's ranking information */
  userRanking: UserRanking | null;

  /** Loading state */
  loading: RankingLoadingState;

  /** Refresh ranking data */
  refresh: () => void;
}

/**
 * Custom hook to manage mining ranking data
 * Loads data, calculates user ranking, and handles loading/error states
 *
 * @param walletAddress - Current user's wallet address (optional for mock mode)
 * @param autoRefreshMs - Auto-refresh interval in milliseconds (0 to disable, default: 30000)
 * @returns Ranking data, user ranking, loading state, and refresh function
 *
 * @example
 * const { userRanking, loading } = useRanking(wallet?.publicKey);
 * if (!loading.isLoading && userRanking) {
 *   console.log(`You are #${userRanking.position}`);
 * }
 */
export function useRanking(
  walletAddress?: string | null,
  autoRefreshMs: number = 30000
): UseRankingReturn {
  const [rankingData, setRankingData] = useState<MiningRankingData | null>(null);
  const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
  const [loading, setLoading] = useState<RankingLoadingState>({
    isLoading: true,
    error: undefined,
  });

  /**
   * Loads ranking data and calculates user ranking
   */
  const loadRankingData = useCallback(async () => {
    try {
      setLoading({ isLoading: true, error: undefined });

      // Load mock data
      const data = loadMockRanking();

      // Determine current user address
      // In mock mode, use the address marked as current user
      // In production, use the provided walletAddress
      const currentUserAddress = walletAddress || getMockCurrentUserMinerId();

      if (!currentUserAddress) {
        // No user address available
        setRankingData(data);
        setUserRanking(null);
        setLoading({ isLoading: false, error: undefined });
        return;
      }

      // Calculate user ranking
      const ranking = calculateUserRanking(data.miners, currentUserAddress);

      // Update state
      const updatedData = {
        ...data,
        userRanking: ranking,
      };

      setRankingData(updatedData);
      setUserRanking(ranking);
      setLoading({ isLoading: false, error: undefined });
    } catch (error) {
      console.error('Failed to load ranking data:', error);
      setLoading({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load ranking data',
      });
    }
  }, [walletAddress]);

  /**
   * Refresh function that can be called manually
   */
  const refresh = useCallback(() => {
    loadRankingData();
  }, [loadRankingData]);

  // Initial load
  useEffect(() => {
    loadRankingData();
  }, [loadRankingData]);

  // Auto-refresh interval
  useEffect(() => {
    if (autoRefreshMs <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      loadRankingData();
    }, autoRefreshMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [loadRankingData, autoRefreshMs]);

  return {
    rankingData,
    userRanking,
    loading,
    refresh,
  };
}
