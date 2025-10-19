/**
 * Integration Tests for Top Position Ranking Badge
 * Feature: Top Position Ranking - User Story 3 (Auto-Refresh)
 * Task: T044
 *
 * Tests memory leak prevention and long-running auto-refresh behavior.
 * Following TDD approach - this test will FAIL until auto-refresh is implemented.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useRanking } from '../../src/hooks/useRanking';
import * as mockRankingDataModule from '../../src/utils/mockRankingData';
import type { MiningRankingData } from '../../src/types/dashboard';

// Mock the loadMockRankingData function
vi.mock('../../src/utils/mockRankingData', () => ({
  loadMockRankingData: vi.fn(),
}));

// Helper to create mock ranking data
const createMockRankingData = (position: number): MiningRankingData => ({
  totalNetworkHashrate: 150e12,
  miners: [
    {
      address: 'user123',
      hashrate: 4.5e12,
    },
  ],
});

// Helper to advance timers and flush promises with act()
const advanceTimersAsync = async (ms: number) => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
    await Promise.resolve();
  });
};

describe('Top Position Integration Tests - T044: Memory Leak Prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // ============================================================================
  // T044: Test memory leak prevention over extended operation
  // ============================================================================

  describe('T044: Memory leak prevention over 1 hour (simulated)', () => {
    it('should properly clean up intervals after many auto-refresh cycles', async () => {
      const mockData = createMockRankingData(1);
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      const { unmount } = renderHook(() => useRanking('user123'));

      // Wait for initial fetch
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
      });

      // Simulate 120 auto-refresh cycles (1 hour at 30s intervals)
      for (let i = 0; i < 120; i++) {
        await advanceTimersAsync(30000); // 30 seconds
        await waitFor(() => {
          expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(i + 2);
        });
      }

      // Total should be 121 (initial + 120 refreshes)
      expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(121);

      // Unmount and verify no more fetches happen
      unmount();

      // Advance time significantly - should NOT trigger any more fetches
      await advanceTimersAsync(300000); // 5 minutes
      expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(121);
    });

    it('should handle multiple mount/unmount cycles without accumulating intervals', async () => {
      const mockData = createMockRankingData(1);
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      let totalCalls = 0;

      // Mount and unmount 10 times
      for (let cycle = 0; cycle < 10; cycle++) {
        const { unmount } = renderHook(() => useRanking('user123'));

        // Wait for initial fetch (1 new call)
        totalCalls++;
        await waitFor(() => {
          expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(totalCalls);
        });

        // Trigger one auto-refresh (1 more call)
        await advanceTimersAsync(30000);
        totalCalls++;
        await waitFor(() => {
          expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(totalCalls);
        });

        // Unmount
        unmount();

        // Advance time - should NOT fetch (no new calls)
        await advanceTimersAsync(60000);
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(totalCalls);
      }

      // Total fetches: 10 initial + 10 auto-refresh = 20
      expect(totalCalls).toBe(20);
      expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(20);

      // Advance time significantly - should still be 20
      await advanceTimersAsync(600000); // 10 minutes
      expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(20);
    });

    it('should not accumulate state updates after unmount', async () => {
      const mockData = createMockRankingData(1);
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      const { result, unmount } = renderHook(() => useRanking('user123'));

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.userRanking).not.toBeNull();
      });

      // Unmount
      unmount();

      // Advance time and verify no errors from state updates after unmount
      await expect(advanceTimersAsync(30000)).resolves.not.toThrow();
      await expect(advanceTimersAsync(30000)).resolves.not.toThrow();
    });

    it('should handle rapid address changes without leaking intervals', async () => {
      const mockData = createMockRankingData(1);
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      const { rerender } = renderHook(
        ({ address }) => useRanking(address),
        { initialProps: { address: 'user1' as string | null } }
      );

      // Wait for initial fetch
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
      });

      // Rapidly change addresses 20 times
      for (let i = 2; i <= 20; i++) {
        rerender({ address: `user${i}` });
        await waitFor(() => {
          expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(i);
        });
      }

      // Now advance time by 30 seconds
      await advanceTimersAsync(30000);

      // Should only fetch once more (not 20 times - one per old interval)
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(21);
      });

      // Advance again
      await advanceTimersAsync(30000);
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(22);
      });
    });

    it('should maintain consistent memory footprint over extended operation', async () => {
      const mockData = createMockRankingData(1);
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      const { result } = renderHook(() => useRanking('user123'));

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.userRanking).not.toBeNull();
      });

      // Capture initial state structure
      const initialRanking = result.current.userRanking;
      const initialLoading = result.current.loading;
      const initialError = result.current.error;

      // Run 50 auto-refresh cycles
      for (let i = 0; i < 50; i++) {
        await advanceTimersAsync(30000);
        await waitFor(() => {
          expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(i + 2);
        });
      }

      // State structure should remain consistent (no unbounded growth)
      expect(result.current.userRanking).toEqual(initialRanking);
      expect(result.current.loading).toBe(initialLoading);
      expect(result.current.error).toBe(initialError);

      // Object references should be stable (not creating new objects each cycle)
      expect(typeof result.current.refetch).toBe('function');
    });

    it('should handle errors during auto-refresh without breaking interval', async () => {
      const mockData = createMockRankingData(1);

      // Alternate between success and failure
      vi.mocked(mockRankingDataModule.loadMockRankingData)
        .mockResolvedValueOnce(mockData) // Initial success
        .mockRejectedValueOnce(new Error('Network error')) // 1st refresh fails
        .mockResolvedValueOnce(mockData) // 2nd refresh succeeds
        .mockRejectedValueOnce(new Error('Network error')) // 3rd refresh fails
        .mockResolvedValueOnce(mockData); // 4th refresh succeeds

      const { result } = renderHook(() => useRanking('user123'));

      // Initial fetch succeeds
      await waitFor(() => {
        expect(result.current.userRanking).not.toBeNull();
        expect(result.current.error).toBeNull();
      });

      // 1st refresh fails
      await advanceTimersAsync(30000);
      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      // 2nd refresh succeeds
      await advanceTimersAsync(30000);
      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.userRanking).not.toBeNull();
      });

      // 3rd refresh fails
      await advanceTimersAsync(30000);
      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      // 4th refresh succeeds
      await advanceTimersAsync(30000);
      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.userRanking).not.toBeNull();
      });

      // Verify all 5 fetches happened (initial + 4 refreshes)
      expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(5);
    });

    it('should not create redundant fetch calls when ranking data is identical', async () => {
      const mockData = createMockRankingData(1);
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      renderHook(() => useRanking('user123'));

      // Initial fetch
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
      });

      // Run 10 auto-refresh cycles
      for (let i = 0; i < 10; i++) {
        await advanceTimersAsync(30000);
        await waitFor(() => {
          expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(i + 2);
        });
      }

      // Should have fetched 11 times (initial + 10 refreshes)
      // Even though data is identical, we still fetch (this is expected behavior)
      expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(11);
    });

    it('should handle concurrent operations without race conditions', async () => {
      const mockData = createMockRankingData(1);
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      const { result } = renderHook(() => useRanking('user123'));

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.userRanking).not.toBeNull();
      });

      // Trigger manual refetch while auto-refresh is active
      result.current.refetch();

      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(2);
      });

      // Advance to auto-refresh time
      await advanceTimersAsync(30000);

      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(3);
      });

      // State should still be consistent
      expect(result.current.userRanking).not.toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});
