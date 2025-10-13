/**
 * LiquidityChart Component
 * Displays liquidity distribution across price ranges
 */

import ReactECharts from 'echarts-for-react';
import type { LiquidityDataPoint, PriceRange } from '../../types/dashboard';
import { formatUSD, formatLargeNumber } from '../../utils/formatters';

export interface LiquidityChartProps {
  liquidityData: LiquidityDataPoint[];
  priceRange: PriceRange;
}

export function LiquidityChart({ liquidityData, priceRange }: LiquidityChartProps) {
  // Handle empty data
  if (liquidityData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-forge-metaldark">
        <div className="text-center">
          <p className="text-sm text-gray-400">Historical data unavailable for this pair</p>
        </div>
      </div>
    );
  }

  // Sort data by price
  const sortedData = [...liquidityData].sort((a, b) => a.price - b.price);

  // Prepare chart data
  const xAxisData = sortedData.map((point) => formatUSD(point.price));
  const seriesData = sortedData.map((point, index) => {
    const price = sortedData[index].price;
    const isInRange = price >= priceRange.min && price <= priceRange.max;

    return {
      value: point.liquidity,
      itemStyle: {
        color: isInRange ? '#14F195' : '#4E44CE', // Cyan for in-range, blue otherwise
      },
    };
  });

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: '#4E44CE',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
      },
      formatter: (params: any) => {
        const param = params[0];
        return `
          <div style="padding: 4px 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">Price: ${param.name}</div>
            <div>Liquidity: ${formatUSD(param.value)}</div>
          </div>
        `;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      axisLine: {
        lineStyle: {
          color: '#333',
        },
      },
      axisLabel: {
        color: '#9CA3AF',
        rotate: 45,
        fontSize: 10,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#333',
        },
      },
      axisLabel: {
        color: '#9CA3AF',
        formatter: (value: number) => formatLargeNumber(value),
      },
      splitLine: {
        lineStyle: {
          color: '#333',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: 'Liquidity',
        type: 'bar',
        data: seriesData,
        barMaxWidth: 40,
      },
    ],
    // Mark price range
    markArea: {
      silent: true,
      data: [
        [
          {
            name: 'Position Range',
            xAxis: formatUSD(priceRange.min),
            itemStyle: {
              color: 'rgba(20, 241, 149, 0.1)',
            },
          },
          {
            xAxis: formatUSD(priceRange.max),
          },
        ],
      ],
    },
  };

  return (
    <div className="relative" data-price-range="true">
      <ReactECharts
        option={option}
        style={{ height: '300px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
      <div className="absolute right-4 top-4 flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-solana-cyan" />
          <span className="text-gray-400">In Range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 rounded-full bg-solana-blue" />
          <span className="text-gray-400">Out of Range</span>
        </div>
      </div>
    </div>
  );
}
