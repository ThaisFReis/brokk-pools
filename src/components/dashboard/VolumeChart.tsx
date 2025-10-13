/**
 * VolumeChart Component
 * Displays trading volume history as a bar chart
 */

import ReactECharts from 'echarts-for-react';
import type { VolumeDataPoint } from '../../types/dashboard';
import { formatLargeNumber } from '../../utils/formatters';

export interface VolumeChartProps {
  volumeData: VolumeDataPoint[];
}

export function VolumeChart({ volumeData }: VolumeChartProps) {
  // Handle empty data
  if (volumeData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center rounded-lg bg-forge-metaldark">
        <div className="text-center">
          <p className="text-sm text-gray-400">Historical data unavailable for this pair</p>
        </div>
      </div>
    );
  }

  // Sort data by timestamp
  const sortedData = [...volumeData].sort((a, b) => a.timestamp - b.timestamp);

  // Prepare chart data
  const xAxisData = sortedData.map((point) =>
    new Date(point.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  );
  const seriesData = sortedData.map((point) => point.volume);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      borderColor: '#9945FF',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      formatter: (params: any) => {
        const param = params[0];
        return `
          <div style="padding: 4px 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${param.name}</div>
            <div>Volume: $${formatLargeNumber(param.value)}</div>
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
        formatter: (value: number) => '$' + formatLargeNumber(value),
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
        name: 'Volume',
        type: 'bar',
        data: seriesData,
        itemStyle: {
          color: '#9945FF',
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 40,
        emphasis: {
          itemStyle: {
            color: '#B877FF',
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
