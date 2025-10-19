// src/components/swap/SwapSuccessAnimation.tsx
// Success animation component using canvas-confetti

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import type { SwapSuccessAnimationProps } from '../../types/swap';
import { SOLANA_COLORS } from '../../utils/jupiterConfig';

/**
 * SwapSuccessAnimation Component
 *
 * Displays celebratory confetti animation when a swap transaction succeeds.
 * This is a pure side-effect component that renders no visual output.
 *
 * @param txid - Transaction ID that triggers the animation (null = no animation)
 * @param onComplete - Callback fired after animation completes
 * @param colors - Custom confetti colors (defaults to Solana palette)
 * @param particleCount - Number of particles in main burst (default: 100)
 * @param duration - Animation duration in milliseconds (default: 3000)
 *
 * @example
 * ```tsx
 * <SwapSuccessAnimation
 *   txid={successTxid}
 *   onComplete={() => setSuccessTxid(null)}
 * />
 * ```
 */
export function SwapSuccessAnimation({
  txid,
  onComplete,
  colors = [
    SOLANA_COLORS.purple, // #9945FF
    SOLANA_COLORS.cyan, // #14F195
    SOLANA_COLORS.teal, // #00D4AA
    SOLANA_COLORS.pink, // #FF006E
  ],
  particleCount = 100,
  duration = 3000,
}: SwapSuccessAnimationProps) {
  useEffect(() => {
    // Only trigger confetti if txid is not null/undefined
    if (!txid) return;

    // Main burst - center explosion
    confetti({
      particleCount,
      spread: 70,
      origin: { y: 0.6 },
      colors,
      ticks: 200,
      gravity: 1.2,
      scalar: 1.2,
    });

    // Side burst 1 - left angle at 250ms
    const sideBurst1 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [colors[0], colors[1]], // Purple and cyan
        ticks: 150,
        gravity: 1.2,
        scalar: 1.0,
      });
    }, 250);

    // Side burst 2 - right angle at 400ms
    const sideBurst2 = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [colors[2], colors[3]], // Teal and pink
        ticks: 150,
        gravity: 1.2,
        scalar: 1.0,
      });
    }, 400);

    // Call onComplete after duration
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, duration);

    // Cleanup: clear all timeouts on unmount or txid change
    return () => {
      clearTimeout(sideBurst1);
      clearTimeout(sideBurst2);
      clearTimeout(completeTimer);
    };
  }, [txid, onComplete, colors, particleCount, duration]);

  // This component renders nothing - it's a pure side-effect component
  return null;
}
