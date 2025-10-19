/**
 * MobileChartSelector Component
 * Mobile-friendly chart selector with buttons for switching between different chart types
 */

import { useState, Suspense, lazy } from 'react';
import type { Position } from '../../types/dashboard';

// Lazy load chart components
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

export interface MobileChartSelectorProps {
  position: Position;
}

type ChartType = 'liquidity' | 'price' | 'volume';

interface ChartOption {
  id: ChartType;
  label: string;
  icon: JSX.Element;
  description: string;
}

// Chart options configuration
const chartOptions: ChartOption[] = [
  {
    id: 'liquidity',
    label: 'Liquidez',
    description: 'Distribuição de Liquidez',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    id: 'price',
    label: 'Preço',
    description: 'Histórico de Preços (30 dias)',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
  {
    id: 'volume',
    label: 'Volume',
    description: 'Volume de Trading',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
];

// Loading skeleton for charts
function ChartSkeleton() {
  return <div className="h-[280px] animate-pulse rounded-lg bg-forge-metalgray/50" />;
}

export function MobileChartSelector({ position }: MobileChartSelectorProps) {
  const [activeChart, setActiveChart] = useState<ChartType>('liquidity');

  const renderChart = () => {
    switch (activeChart) {
      case 'liquidity':
        return (
          <Suspense fallback={<ChartSkeleton />}>
            <LiquidityChart
              liquidityData={position.historicalData.liquidityDistribution}
              priceRange={position.priceRange}
            />
          </Suspense>
        );
      case 'price':
        return (
          <Suspense fallback={<ChartSkeleton />}>
            <PriceHistoryChart priceData={position.historicalData.prices} />
          </Suspense>
        );
      case 'volume':
        return (
          <Suspense fallback={<ChartSkeleton />}>
            <VolumeChart volumeData={position.historicalData.volume} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  const activeOption = chartOptions.find((option) => option.id === activeChart);

  return (
    <div className="space-y-4">
      {/* Chart Selection Buttons */}
      <div className="mobile-chart-buttons-container flex overflow-x-auto pb-2">
        <div className="flex space-x-2 px-1">
          {chartOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveChart(option.id)}
              className={`
                mobile-chart-button flex flex-col items-center justify-center rounded-xl px-4 py-3 text-xs font-medium
                ${
                  activeChart === option.id
                    ? 'mobile-chart-button-active'
                    : 'mobile-chart-button-inactive'
                }
              `}
              aria-label={`Mostrar gráfico de ${option.label}`}
            >
              <div className="mb-1">{option.icon}</div>
              <span className="whitespace-nowrap">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="rounded-lg bg-forge-metaldark p-4 shadow-inner-glow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            {activeOption?.description}
          </h3>
          
          {/* Chart indicator dots */}
          <div className="flex space-x-1">
            {chartOptions.map((option) => (
              <div
                key={option.id}
                className={`
                  chart-indicator-dot h-2 w-2 rounded-full
                  ${
                    activeChart === option.id
                      ? 'chart-indicator-dot-active'
                      : 'chart-indicator-dot-inactive'
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* Chart Display Area */}
        <div className="mobile-chart-container relative">
          {renderChart()}
        </div>
      </div>

      {/* Chart Navigation Hint */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          Toque nos botões acima para alternar entre os gráficos
        </p>
      </div>
    </div>
  );
}