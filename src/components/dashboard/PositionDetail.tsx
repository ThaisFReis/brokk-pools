/**
 * PositionDetail Component
 * Container for expanded position view with charts and metrics
 */

import { Suspense, lazy } from 'react';
import type { Position } from '../../types/dashboard';
import { MetricsTable } from './MetricsTable';
import { MobileChartSelector } from './MobileChartSelector';

// Lazy load chart components to reduce initial bundle size (T087)
const LiquidityChart = lazy(() =>
  import('./LiquidityChart').then((module) => ({
    default: module.LiquidityChart,
  }))
);
const PriceHistoryChart = lazy(() =>
  import('./PriceHistoryChart').then((module) => ({
    default: module.PriceHistoryChart,
  }))
);
const VolumeChart = lazy(() =>
  import('./VolumeChart').then((module) => ({
    default: module.VolumeChart,
  }))
);

export interface PositionDetailProps {
  position: Position;
  onCollapse?: () => void;
}

// Loading skeleton for charts (T089)
function ChartSkeleton() {
  return <div className="h-[300px] animate-pulse rounded-lg bg-forge-metalgray" />;
}

export function PositionDetail({ position, onCollapse }: PositionDetailProps) {
  return (
    <div className="mt-4 space-y-6 rounded-xl bg-deep-gradient-transparent p-6 shadow-md shadow-solana-gray transition-all duration-200 hover:shadow-lg hover:shadow-solana-gray">
      {/* Header with collapse button */}
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-bold text-white">
          {position.tokenPair.tokenA.symbol}/{position.tokenPair.tokenB.symbol} Position Details
        </h2>
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="flex items-center gap-2 rounded-lg bg-forge-metaldark px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-forge-metalgray"
            aria-label="Collapse position details"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span>Collapse</span>
          </button>
        )}
      </div>

      {/* Mobile Chart Selector (visible on small screens) */}
      <div className="lg:hidden">
        <MobileChartSelector position={position} />
        
        {/* Metrics Table for Mobile */}
        <div className="mt-6">
          <MetricsTable position={position} />
        </div>
      </div>

      {/* Desktop Charts Grid (hidden on small screens) */}
      <div className="hidden grid-cols-1 gap-6 lg:grid lg:grid-cols-2">
        {/* Liquidity Distribution Chart */}
        <div className="rounded-lg bg-forge-metaldark p-4 shadow-inner-glow">
          <h3 className="mb-4 text-sm font-semibold text-white">Liquidity Distribution</h3>
          <Suspense fallback={<ChartSkeleton />}>
            <LiquidityChart
              liquidityData={position.historicalData.liquidityDistribution}
              priceRange={position.priceRange}
            />
          </Suspense>
        </div>

        {/* Price History Chart */}
        <div className="rounded-lg bg-forge-metaldark p-4 shadow-inner-glow">
          <h3 className="mb-4 text-sm font-semibold text-white">Price History (30 Days)</h3>
          <Suspense fallback={<ChartSkeleton />}>
            <PriceHistoryChart priceData={position.historicalData.prices} />
          </Suspense>
        </div>

        {/* Volume Chart */}
        <div className="rounded-lg bg-forge-metaldark p-4 shadow-inner-glow">
          <h3 className="mb-4 text-sm font-semibold text-white">Trading Volume</h3>
          <Suspense fallback={<ChartSkeleton />}>
            <VolumeChart volumeData={position.historicalData.volume} />
          </Suspense>
        </div>

        {/* Metrics Table */}
        <div>
          <MetricsTable position={position} />
        </div>
      </div>
    </div>
  );
}
