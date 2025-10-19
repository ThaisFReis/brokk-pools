/**
 * JupiterTerminalWrapper Component
 *
 * Wraps Jupiter Terminal with imperative API integration.
 * Uses init/close functions from @jup-ag/terminal package.
 *
 * Features:
 * - Integrates Jupiter swap terminal with Brokkr dark theme
 * - Manages swap success animations with confetti
 * - Persists slippage preferences via Zustand store
 * - Provides swap event handling through useSwapEvents hook
 *
 * @see https://docs.jup.ag/jupiter-terminal/jupiter-terminal
 */

import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import type { PublicKey } from '@solana/web3.js';
import { init, close } from '@jup-ag/terminal';
import { useSwapEvents } from '../../hooks/useSwapEvents';
import { SwapSuccessAnimation } from './SwapSuccessAnimation';
import type { SwapResult } from '../../types/swap';
import {
  JUPITER_CONFIG,
  BROKKR_THEME_CLASSES,
} from '../../utils/jupiterConfig';

/**
 * Jupiter Terminal SwapResult (from @jup-ag/terminal)
 * This is the actual type returned by Jupiter's onSuccess callback
 */
interface JupiterSwapResult {
  txid: string;
  inputAddress: PublicKey;
  outputAddress: PublicKey;
  inputAmount: number;
  outputAmount: number;
}

/**
 * JupiterTerminalWrapper Component Props
 */
export interface JupiterTerminalWrapperProps {
  /** Optional CSS class name for container */
  className?: string;

  /** Optional initial input token mint address */
  initialInputMint?: string;

  /** Optional initial output token mint address */
  initialOutputMint?: string;

  /** Optional initial amount to pre-fill */
  initialAmount?: string;

  /** Optional custom success callback */
  onSuccess?: (txid: string, swapResult: SwapResult) => void;

  /** Optional custom error callback */
  onError?: (error: string) => void;
}

/**
 * Container ID for Jupiter Terminal
 * Must be unique on the page
 */
const TERMINAL_CONTAINER_ID = 'jupiter-terminal-container';

/**
 * JupiterTerminalWrapper Component
 *
 * Renders Jupiter swap terminal with Brokkr Finance theme.
 * Manages lifecycle, event handling, and success animations.
 */
export function JupiterTerminalWrapper({
  className = '',
  initialInputMint,
  initialOutputMint,
  initialAmount,
  onSuccess: customOnSuccess,
  onError: customOnError,
}: JupiterTerminalWrapperProps) {
  const wallet = useWallet();
  const containerRef = useRef<HTMLDivElement>(null);
  const [successTxid, setSuccessTxid] = useState<string | null>(null);

  // Wrap custom callbacks with store integration
  const { handleSuccess, handleError } = useSwapEvents(
    (txid, swapResult) => {
      setSuccessTxid(txid);
      customOnSuccess?.(txid, swapResult);
    },
    (error) => {
      customOnError?.(error.message);
    }
  );

  /**
   * Initialize Jupiter Terminal on mount
   * Clean up on unmount
   */
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Jupiter Terminal with imperative API
    init({
      displayMode: 'integrated',
      integratedTargetId: TERMINAL_CONTAINER_ID,
      defaultExplorer: JUPITER_CONFIG.defaultExplorer as
        | 'Solana Explorer'
        | 'Solscan'
        | 'Solana Beach'
        | 'SolanaFM',
      containerClassName: BROKKR_THEME_CLASSES,

      // Enable wallet passthrough to use existing wallet adapter context
      enableWalletPassthrough: true,
      passthroughWalletContextState: wallet,

      // Form configuration
      formProps: {
        initialInputMint,
        initialOutputMint,
        initialAmount,
      },

      // Event handlers with correct signatures
      onSuccess: ({ txid, swapResult }) => {
        // Convert Jupiter's SwapResult to our SwapResult format
        const jupiterResult = swapResult as JupiterSwapResult;
        const ourResult: SwapResult = {
          txid,
          inputMint: jupiterResult.inputAddress.toString(),
          outputMint: jupiterResult.outputAddress.toString(),
          inAmount: jupiterResult.inputAmount.toString(),
          outAmount: jupiterResult.outputAmount.toString(),
        };
        handleSuccess(txid, ourResult);
      },
      onSwapError: ({ error }) => {
        if (error) {
          handleError(error as Error);
        }
      },
    });

    // Cleanup on unmount
    return () => {
      close();
    };
  }, [
    wallet,
    initialInputMint,
    initialOutputMint,
    initialAmount,
    handleSuccess,
    handleError,
  ]);

  /**
   * Reset success state after animation completes
   */
  const handleAnimationComplete = () => {
    setSuccessTxid(null);
  };

  return (
    <div className={`jupiter-terminal-wrapper ${className}`}>
      {/* Jupiter Terminal Container */}
      <div
        id={TERMINAL_CONTAINER_ID}
        ref={containerRef}
        className={`${BROKKR_THEME_CLASSES} relative z-0`}
        data-testid="jupiter-terminal-container"
      />

      {/* Success Animation */}
      <SwapSuccessAnimation
        txid={successTxid}
        onComplete={handleAnimationComplete}
      />
    </div>
  );
}
