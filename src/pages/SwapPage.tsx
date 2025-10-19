/**
 * SwapPage Component
 *
 * Main page for token swapping powered by Jupiter Terminal.
 * Provides a user-friendly interface for swapping Solana tokens
 * with the best rates available on the network.
 *
 * Features:
 * - Jupiter Terminal integration for swap execution
 * - Dark cyberpunk styling matching Brokkr Finance theme
 * - Responsive design for mobile and desktop
 * - Success animations with confetti on swap completion
 * - Clear informational content about Jupiter Aggregator
 *
 * @example
 * ```tsx
 * // In App.tsx routing
 * <Route path="/swap" element={<SwapPage />} />
 * ```
 */

import { SwapContainer } from '../components/swap/SwapContainer';
import { JupiterTerminalWrapper } from '../components/swap/JupiterTerminalWrapper';

/**
 * SwapPage Component
 *
 * Renders the complete swap page with title, Jupiter Terminal,
 * and informational footer content.
 */
export function SwapPage() {
  return (
    <SwapContainer>
      {/* Page Header */}
      <div className="mb-8 text-center">
        {/* Icon and Title */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <h1 className="bg-clip-text font-title text-4xl font-bold text-transparent text-white mt-10">
            Token Swap
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-md mx-auto">
          Best rates on Solana powered by Jupiter
        </p>
      </div>

      {/* Jupiter Terminal Swap Interface */}
      <div className="mb-8">
        <JupiterTerminalWrapper />
      </div>

      {/* Informational Footer */}
      <div className="space-y-3 text-center">
        {/* Jupiter Attribution */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
          <div className="h-px w-8 bg-gray-700" />
          <span>Swaps powered by Jupiter Aggregator</span>
          <div className="h-px w-8 bg-gray-700" />
        </div>

        {/* Safety Disclaimer */}
        <p className="text-xs text-gray-600 max-w-sm mx-auto">
          Always verify transaction details before confirming. Brokkr Finance does not hold
          custody of your funds.
        </p>

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-gray-500">
          <div className="flex flex-col items-center gap-1">
            <span className="text-solana-cyan font-semibold">Best Prices</span>
            <span className="text-gray-600">Aggregated from multiple DEXs</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-solana-purple font-semibold">Low Fees</span>
            <span className="text-gray-600">Optimized routing for savings</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-cyberpunk-pink font-semibold">Fast Execution</span>
            <span className="text-gray-600">Near-instant transaction finality</span>
          </div>
        </div>
      </div>
    </SwapContainer>
  );
}
