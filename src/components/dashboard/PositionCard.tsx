/**
 * PositionCard Component
 * Displays a single LP position in collapsed view with key metrics
 */

import type { Position } from '../../types/dashboard';
import { formatUSD, formatPercentage } from '../../utils/formatters';

export interface PositionCardProps {
  position: Position;
  onClick?: () => void;
  isExpanded?: boolean;
}

export function PositionCard({ position, onClick, isExpanded = false }: PositionCardProps) {
  const { protocol } = position;

  console.log(position);

  // Determine PnL color (green for positive, red for negative)
  const pnlColor =
    position.analytics.variables.PnL.value > 0
      ? 'text-solana-green'
      : position.analytics.variables.PnL.value < 0
        ? 'text-red-500'
        : 'text-white';

  return (
    <div
      data-testid="position-card"
      data-position-id={position.id}
      onClick={onClick}
      className={`rounded-xl  bg-deep-gradient-transparent p-4 shadow-md shadow-solana-gray transition-all duration-200 hover:border-solana-purple hover:shadow-lg hover:shadow-solana-gray ${
        onClick ? 'cursor-pointer' : ''
      } md:p-6`}
    >
      {/* Header: Token Pair + Protocol */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white">
            {/* {tokenPair.tokenA.symbol}/{tokenPair.tokenB.symbol} */}
          </h3>
          <span className="rounded-full bg-solana-purple/20 px-3 py-1 text-xs font-medium text-solana-purple">
            $$SOLANA$$
            {/* {protocol} */}
          </span>
        </div>

        {/* Status Tags */}
        <div className="flex flex-wrap gap-2">
          {/* Range Status */}
          {/* {status.inRange ? ( */}
          {true ? (
            <span className="rounded-full bg-solana-green/20 px-3 py-1 text-xs font-medium text-solana-green">
              IN RANGE
            </span>
          ) : (
            <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-500">
              OUT OF RANGE
            </span>
          )}

          {/* Auto-Compound Tag */}
          {/* {status.autoCompound && ( */}
          {true && (
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
          {position.analytics.variables.V_pos.value}        
          </span>
        </div>

        {/* PnL */}
        <div className="flex flex-col">
          <span className="mb-1 text-xs text-gray-400">PnL</span>
          <span className={`text-base font-semibold ${pnlColor}`}>
            {position.analytics.variables.PnL.value}
          </span>
        </div>

        {/* APR */}
        <div className="flex flex-col">
          <span className="mb-1 text-xs text-gray-400">APR</span>
          <span className="text-base font-semibold text-white">
            {position.analytics.variables.TotalAPR.value}
          </span>
        </div>

        {/* Uncollected Fees */}
        <div className="flex flex-col">
          <span className="mb-1 text-xs text-gray-400">Uncollected Fees</span>
          <span className="text-base font-semibold text-white">{position.analytics.variables.F_uncol.value}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
        <button
          disabled
          className="group relative flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-forge-steel bg-forge-metalgray/50 px-3 py-2 text-xs font-medium text-gray-500 opacity-60 transition-all"
          title="Coming Soon"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Deposit</span>
          <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-forge-steel bg-forge-deepblack px-2 py-1 text-xs text-gray-300 shadow-lg group-hover:block">
            Coming Soon
          </span>
        </button>

        <button
          disabled
          className="group relative flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-forge-steel bg-forge-metalgray/50 px-3 py-2 text-xs font-medium text-gray-500 opacity-60 transition-all"
          title="Coming Soon"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
          <span>Withdraw</span>
          <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-forge-steel bg-forge-deepblack px-2 py-1 text-xs text-gray-300 shadow-lg group-hover:block">
            Coming Soon
          </span>
        </button>

        <button
          disabled
          className="group relative flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-forge-steel bg-forge-metalgray/50 px-3 py-2 text-xs font-medium text-gray-500 opacity-60 transition-all"
          title="Coming Soon"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Collect Fees</span>
          <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-forge-steel bg-forge-deepblack px-2 py-1 text-xs text-gray-300 shadow-lg group-hover:block">
            Coming Soon
          </span>
        </button>

        <button
          disabled
          className="group relative flex cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-forge-steel bg-forge-metalgray/50 px-3 py-2 text-xs font-medium text-gray-500 opacity-60 transition-all"
          title="Coming Soon"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Compound</span>
          <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded border border-forge-steel bg-forge-deepblack px-2 py-1 text-xs text-gray-300 shadow-lg group-hover:block">
            Coming Soon
          </span>
        </button>
      </div>

      {/* Price Range Info and Expand Button */}
      <div className="mt-4 flex items-center justify-between border-t border-forge-steel pt-4 text-xs">
        <div className="text-gray-400">
          <span>
            Range: xxx - yyy
            {/* Range: {formatUSD(priceRange.min)} - {formatUSD(priceRange.max)} */}
          </span>
          {/* <span className="ml-4">Current: {formatUSD(priceRange.current)}</span> */}
          <span className="ml-4">Current: xyz.xyz</span>
        </div>

        {onClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="flex items-center gap-1 font-medium text-solana-purple transition-colors hover:text-solana-cyan"
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            {isExpanded ? (
              <>
                <span>Collapse</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                <span>Details</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
