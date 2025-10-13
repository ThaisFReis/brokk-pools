/**
 * useChartData Hook
 * Formats historical data for ECharts visualization
 */

import { useMemo } from 'react';
import type { HistoricalData } from '../types/dashboard';
import { formatUSD } from '../utils/formatters';

export interface ChartData {
  xAxis: {
    data: string[];
    type?: string;
  };
  series: Array<{
    data: number[];
    type: string;
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemStyle?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    areaStyle?: any;
  }>;
}

export interface UseChartDataReturn {
  priceChartData: ChartData;
  volumeChartData: ChartData;
  liquidityChartData: ChartData;
}

// Solana color palette
const COLORS = {
  purple: '#9945FF',
  cyan: '#14F195',
  blue: '#4E44CE',
  green: '#19FB9B',
};

export function useChartData(historicalData: HistoricalData): UseChartDataReturn {
  // Format price history data
  const priceChartData = useMemo(() => {
    const sortedPrices = [...historicalData.prices].sort((a, b) => a.timestamp - b.timestamp);

    return {
      xAxis: {
        data: sortedPrices.map((point) =>
          new Date(point.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        ),
        type: 'category',
      },
      series: [
        {
          data: sortedPrices.map((point) => point.price),
          type: 'line',
          name: 'Price',
          itemStyle: {
            color: COLORS.cyan,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: COLORS.cyan + '40' },
                { offset: 1, color: COLORS.cyan + '00' },
              ],
            },
          },
        },
      ],
    };
  }, [historicalData.prices]);

  // Format volume data
  const volumeChartData = useMemo(() => {
    const sortedVolume = [...historicalData.volume].sort((a, b) => a.timestamp - b.timestamp);

    return {
      xAxis: {
        data: sortedVolume.map((point) =>
          new Date(point.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        ),
        type: 'category',
      },
      series: [
        {
          data: sortedVolume.map((point) => point.volume),
          type: 'bar',
          name: 'Volume',
          itemStyle: {
            color: COLORS.purple,
          },
        },
      ],
    };
  }, [historicalData.volume]);

  // Format liquidity distribution data
  const liquidityChartData = useMemo(() => {
    const sortedLiquidity = [...historicalData.liquidityDistribution].sort(
      (a, b) => a.price - b.price
    );

    return {
      xAxis: {
        data: sortedLiquidity.map((point) => formatUSD(point.price)),
        type: 'category',
      },
      series: [
        {
          data: sortedLiquidity.map((point) => point.liquidity),
          type: 'bar',
          name: 'Liquidity',
          itemStyle: {
            color: COLORS.blue,
          },
        },
      ],
    };
  }, [historicalData.liquidityDistribution]);

  return {
    priceChartData,
    volumeChartData,
    liquidityChartData,
  };
}
