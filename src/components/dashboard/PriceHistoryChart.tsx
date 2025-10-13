/**
 * PriceHistoryChart Component
 * Displays 30-day price history as a line chart
 */

import ReactECharts from 'echarts-for-react';
import type { PriceDataPoint } from '../../types/dashboard';
import { formatUSD } from '../../utils/formatters';

export interface PriceHistoryChartProps {
  priceData: PriceDataPoint[];
}

export function PriceHistoryChart({ priceData }: PriceHistoryChartProps) {
  // Handle empty data
  if (priceData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-forge-metaldark">
        <div className="text-center">
          <p className="text-sm text-gray-400">Historical data unavailable for this pair</p>
        </div>
      </div>
    );
  }

  // Sort data by timestamp
  const sortedData = [...priceData].sort((a, b) => a.timestamp - b.timestamp);

  // Prepare chart data
  const xAxisData = sortedData.map((point) =>
    new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  );
  const seriesData = sortedData.map((point) => point.price);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: '#14F195',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
      },
      formatter: (params: any) => {
        const param = params[0];
        return `
          <div style="padding: 4px 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${param.name}</div>
            <div>Price: ${formatUSD(param.value)}</div>
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
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#333',
        },
      },
      axisLabel: {
        color: '#9CA3AF',
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
        formatter: (value: number) => formatUSD(value),
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
        name: 'Price',
        type: 'line',
        smooth: true,
        data: seriesData,
        lineStyle: {
          color: '#14F195',
          width: 2,
        },
        itemStyle: {
          color: '#14F195',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(20, 241, 149, 0.3)' },
              { offset: 1, color: 'rgba(20, 241, 149, 0)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: false,
        emphasis: {
          focus: 'series',
          itemStyle: {
            borderColor: '#14F195',
            borderWidth: 2,
          },
        },
      },
    ],
  };

  return (
    <ReactECharts
      option={option}
      style={{ height: '300px', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}
