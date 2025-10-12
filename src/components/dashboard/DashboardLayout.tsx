/**
 * DashboardLayout Component
 * Main layout for the dashboard with wallet connection and content area
 */

import { useWallet } from '../../hooks/useWallet';
import { usePositions } from '../../hooks/usePositions';
import { SummaryCards } from './SummaryCards';
import { EmptyState } from './EmptyState';
import { PositionList } from './PositionList';

export function DashboardLayout() {
  const { connected } = useWallet();
  const { positions, summary, loading, error } = usePositions(connected);

  return (
    <div className="min-h-screen bg-cyberpunk-radial-gradient bg-no-repeat bg-cover">
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 mt-32">
        {!connected ? (
          // Not connected state
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-forge-metalgray"
              role="img"
              aria-hidden="true"
            >
              <svg
                className="h-12 w-12 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-400">Connect Your Wallet</h2>
            <p className="max-w-md text-center text-sm text-gray-500">
              Connect your Solana wallet to view your concentrated liquidity positions and track
              your portfolio performance.
            </p>
          </div>
        ) : error?.hasError ? (
          // Error state
          <div className="flex flex-col items-center justify-center py-16" role="alert">
            <div
              className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-900/20"
              role="img"
              aria-hidden="true"
            >
              <svg
                className="h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-red-400">Error Loading Positions</h2>
            <p className="mb-6 max-w-md text-center text-sm text-gray-400">{error.message}</p>
            {error.retry && (
              <button
                onClick={error.retry}
                className="rounded-lg bg-solana-purple px-6 py-3 font-medium text-white transition-colors hover:bg-solana-purple/80"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          // Connected state with data
          <>
            {/* Summary Cards - Load independently */}
            {summary ? (
              <SummaryCards summary={summary} loading={loading} />
            ) : (
              <SummaryCards
                summary={{
                  totalAssetsValue: 0,
                  totalPnL: 0,
                  totalUncollectedFees: 0,
                  positionCount: 0,
                  positionsInRange: 0,
                  positionsOutOfRange: 0,
                }}
                loading={loading}
              />
            )}

            {/* Position List or Empty State */}
            {!loading && positions.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="mt-8">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Your Positions ({positions.length})
                </h2>
                <PositionList positions={positions} loading={loading} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
