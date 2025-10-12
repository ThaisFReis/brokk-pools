/**
 * PositionCard Component
 * Displays a single LP position in collapsed view with key metrics
 */

import type { Position } from '../../types/dashboard';
import { formatUSD, formatPercentage } from '../../utils/formatters';

export interface PositionCardProps {
  position: Position;
  onClick?: () => void;
}

export function PositionCard({ position, onClick }: PositionCardProps) {
  const { tokenPair, protocol, priceRange, status, pooledAssets, metrics, fees } = position;

  // Determine PnL color (green for positive, red for negative)
  const pnlColor =
    metrics.totalPnL > 0
      ? 'text-solana-green'
      : metrics.totalPnL < 0
        ? 'text-red-500'
        : 'text-white';

  return (
    <div
      data-testid="position-card"
      data-position-id={position.id}
      onClick={onClick}
      className={`rounded-xl border border-forge-steel bg-forge-metaldark p-4 transition-all duration-200 hover:border-solana-purple hover:shadow-lg ${
        onClick ? 'cursor-pointer' : ''
      } md:p-6`}
    >
      {/* Header: Token Pair + Protocol */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white">
            {tokenPair.tokenA.symbol}/{tokenPair.tokenB.symbol}
          </h3>
          <span className="rounded-full bg-solana-purple/20 px-3 py-1 text-xs font-medium text-solana-purple">
            {protocol}
          </span>
        </div>

        {/* Status Tags */}
        <div className="flex flex-wrap gap-2">
          {/* Range Status */}
          {status.inRange ? (
            <span className="rounded-full bg-solana-green/20 px-3 py-1 text-xs font-medium text-solana-green">
              IN RANGE
            </span>
          ) : (
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-500">
              OUT OF RANGE
            </span>
          )}

          {/* Auto-Compound Tag */}
          {status.autoCompound && (
            <span className="rounded-full bg-solana-cyan/20 px-3 py-1 text-xs font-medium text-solana-cyan">
              AUTO-COMPOUND
            </span>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Pooled Assets */}
        <div className="flex flex-col">
          <span className="mb-1 text-xs text-gray-400">Pooled Assets</span>
          <span className="text-base font-semibold text-white">
            {formatUSD(pooledAssets.totalValueUSD)}
          </span>
        </div>

        {/* PnL */}
        <div className="flex flex-col">
          <span className="mb-1 text-xs text-gray-400">PnL</span>
          <span className={`text-base font-semibold ${pnlColor}`}>
            {formatUSD(metrics.totalPnL, { showPositiveSign: true })}
          </span>
        </div>

        {/* APR */}
        <div className="flex flex-col">
          <span className="mb-1 text-xs text-gray-400">APR</span>
          <span className="text-base font-semibold text-white">
            {formatPercentage(metrics.totalAPR)}
          </span>
        </div>

        {/* Uncollected Fees */}
        <div className="flex flex-col">
          <span className="mb-1 text-xs text-gray-400">Uncollected Fees</span>
          <span className="text-base font-semibold text-white">{formatUSD(fees.uncollected)}</span>
        </div>
      </div>

      {/* Price Range Info (Optional - shown on hover or always) */}
      <div className="mt-4 flex items-center justify-between border-t border-forge-steel pt-4 text-xs text-gray-400">
        <span>
          Range: {formatUSD(priceRange.min)} - {formatUSD(priceRange.max)}
        </span>
        <span>Current: {formatUSD(priceRange.current)}</span>
      </div>
    </div>
  );
}
