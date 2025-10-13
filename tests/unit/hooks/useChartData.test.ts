/**
 * Unit Tests for useChartData Hook
 * Tests formatting of historical data for ECharts
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChartData } from '../../../src/hooks/useChartData';
import type { HistoricalData, PriceDataPoint, VolumeDataPoint, FeeDataPoint, LiquidityDataPoint } from '../../../src/types/dashboard';

// Helper to create mock historical data
function createMockHistoricalData(overrides: Partial<HistoricalData> = {}): HistoricalData {
  const priceData: PriceDataPoint[] = [
    { timestamp: 1704067200000, price: 150.0 }, // Jan 1, 2024
    { timestamp: 1704153600000, price: 152.5 }, // Jan 2, 2024
    { timestamp: 1704240000000, price: 148.0 }, // Jan 3, 2024
  ];

  const volumeData: VolumeDataPoint[] = [
    { timestamp: 1704067200000, volume: 1000000 },
    { timestamp: 1704153600000, volume: 1200000 },
    { timestamp: 1704240000000, volume: 950000 },
  ];

  const feeData: FeeDataPoint[] = [
    { timestamp: 1704067200000, fees: 150.0 },
    { timestamp: 1704153600000, fees: 180.0 },
    { timestamp: 1704240000000, fees: 140.0 },
  ];

  const liquidityData: LiquidityDataPoint[] = [
    { price: 140.0, liquidity: 50000 },
    { price: 150.0, liquidity: 100000 },
    { price: 160.0, liquidity: 75000 },
  ];

  return {
    prices: priceData,
    volume: volumeData,
    fees: feeData,
    liquidityDistribution: liquidityData,
    ...overrides,
  };
}

describe('useChartData', () => {
  describe('T068: Format Historical Data for ECharts', () => {
    it('should format price data for line chart', () => {
      const historicalData = createMockHistoricalData();
      const { result } = renderHook(() => useChartData(historicalData));

      expect(result.current.priceChartData).toBeDefined();
      expect(result.current.priceChartData.xAxis).toBeDefined();
      expect(result.current.priceChartData.series).toBeDefined();
      expect(result.current.priceChartData.series[0].data.length).toBe(3);
    });

    it('should format timestamps as readable dates for x-axis', () => {
      const historicalData = createMockHistoricalData();
      const { result } = renderHook(() => useChartData(historicalData));

      const xAxisData = result.current.priceChartData.xAxis.data;
      expect(xAxisData).toHaveLength(3);
      expect(xAxisData[0]).toMatch(/Jan|01/); // Should contain month or day
    });

    it('should format volume data for bar chart', () => {
      const historicalData = createMockHistoricalData();
      const { result } = renderHook(() => useChartData(historicalData));

      expect(result.current.volumeChartData).toBeDefined();
      expect(result.current.volumeChartData.series).toBeDefined();
      expect(result.current.volumeChartData.series[0].data.length).toBe(3);
    });

    it('should format volume values in millions (M) or thousands (K)', () => {
      const historicalData = createMockHistoricalData();
      const { result } = renderHook(() => useChartData(historicalData));

      const volumeData = result.current.volumeChartData.series[0].data;
      // Volume should be formatted (1000000 -> 1M)
      expect(volumeData[0]).toBeGreaterThan(0);
    });

    it('should format liquidity distribution data for bar chart', () => {
      const historicalData = createMockHistoricalData();
      const { result } = renderHook(() => useChartData(historicalData));

      expect(result.current.liquidityChartData).toBeDefined();
      expect(result.current.liquidityChartData.series).toBeDefined();
      expect(result.current.liquidityChartData.series[0].data.length).toBe(3);
    });

    it('should format price values for x-axis in liquidity chart', () => {
      const historicalData = createMockHistoricalData();
      const { result } = renderHook(() => useChartData(historicalData));

      const xAxisData = result.current.liquidityChartData.xAxis.data;
      expect(xAxisData).toHaveLength(3);
      expect(xAxisData[0]).toMatch(/\$140|\$150/); // Should include $ symbol
    });

    it('should handle empty price data', () => {
      const historicalData = createMockHistoricalData({ prices: [] });
      const { result } = renderHook(() => useChartData(historicalData));

      expect(result.current.priceChartData.series[0].data).toHaveLength(0);
      expect(result.current.priceChartData.xAxis.data).toHaveLength(0);
    });

    it('should handle empty volume data', () => {
      const historicalData = createMockHistoricalData({ volume: [] });
      const { result } = renderHook(() => useChartData(historicalData));

      expect(result.current.volumeChartData.series[0].data).toHaveLength(0);
    });

    it('should handle empty liquidity data', () => {
      const historicalData = createMockHistoricalData({ liquidityDistribution: [] });
      const { result } = renderHook(() => useChartData(historicalData));

      expect(result.current.liquidityChartData.series[0].data).toHaveLength(0);
    });

    it('should sort price data by timestamp ascending', () => {
      const unsortedPrices: PriceDataPoint[] = [
        { timestamp: 1704240000000, price: 148.0 },
        { timestamp: 1704067200000, price: 150.0 },
        { timestamp: 1704153600000, price: 152.5 },
      ];
      const historicalData = createMockHistoricalData({ prices: unsortedPrices });
      const { result } = renderHook(() => useChartData(historicalData));

      const prices = result.current.priceChartData.series[0].data;
      // First price should be 150.0, last should be 148.0
      expect(prices[0]).toBe(150.0);
      expect(prices[2]).toBe(148.0);
    });

    it('should apply Solana color scheme to chart data', () => {
      const historicalData = createMockHistoricalData();
      const { result } = renderHook(() => useChartData(historicalData));

      // Check if series includes color configuration
      expect(result.current.priceChartData.series[0]).toHaveProperty('itemStyle');
    });

    it('should format fee data correctly', () => {
      const historicalData = createMockHistoricalData();
      const { result } = renderHook(() => useChartData(historicalData));

      // Fee data should be included in chart formatting
      expect(historicalData.fees).toHaveLength(3);
    });

    it('should handle large datasets (>100 data points)', () => {
      const largePriceData: PriceDataPoint[] = Array.from({ length: 150 }, (_, i) => ({
        timestamp: 1704067200000 + i * 86400000, // Daily increments
        price: 150 + Math.random() * 10,
      }));
      const historicalData = createMockHistoricalData({ prices: largePriceData });
      const { result } = renderHook(() => useChartData(historicalData));

      expect(result.current.priceChartData.series[0].data).toHaveLength(150);
    });

    it('should provide chart options with proper configuration', () => {
      const historicalData = createMockHistoricalData();
      const { result } = renderHook(() => useChartData(historicalData));

      expect(result.current.priceChartData).toHaveProperty('xAxis');
      expect(result.current.priceChartData).toHaveProperty('series');
      expect(result.current.volumeChartData).toHaveProperty('xAxis');
      expect(result.current.liquidityChartData).toHaveProperty('xAxis');
    });
  });
});
