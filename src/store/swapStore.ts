// src/store/swapStore.ts
// Zustand store for Token Swap state management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SwapTransaction, SwapStoreState } from '../types/swap';

/**
 * Global swap state store
 *
 * Persisted to localStorage under key 'brokkr-swap-storage'
 *
 * State includes:
 * - Tutorial/tooltip state (tooltipsEnabled, dismissedTooltips)
 * - Custom slippage preferences (for P2 feature)
 * - Recent swap history (optional, for UI enhancement)
 */
export const useSwapStore = create<SwapStoreState>()(
  persist(
    (set) => ({
      // Tutorial state
      tooltipsEnabled: true,
      dismissedTooltips: [],

      // P2: Custom slippage preferences
      customSlippageBps: 50, // 0.5% default
      lastUsedSlippageBps: 50,

      // Optional: Recent swaps (for UI enhancement)
      recentSwaps: [],
      maxRecentSwaps: 10,

      // Actions
      setTooltipsEnabled: (enabled: boolean) =>
        set({ tooltipsEnabled: enabled }),

      dismissTooltip: (id: string) =>
        set((state) => ({
          dismissedTooltips: [...state.dismissedTooltips, id],
        })),

      setCustomSlippageBps: (bps: number) =>
        set({
          customSlippageBps: bps,
          lastUsedSlippageBps: bps,
        }),

      addSwapRecord: (transaction: SwapTransaction) =>
        set((state) => ({
          recentSwaps: [transaction, ...state.recentSwaps].slice(
            0,
            state.maxRecentSwaps
          ),
        })),

      clearRecentSwaps: () =>
        set({ recentSwaps: [] }),
    }),
    {
      name: 'brokkr-swap-storage',
      // Optional: Customize which fields to persist
      partialize: (state) => ({
        tooltipsEnabled: state.tooltipsEnabled,
        dismissedTooltips: state.dismissedTooltips,
        customSlippageBps: state.customSlippageBps,
        lastUsedSlippageBps: state.lastUsedSlippageBps,
        recentSwaps: state.recentSwaps,
      }),
    }
  )
);

/**
 * Selectors for optimized re-renders
 * Use these to subscribe to specific parts of the store
 */
export const swapStoreSelectors = {
  tooltipsEnabled: (state: SwapStoreState) => state.tooltipsEnabled,
  dismissedTooltips: (state: SwapStoreState) => state.dismissedTooltips,
  customSlippageBps: (state: SwapStoreState) => state.customSlippageBps,
  recentSwaps: (state: SwapStoreState) => state.recentSwaps,
};
