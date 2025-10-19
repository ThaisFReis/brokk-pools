/**
 * SwapContainer Component
 *
 * Layout container for the swap page that provides consistent spacing,
 * centering, and dark background styling matching the Brokkr Finance theme.
 *
 * Features:
 * - Dark background with solana-gray (#060606)
 * - Centered content with max-width constraint
 * - Responsive padding for mobile and desktop
 * - Header clearance for fixed navigation
 * - Bottom padding for scrolling comfort
 *
 * @example
 * ```tsx
 * <SwapContainer>
 *   <h1>Token Swap</h1>
 *   <JupiterTerminalWrapper />
 * </SwapContainer>
 * ```
 */

import type { ReactNode } from 'react';

/**
 * SwapContainer Props
 */
export interface SwapContainerProps {
  /** Child components to render inside the container */
  children: ReactNode;

  /** Optional additional CSS classes */
  className?: string;
}

/**
 * SwapContainer Component
 *
 * Provides a centered, padded container for swap page content
 * with dark background and responsive spacing.
 */
export function SwapContainer({ children, className = '' }: SwapContainerProps) {
  return (
    <div
      className={`
        min-h-screen
        flex
        flex-col
        items-center
        pt-24
        pb-16
        px-4
        sm:px-6
        md:px-8
        ${className}
      `}
    >
      <div className="w-full max-w-lg">
        {children}
      </div>
    </div>
  );
}
