/**
 * TopPosition Component
 * Feature: Top Position Ranking Badge (T024, T025, T027) + Tooltip (T035-T039)
 * Displays user's mining rank with dynamic styling, icons, and detailed tooltip
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Star, TrendingUp, MinusCircle, AlertCircle, RotateCw, Loader2 } from 'lucide-react';
import type { UserRanking } from '../types/dashboard';
import { formatHashrate, formatNetworkShare } from '../utils/ranking';

export interface TopPositionProps {
  /** User's ranking data (null if not ranked or wallet not connected) */
  ranking: UserRanking | null;

  /** Loading state */
  loading: boolean;

  /** Error message if fetch failed */
  error: string | null;

  /** Retry callback for error recovery */
  onRetry: () => void;
}

/**
 * TopPosition Badge Component with Tooltip
 *
 * Displays ranking badge with the following states:
 * - Loading: Shows spinner
 * - Ranked (Top 10): Golden gradient + Star icon
 * - Ranked (Standard): Blue/purple gradient + TrendingUp icon
 * - Not Ranked: Muted gray + MinusCircle icon
 * - Error: Red alert + AlertCircle icon + retry button
 *
 * Tooltip (User Story 2):
 * - Appears on hover/focus
 * - Shows detailed position, hashrate, network share
 * - "Elite Miner" badge for top 10
 * - Click-outside to dismiss on mobile
 *
 * @example
 * ```tsx
 * const { userRanking, loading, error, refetch } = useRanking(walletAddress);
 * <TopPosition
 *   ranking={userRanking}
 *   loading={loading}
 *   error={error}
 *   onRetry={refetch}
 * />
 * ```
 */
export const TopPosition = React.memo<TopPositionProps>(({
  ranking,
  loading,
  error,
  onRetry
}) => {
  // T035: Tooltip state management
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLButtonElement>(null);

  // T037: Click-outside-to-dismiss pattern for mobile
  useEffect(() => {
    if (!tooltipOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        tooltipRef.current &&
        badgeRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !badgeRef.current.contains(event.target as Node)
      ) {
        setTooltipOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [tooltipOpen]);

  // T038: Escape key handler to close tooltip
  useEffect(() => {
    if (!tooltipOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTooltipOpen(false);
        // Return focus to badge
        badgeRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [tooltipOpen]);

  // T039: Optimize tooltip performance - memoize formatted values
  const formattedData = useMemo(() => {
    if (!ranking) return null;

    const { value, unit } = formatHashrate(ranking.hashrate);
    const networkShareFormatted = formatNetworkShare(ranking.networkShare);

    return {
      hashrate: `${value.toFixed(value >= 10 ? 1 : 2)} ${unit}`,
      networkShare: networkShareFormatted,
      position: `#${ranking.position} of ${ranking.totalMiners.toLocaleString()}`,
    };
  }, [ranking]);

  // Loading state
  if (loading) {
    return (
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700"
        role="progressbar"
        aria-label="Loading ranking data"
      >
        <Loader2 className="w-4 h-4 animate-spin text-blue-400" aria-hidden="true" />
        <span className="text-sm text-gray-300">Loading...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900/20 border border-red-500/50 error alert red"
        data-testid="top-position-error"
      >
        <AlertCircle className="w-4 h-4 text-red-400 alert" data-icon="alert" aria-hidden="true" />
        <span className="text-sm text-red-300">{error}</span>
        <button
          onClick={onRetry}
          disabled={loading}
          className="ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-red-500/20 hover:bg-red-500/30 text-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Retry loading ranking data"
        >
          <RotateCw className="w-3 h-3" data-icon="rotate" aria-hidden="true" />
          Retry
        </button>
      </div>
    );
  }

  // Not ranked state (null ranking but no error)
  if (!ranking) {
    return (
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/30 border border-gray-700/50 muted gray inactive"
        data-testid="top-position-not-ranked"
      >
        <MinusCircle className="w-4 h-4 text-gray-500 minus" data-icon="minus-circle" aria-hidden="true" />
        <span className="text-sm text-gray-400">Not Ranked</span>
      </div>
    );
  }

  // Ranked state - determine styling based on position
  const isTopTen = ranking.isTopTen;
  const position = ranking.position;

  // Top 10: Golden gradient + Star icon
  // Standard (11+): Blue/purple gradient + TrendingUp icon
  const badgeStyles = isTopTen
    ? 'bg-gradient-to-r from-yellow-600/20 via-amber-500/20 to-yellow-600/20 border-yellow-500/50 golden-badge top-ten-badge gold'
    : 'bg-gradient-to-r from-blue-600/20 via-purple-500/20 to-blue-600/20 border-blue-500/50 standard-badge blue-badge blue purple';

  const textStyles = isTopTen
    ? 'text-yellow-200'
    : 'text-blue-200';

  const Icon = isTopTen ? Star : TrendingUp;
  const iconColor = isTopTen ? 'text-yellow-400' : 'text-blue-400';
  const iconDataAttr = isTopTen ? 'star' : 'trending';

  return (
    <div className="relative">
      {/* Badge */}
      <button
        ref={badgeRef}
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
        onFocus={() => setTooltipOpen(true)}
        onBlur={() => setTooltipOpen(false)}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-all gradient
          hover:scale-105 hover:shadow-lg
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900
          ${isTopTen ? 'focus:ring-yellow-500' : 'focus:ring-blue-500'}
          ${badgeStyles}
          min-h-[44px]
        `}
        data-testid="top-position-badge"
        aria-label={`Ranking position ${position}`}
        aria-expanded={tooltipOpen}
        aria-describedby={tooltipOpen ? 'ranking-tooltip' : undefined}
        tabIndex={0}
        type="button"
      >
        <Icon
          className={`w-4 h-4 ${iconColor} ${isTopTen ? 'star' : 'trending chart'}`}
          data-icon={iconDataAttr}
          aria-hidden="true"
        />
        <span className={`text-sm font-semibold ${textStyles}`}>
          Top #{position}
        </span>
      </button>

      {/* T036: Tooltip */}
      {tooltipOpen && formattedData && (
        <div
          ref={tooltipRef}
          id="ranking-tooltip"
          role="tooltip"
          className="absolute z-50 mt-2 w-64 rounded-lg bg-gray-900/95 border border-gray-700/50 p-4 shadow-xl backdrop-blur-sm transition-opacity duration-200 animate-in fade-in-0 zoom-in-95"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {/* Position */}
          <div className="mb-3 border-b border-gray-700/50 pb-2">
            <h3 className="text-sm font-semibold text-gray-200">
              {formattedData.position} miners
            </h3>
          </div>

          {/* Stats */}
          <div className="space-y-2 text-xs">
            {/* Hashrate */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Hashrate:</span>
              <span className="font-semibold text-white">{formattedData.hashrate}</span>
            </div>

            {/* Network Share */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Network Share:</span>
              <span className="font-semibold text-white">{formattedData.networkShare}</span>
            </div>
          </div>

          {/* T036: Elite Miner badge for top 10 */}
          {isTopTen && (
            <div className="mt-3 flex items-center gap-2 rounded-md bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 elite badge yellow gold">
              <Star className="w-3 h-3 text-yellow-400" aria-hidden="true" />
              <span className="text-xs font-medium text-yellow-300">Elite Miner</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

TopPosition.displayName = 'TopPosition';
