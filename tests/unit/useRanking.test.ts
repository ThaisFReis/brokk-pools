/**
 * Unit Tests for useRanking Hook
 * Feature: Top Position Ranking - User Story 3 (Auto-Refresh)
 * Tasks: T040, T041, T042
 *
 * Tests auto-refresh functionality, interval cleanup, and ranking updates.
 * Following TDD approach - these tests will FAIL until auto-refresh is implemented.
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
const createMockRankingData = (overrides?: Partial<MiningRankingData>): MiningRankingData => ({
  totalNetworkHashrate: 150e12, // 150 TH/s
  miners: [
    {
      address: 'user123',
      hashrate: 4.5e12, // 4.5 TH/s
    },
    {
      address: 'user456',
      hashrate: 3.2e12, // 3.2 TH/s
    },
  ],
  ...overrides,
});

// Helper to advance timers and flush promises with act()
const advanceTimersAsync = async (ms: number) => {
  await act(async () => {
    vi.advanceTimersByTime(ms);
    await Promise.resolve(); // Flush promises
  });
};

describe('useRanking Hook - User Story 3: Auto-Refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Use fake timers but allow time to advance automatically for waitFor
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // ============================================================================
  // T040: Test auto-refresh triggers fetch every 30 seconds
  // ============================================================================

  describe('T040: Auto-refresh triggers fetch every 30 seconds', () => {
    it('should fetch ranking data immediately on mount', async () => {
      const mockData = createMockRankingData();
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      renderHook(() => useRanking('user123'));

      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
      });
    });

    it('should fetch ranking data again after 30 seconds', async () => {
      const mockData = createMockRankingData();
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      renderHook(() => useRanking('user123'));

      // Initial fetch
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
      });

      // Advance time by 30 seconds and wait for async operations
      await advanceTimersAsync(30000);

      // Should fetch again
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(2);
      });
    });

    it('should continue fetching at 30-second intervals', async () => {
      const mockData = createMockRankingData();
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      renderHook(() => useRanking('user123'));

      // Initial fetch
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
      });

      // Advance time by 30 seconds (2nd fetch)
      await advanceTimersAsync(30000);
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(2);
      });

      // Advance time by another 30 seconds (3rd fetch)
      await advanceTimersAsync(30000);
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(3);
      });

      // Advance time by another 30 seconds (4th fetch)
      await advanceTimersAsync(30000);
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(4);
      });
    });

    it('should not fetch when user address is null', async () => {
      const mockData = createMockRankingData();
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      renderHook(() => useRanking(null));

      // No fetch should happen
      expect(mockRankingDataModule.loadMockRankingData).not.toHaveBeenCalled();

      // Advance time - still no fetch
      await advanceTimersAsync(30000);
      expect(mockRankingDataModule.loadMockRankingData).not.toHaveBeenCalled();
    });

    it('should start auto-refresh when address becomes available', async () => {
      const mockData = createMockRankingData();
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      const { rerender } = renderHook(({ address }) => useRanking(address), {
        initialProps: { address: null as string | null },
      });

      // No fetch initially
      expect(mockRankingDataModule.loadMockRankingData).not.toHaveBeenCalled();

      // Update with address
      rerender({ address: 'user123' });

      // Should fetch immediately
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
      });

      // Should continue auto-refresh
      await advanceTimersAsync(30000);
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(2);
      });
    });
  });

  // ============================================================================
  // T041: Test interval cleanup on unmount
  // ============================================================================

  describe('T041: Interval cleanup on unmount', () => {
    it('should stop auto-refresh after unmount', async () => {
      const mockData = createMockRankingData();
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      const { unmount } = renderHook(() => useRanking('user123'));

      // Initial fetch
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
      });

      // Unmount the hook
      unmount();

      // Advance time - should NOT fetch again
      await advanceTimersAsync(30000);
      expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);

      // Advance more time - still should NOT fetch
      await advanceTimersAsync(30000);
      expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
    });

    it('should clear interval when address becomes null', async () => {
      const mockData = createMockRankingData();
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      const { rerender } = renderHook(({ address }) => useRanking(address), {
        initialProps: { address: 'user123' as string | null },
      });

      // Initial fetch
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
      });

      // Change address to null
      rerender({ address: null });

      // Advance time - should NOT fetch again
      await advanceTimersAsync(30000);
      expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
    });

    it('should not create zombie intervals after multiple re-renders', async () => {
      const mockData = createMockRankingData();
      vi.mocked(mockRankingDataModule.loadMockRankingData).mockResolvedValue(mockData);

      const { rerender } = renderHook(({ address }) => useRanking(address), {
        initialProps: { address: 'user123' as string | null },
      });

      // Initial fetch
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(1);
      });

      // Re-render multiple times with same address (should not create new intervals)
      rerender({ address: 'user123' });
      rerender({ address: 'user123' });
      rerender({ address: 'user123' });

      // Advance time by 30 seconds
      await advanceTimersAsync(30000);

      // Should only fetch once more (not 4 times - one per render)
      await waitFor(() => {
        expect(mockRankingDataModule.loadMockRankingData).toHaveBeenCalledTimes(2);
      });
    });
  });

  // ============================================================================
  // T042: Test ranking updates when ranking changes during auto-refresh
  // ============================================================================

  describe('T042: Ranking updates during auto-refresh', () => {
    it('should update userRanking when data changes on auto-refresh', async () => {
      // First data set - user is rank 1
      const initialData = createMockRankingData({
        miners: [
          {
            address: 'user123',
            hashrate: 10.0e12, // Highest hashrate = rank 1
          },
          {
            address: 'user2',
            hashrate: 8.0e12,
          },
          {
            address: 'user3',
            hashrate: 6.0e12,
          },
          {
            address: 'user4',
            hashrate: 4.0e12,
          },
          {
            address: 'user5',
            hashrate: 2.0e12,
          },
        ],
      });

      // Second data set - user is rank 5 (dropped to 5th)
      const updatedData = createMockRankingData({
        miners: [
          {
            address: 'user2',
            hashrate: 10.0e12,
          },
          {
            address: 'user3',
            hashrate: 8.0e12,
          },
          {
            address: 'user4',
            hashrate: 6.0e12,
          },
          {
            address: 'user5',
            hashrate: 4.0e12,
          },
          {
            address: 'user123',
            hashrate: 2.0e12, // Now lowest = rank 5
          },
        ],
      });

      // Mock returns initial data first, then updated data
      vi.mocked(mockRankingDataModule.loadMockRankingData)
        .mockResolvedValueOnce(initialData)
        .mockResolvedValueOnce(updatedData);

      const { result } = renderHook(() => useRanking('user123'));

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.userRanking?.position).toBe(1);
      });

      // Advance time to trigger auto-refresh
      await advanceTimersAsync(30000);

      // Wait for updated ranking
      await waitFor(() => {
        expect(result.current.userRanking?.position).toBe(5);
      });
    });

    it('should update hashrate when it changes during auto-refresh', async () => {
      const initialData = createMockRankingData({
        miners: [
          {
            address: 'user123',
            hashrate: 4.5e12,
          },
        ],
      });

      const updatedData = createMockRankingData({
        miners: [
          {
            address: 'user123',
            hashrate: 5.0e12, // Increased hashrate
          },
        ],
      });

      vi.mocked(mockRankingDataModule.loadMockRankingData)
        .mockResolvedValueOnce(initialData)
        .mockResolvedValueOnce(updatedData);

      const { result } = renderHook(() => useRanking('user123'));

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.userRanking?.hashrate).toBe(4.5e12);
      });

      // Trigger auto-refresh
      await advanceTimersAsync(30000);

      // Wait for updated hashrate
      await waitFor(() => {
        expect(result.current.userRanking?.hashrate).toBe(5.0e12);
      });
    });

    it('should handle user dropping out of rankings during auto-refresh', async () => {
      const initialData = createMockRankingData({
        miners: [
          {
            address: 'user123',
            hashrate: 4.5e12,
          },
        ],
      });

      // User no longer in top miners
      const updatedData = createMockRankingData({
        miners: [
          {
            address: 'otherUser',
            hashrate: 5.0e12,
          },
        ],
      });

      vi.mocked(mockRankingDataModule.loadMockRankingData)
        .mockResolvedValueOnce(initialData)
        .mockResolvedValueOnce(updatedData);

      const { result } = renderHook(() => useRanking('user123'));

      // Wait for initial fetch
      await waitFor(() => {
        expect(result.current.userRanking).not.toBeNull();
        expect(result.current.userRanking?.position).toBe(1);
      });

      // Trigger auto-refresh
      await advanceTimersAsync(30000);

      // User should now be null (not in rankings)
      await waitFor(() => {
        expect(result.current.userRanking).toBeNull();
      });
    });

    it('should continue auto-refresh even after fetch errors', async () => {
      const mockData = createMockRankingData();

      // First fetch fails, second succeeds
      vi.mocked(mockRankingDataModule.loadMockRankingData)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(mockData);

      const { result } = renderHook(() => useRanking('user123'));

      // Wait for initial fetch to fail
      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      // Advance time to trigger auto-refresh
      await advanceTimersAsync(30000);

      // Should retry and succeed
      await waitFor(() => {
        expect(result.current.error).toBeNull();
        expect(result.current.userRanking).not.toBeNull();
      });
    });
  });
});
