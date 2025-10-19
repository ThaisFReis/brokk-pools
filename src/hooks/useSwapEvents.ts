// src/hooks/useSwapEvents.ts
// Custom hook for handling Jupiter Terminal swap events

import { useCallback } from 'react';
import { useSwapStore } from '../store/swapStore';
import { getExplorerUrl } from '../utils/jupiterConfig';
import type {
  SwapResult,
  JupiterOnSuccess,
  JupiterOnSwapError,
} from '../types/swap';
import { TransactionStatus } from '../types/swap';

/**
 * useSwapEvents Hook
 *
 * Provides event handlers for Jupiter Terminal swap events.
 * Wraps custom callbacks with store integration for transaction tracking.
 *
 * @param onSuccess - Optional custom success callback
 * @param onSwapError - Optional custom error callback
 * @returns Object with handleSuccess and handleError callbacks
 *
 * @example
 * ```tsx
 * const { handleSuccess, handleError } = useSwapEvents(
 *   (txid) => console.log('Success:', txid),
 *   (error) => console.error('Error:', error)
 * );
 *
 * <JupiterTerminal
 *   onSuccess={handleSuccess}
 *   onSwapError={handleError}
 * />
 * ```
 */
export function useSwapEvents(
  onSuccess?: JupiterOnSuccess,
  onSwapError?: JupiterOnSwapError
) {
  const { addSwapRecord } = useSwapStore();

  /**
   * Handle successful swap transactions
   *
   * This callback:
   * 1. Adds the transaction to the store's recent swaps
   * 2. Creates an explorer URL for the transaction
   * 3. Calls custom onSuccess callback if provided
   *
   * @param txid - Transaction signature
   * @param swapResult - Swap result data from Jupiter
   */
  const handleSuccess = useCallback(
    (txid: string, swapResult: SwapResult) => {
      // Convert amounts from base units to UI units
      // Note: Actual conversion would need token decimals
      // For now, using simple division as placeholder
      const inputAmount = parseFloat(swapResult.inAmount) / 1_000_000_000; // Assuming 9 decimals
      const outputAmount = parseFloat(swapResult.outAmount) / 1_000_000; // Assuming 6 decimals

      // Create explorer URL for the transaction
      const explorerUrl = getExplorerUrl(txid);

      // Add transaction to store
      addSwapRecord({
        txid,
        status: TransactionStatus.CONFIRMED,
        inputToken: {
          address: swapResult.inputMint,
          symbol: '', // Would be filled from token metadata
          name: '',
          logoURI: '',
          decimals: 9,
          verified: true,
        },
        outputToken: {
          address: swapResult.outputMint,
          symbol: '',
          name: '',
          logoURI: '',
          decimals: 6,
          verified: true,
        },
        inputAmount,
        outputAmount,
        timestamp: Date.now(),
        explorerUrl,
      });

      // Call custom callback if provided
      onSuccess?.(txid, swapResult);
    },
    [addSwapRecord, onSuccess]
  );

  /**
   * Handle swap errors
   *
   * This callback:
   * 1. Logs the error to console
   * 2. Calls custom onSwapError callback if provided
   *
   * @param error - Error object from swap failure
   */
  const handleError = useCallback(
    (error: Error) => {
      // Log error for debugging
      console.error('Swap failed:', error);

      // Call custom callback if provided
      onSwapError?.(error);
    },
    [onSwapError]
  );

  return {
    handleSuccess,
    handleError,
  };
}
