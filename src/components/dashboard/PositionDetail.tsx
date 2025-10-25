/**
 * PositionDetail Component
 * Container for expanded position view with charts and metrics
 */

import { Suspense, lazy } from 'react';
import type { Position } from '../../types/dashboard';
import { MetricsTable } from './MetricsTable';
import { MobileChartSelector } from './MobileChartSelector';

// Lazy load chart components to reduce initial bundle size (T087)
// const LiquidityChart = lazy(() =>
//   import('./LiquidityChart').then((module) => ({
//     default: module.LiquidityChart,
//   }))
// );
// const PriceHistoryChart = lazy(() =>
//   import('./PriceHistoryChart').then((module) => ({
//     default: module.PriceHistoryChart,
//   }))
// );
// const VolumeChart = lazy(() =>
//   import('./VolumeChart').then((module) => ({
//     default: module.VolumeChart,
//   }))
// );

export interface PositionDetailProps {
  position: Position;
  onCollapse?: () => void;
}

// Loading skeleton for charts (T089)
// function ChartSkeleton() {
//   return <div className="h-[300px] animate-pulse rounded-lg bg-forge-metalgray" />;
// }

export function PositionDetail({ position, onCollapse }: PositionDetailProps) {
  return (
    <div className="mt-4 space-y-6 rounded-xl bg-deep-gradient-transparent p-6 shadow-md shadow-solana-gray transition-all duration-200 hover:shadow-lg hover:shadow-solana-gray">
      

      {/* Desktop Charts Grid (hidden on small screens) */}
      <div className="hidden grid-cols-1 gap-6 lg:grid lg:grid-cols-2">
        {/* Metrics Table */}
        <div>
          <MetricsTable position={position} />
        </div>
      </div>
    </div>
  );
}
