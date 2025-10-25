/**
 * usePositions Hook
 * Loads positions from mock data and calculates aggregated metrics
 */

import { useState, useEffect, useCallback } from 'react';
import type { Position, SummaryMetrics, ErrorState } from '../types/dashboard';
import { loadMockPositions } from '../utils/mockData';
import { calculateAggregatedMetrics } from '../utils/calculations';

interface UsePositionsReturn {
  positions: Position[];
  summary: SummaryMetrics | null;
  loading: boolean;
  error: ErrorState | null;
  refetch: () => void;
}

/**
 * Custom hook to load and manage LP positions
 * Automatically loads mock data and calculates summary metrics
 *
 * @param walletConnected - Whether wallet is connected (triggers data load)
 * @returns Positions, summary metrics, loading state, and refetch function
 *
 * @example
 * const { positions, summary, loading, error } = usePositions(connected);
 *
 * if (loading) return <LoadingSpinner />;
 * if (error) return <ErrorMessage error={error} />;
 *
 * return <SummaryCards summary={summary} />;
 */
export function usePositions(_walletConnected: boolean = false): UsePositionsReturn {
  const [positions, setPositions] = useState<Position[]>([]);
  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  const baseUrl = "https://api.brokkpools.xyz"

  /**
   * Load positions from mock data
   */
  const loadPositions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate network delay for realistic UX
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Load mock positions (always show dashboard with demo data)
      
      const liquidityResponse = await (await fetch(`${baseUrl}/liquidity/2mu3kyTmEvdjPUeb9CPHMqDWT7jZEWqiyqtrJyMHHhuc`)).json();
      const positions = liquidityResponse.positions;

      const requests = positions.map((item) =>
        fetch(`${baseUrl}/analytics/${item.whirlpool}/2mu3kyTmEvdjPUeb9CPHMqDWT7jZEWqiyqtrJyMHHhuc?positionId=${item.positionMint}`).then((r) => r.json())      
      );

      const results = await Promise.all(requests);
      
      setPositions(results);
      const aggregatedMetrics = calculateAggregatedMetrics(results);

      // Calculate aggregated metrics
      setSummary(aggregatedMetrics);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load positions';

      setError({
        hasError: true,
        message: errorMessage,
        code: 'LOAD_ERROR',
        retry: () => loadPositions(),
      });

      setPositions([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refetch positions data
   */
  const refetch = useCallback(() => {
    loadPositions();
  }, [loadPositions]);

  // Load positions when wallet connects
  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  return {
    positions,
    summary,
    loading,
    error,
    refetch,
  };
}
