/**
 * TopPosition Component
 * Feature: Display user's ranking in the global miner leaderboard
 * Shows position badge with tooltip containing detailed ranking information
 */

import { useState } from 'react';
import type { UserRanking, RankingLoadingState } from '../types/dashboard';

interface TopPositionProps {
  /** User's ranking data */
  ranking: UserRanking | null;

  /** Loading state */
  loading: RankingLoadingState;
}

export const TopPosition = ({ ranking, loading }: TopPositionProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Don't render if loading or no ranking data
  if (loading.isLoading || !ranking) {
    return null;
  }

  // Error state
  if (loading.error) {
    return (
      <div
        className="flex items-center gap-2 rounded-full bg-red-900/20 px-3 py-1.5 text-xs text-red-400"
        title={loading.error}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Ranking Error</span>
      </div>
    );
  }

  // Determine badge styling based on position
  const isTopTen = ranking.isTopTen;
  const badgeClasses = isTopTen
    ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 text-yellow-300'
    : 'bg-white/5 border border-white/10 text-gray-300';

  const iconClasses = isTopTen ? 'text-yellow-400' : 'text-gray-400';

  return (
    <div className="relative">
      {/* Badge */}
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={`flex items-center gap-2 rounded-full px-3 py-1.5 transition-all duration-300 hover:scale-105 ${badgeClasses}`}
        aria-label={`Your ranking: Top ${ranking.position} out of ${ranking.totalMiners} miners`}
      >
        {/* Trophy/Star Icon for top 10 */}
        {isTopTen ? (
          <svg
            className={`h-4 w-4 ${iconClasses}`}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ) : (
          <svg
            className={`h-4 w-4 ${iconClasses}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        )}

        {/* Position Text */}
        <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wider">
          Top #{ranking.position}
        </span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg bg-forge-metaldark/95 p-4 shadow-xl backdrop-blur-sm"
          role="tooltip"
        >
          {/* Tooltip Arrow */}
          <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 bg-forge-metaldark/95" />

          {/* Tooltip Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-3 border-b border-white/10 pb-2">
              <h3 className="text-sm font-semibold text-white">Your Mining Rank</h3>
            </div>

            {/* Ranking Stats */}
            <div className="space-y-2 text-xs">
              {/* Position */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Position:</span>
                <span className="font-semibold text-white">
                  #{ranking.position} of {ranking.totalMiners.toLocaleString()}
                </span>
              </div>

              {/* Hashrate */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Hashrate:</span>
                <span className="font-semibold text-white">{ranking.hashrateFormatted}</span>
              </div>

              {/* Network Percentage */}
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Network Share:</span>
                <span className="font-semibold text-white">
                  {ranking.networkPercentage.toFixed(3)}%
                </span>
              </div>

              {/* Top 10 Badge */}
              {isTopTen && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-yellow-500/10 px-2 py-1.5">
                  <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-xs font-medium text-yellow-300">Elite Miner</span>
                </div>
              )}
            </div>

            {/* Footer Note */}
            <div className="mt-3 border-t border-white/10 pt-2">
              <p className="text-[10px] text-gray-500">
                Rankings update in real-time based on total hashrate.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
