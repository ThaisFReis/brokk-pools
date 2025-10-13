/**
 * Unit Tests: Calculations
 * Tests all financial calculation functions for correctness
 */

import { describe, it, expect } from 'vitest';
import {
  calculateHODLValue,
  calculatePnL,
  calculateImpermanentLoss,
  calculateROI,
  calculateAggregatedMetrics,
} from '../../../src/utils/calculations';
import type { Position, InitialAssets } from '../../../src/types/dashboard';
import { Protocol } from '../../../src/types/dashboard';

describe('calculateHODLValue', () => {
  it('should calculate HODL value correctly', () => {
    const initialAssets: InitialAssets = {
      tokenAAmount: 10,
      tokenBAmount: 100,
      timestamp: '2024-01-01T00:00:00Z',
    };

    // 10 tokens at $150 + 100 tokens at $1 = $1600
    expect(calculateHODLValue(initialAssets, 150, 1)).toBe(1600);
  });

  it('should handle zero initial amounts', () => {
    const initialAssets: InitialAssets = {
      tokenAAmount: 0,
      tokenBAmount: 100,
      timestamp: '2024-01-01T00:00:00Z',
    };

    expect(calculateHODLValue(initialAssets, 150, 1)).toBe(100);
  });

  it('should handle zero prices', () => {
    const initialAssets: InitialAssets = {
      tokenAAmount: 10,
      tokenBAmount: 100,
      timestamp: '2024-01-01T00:00:00Z',
    };

    expect(calculateHODLValue(initialAssets, 0, 0)).toBe(0);
  });

  it('should handle large values', () => {
    const initialAssets: InitialAssets = {
      tokenAAmount: 1000000,
      tokenBAmount: 500000,
      timestamp: '2024-01-01T00:00:00Z',
    };

    // 1M * $150 + 500K * $1 = $150.5M
    expect(calculateHODLValue(initialAssets, 150, 1)).toBe(150500000);
  });

  it('should handle decimal amounts', () => {
    const initialAssets: InitialAssets = {
      tokenAAmount: 10.5,
      tokenBAmount: 100.25,
      timestamp: '2024-01-01T00:00:00Z',
    };

    // 10.5 * $152.34 + 100.25 * $1 = $1699.82
    expect(calculateHODLValue(initialAssets, 152.34, 1)).toBeCloseTo(1699.82, 2);
  });
});

describe('calculatePnL', () => {
  const createMockPosition = (
    currentValueUSD: number,
    initialTokenA: number,
    initialTokenB: number,
  ): Position => ({
    id: 'test-position',
    protocol: Protocol.Orca,
    tokenPair: {
      tokenA: {
        symbol: 'SOL',
        name: 'Solana',
        mint: 'So11111111111111111111111111111111111111112',
        decimals: 9,
      },
      tokenB: {
        symbol: 'USDC',
        name: 'USD Coin',
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        decimals: 6,
      },
      currentPrice: 150,
    },
    priceRange: { min: 140, max: 180, current: 150 },
    status: { inRange: true, autoCompound: false },
    pooledAssets: {
      tokenAAmount: 10,
      tokenBAmount: 100,
      totalValueUSD: currentValueUSD,
    },
    initialAssets: {
      tokenAAmount: initialTokenA,
      tokenBAmount: initialTokenB,
      timestamp: '2024-01-01T00:00:00Z',
    },
    metrics: {
      totalPnL: 0,
      roi: 0,
      impermanentLoss: 0,
      totalAPR: 0,
      feeAPR: 0,
      gasCosts: 0,
      netProfit: 0,
      ageInDays: 30,
    },
    fees: {
      totalEarned: 0,
      uncollected: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
    },
    historicalData: {
      prices: [],
      volume: [],
      fees: [],
      liquidityDistribution: [],
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  });

  it('should calculate positive PnL (profit)', () => {
    // Current LP value: $1700
    // HODL value: 10 * $150 + 100 * $1 = $1600
    // PnL: $1700 - $1600 = +$100
    const position = createMockPosition(1700, 10, 100);
    expect(calculatePnL(position, 150, 1)).toBe(100);
  });

  it('should calculate negative PnL (loss)', () => {
    // Current LP value: $1500
    // HODL value: 10 * $150 + 100 * $1 = $1600
    // PnL: $1500 - $1600 = -$100
    const position = createMockPosition(1500, 10, 100);
    expect(calculatePnL(position, 150, 1)).toBe(-100);
  });

  it('should calculate zero PnL (break-even)', () => {
    // Current LP value: $1600
    // HODL value: 10 * $150 + 100 * $1 = $1600
    // PnL: $1600 - $1600 = $0
    const position = createMockPosition(1600, 10, 100);
    expect(calculatePnL(position, 150, 1)).toBe(0);
  });

  it('should handle price changes', () => {
    // Current LP value: $2000
    // HODL value: 10 * $200 + 100 * $1 = $2100
    // PnL: $2000 - $2100 = -$100 (impermanent loss despite price increase)
    const position = createMockPosition(2000, 10, 100);
    expect(calculatePnL(position, 200, 1)).toBe(-100);
  });

  it('should handle very large positions', () => {
    // Current LP value: $1,000,000
    // HODL value: 1000 * $150 + 100000 * $1 = $250,000
    // PnL: $1M - $250K = +$750K
    const position = createMockPosition(1000000, 1000, 100000);
    expect(calculatePnL(position, 150, 1)).toBe(750000);
  });

  it('should handle decimal precision', () => {
    const position = createMockPosition(1234.56, 10.5, 100.25);
    const pnl = calculatePnL(position, 152.34, 1);
    expect(pnl).toBeCloseTo(1234.56 - 1699.82, 1);
  });
});

describe('calculateImpermanentLoss', () => {
  const createMockPosition = (
    currentValueUSD: number,
    initialTokenA: number,
    initialTokenB: number,
  ): Position => ({
    id: 'test-position',
    protocol: Protocol.Raydium,
    tokenPair: {
      tokenA: {
        symbol: 'ETH',
        name: 'Ethereum',
        mint: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
        decimals: 8,
      },
      tokenB: {
        symbol: 'USDC',
        name: 'USD Coin',
        mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        decimals: 6,
      },
      currentPrice: 3000,
    },
    priceRange: { min: 2800, max: 3500, current: 3000 },
    status: { inRange: true, autoCompound: false },
    pooledAssets: {
      tokenAAmount: 1,
      tokenBAmount: 1000,
      totalValueUSD: currentValueUSD,
    },
    initialAssets: {
      tokenAAmount: initialTokenA,
      tokenBAmount: initialTokenB,
      timestamp: '2024-01-01T00:00:00Z',
    },
    metrics: {
      totalPnL: 0,
      roi: 0,
      impermanentLoss: 0,
      totalAPR: 0,
      feeAPR: 0,
      gasCosts: 0,
      netProfit: 0,
      ageInDays: 60,
    },
    fees: {
      totalEarned: 0,
      uncollected: 0,
      daily: 0,
      weekly: 0,
      monthly: 0,
    },
    historicalData: {
      prices: [],
      volume: [],
      fees: [],
      liquidityDistribution: [],
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  });

  it('should calculate IL same as PnL (negative IL = loss)', () => {
    // Current LP value: $3500
    // HODL value: 1 * $3000 + 1000 * $1 = $4000
    // IL: $3500 - $4000 = -$500 (impermanent loss)
    const position = createMockPosition(3500, 1, 1000);
    const il = calculateImpermanentLoss(position, 3000, 1);
    const pnl = calculatePnL(position, 3000, 1);
    expect(il).toBe(pnl);
    expect(il).toBe(-500);
  });

  it('should calculate positive IL (rare, usually from fees)', () => {
    // Current LP value: $4500 (includes fees)
    // HODL value: 1 * $3000 + 1000 * $1 = $4000
    // IL: $4500 - $4000 = +$500 (positive from fees)
    const position = createMockPosition(4500, 1, 1000);
    const il = calculateImpermanentLoss(position, 3000, 1);
    expect(il).toBe(500);
  });

  it('should handle zero IL (perfect balance)', () => {
    const position = createMockPosition(4000, 1, 1000);
    const il = calculateImpermanentLoss(position, 3000, 1);
    expect(il).toBe(0);
  });
});

describe('calculateROI', () => {
  it('should calculate positive ROI', () => {
    // Gained $100 on $1000 investment = 10% ROI
    expect(calculateROI(1100, 1000)).toBe(10);
  });

  it('should calculate negative ROI', () => {
    // Lost $100 on $1000 investment = -10% ROI
    expect(calculateROI(900, 1000)).toBe(-10);
  });

  it('should calculate zero ROI (break-even)', () => {
    expect(calculateROI(1000, 1000)).toBe(0);
  });

  it('should calculate 100% ROI (doubled)', () => {
    expect(calculateROI(2000, 1000)).toBe(100);
  });

  it('should calculate 150% ROI (2.5x)', () => {
    expect(calculateROI(2500, 1000)).toBe(150);
  });

  it('should calculate -50% ROI (half lost)', () => {
    expect(calculateROI(500, 1000)).toBe(-50);
  });

  it('should handle zero initial value', () => {
    // Edge case: avoid division by zero
    expect(calculateROI(1000, 0)).toBe(0);
  });

  it('should handle decimal precision', () => {
    // $1234.56 profit on $10000 = 12.3456% ROI
    expect(calculateROI(11234.56, 10000)).toBeCloseTo(12.3456, 4);
  });

  it('should handle very large ROI', () => {
    // 10x return = 900% ROI
    expect(calculateROI(10000, 1000)).toBe(900);
  });

  it('should handle very small ROI', () => {
    // $0.01 gain on $10000 = 0.0001% ROI
    expect(calculateROI(10000.01, 10000)).toBeCloseTo(0.0001, 4);
  });
});

describe('calculateAggregatedMetrics', () => {
  const createMockPosition = (
    id: string,
    totalValueUSD: number,
    totalPnL: number,
    uncollectedFees: number,
    inRange: boolean,
  ): Position => ({
    id,
    protocol: Protocol.Orca,
    tokenPair: {
      tokenA: { symbol: 'SOL', name: 'Solana', mint: 'So11111111111111111111111111111111111111112', decimals: 9 },
      tokenB: { symbol: 'USDC', name: 'USD Coin', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', decimals: 6 },
      currentPrice: 150,
    },
    priceRange: { min: 140, max: 180, current: 150 },
    status: { inRange, autoCompound: false },
    pooledAssets: { tokenAAmount: 10, tokenBAmount: 100, totalValueUSD },
    initialAssets: { tokenAAmount: 10, tokenBAmount: 100, timestamp: '2024-01-01T00:00:00Z' },
    metrics: {
      totalPnL,
      roi: 0,
      impermanentLoss: 0,
      totalAPR: 0,
      feeAPR: 0,
      gasCosts: 0,
      netProfit: 0,
      ageInDays: 30,
    },
    fees: { totalEarned: 0, uncollected: uncollectedFees, daily: 0, weekly: 0, monthly: 0 },
    historicalData: { prices: [], volume: [], fees: [], liquidityDistribution: [] },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  });

  it('should handle empty positions array', () => {
    const summary = calculateAggregatedMetrics([]);
    expect(summary).toEqual({
      totalAssetsValue: 0,
      totalPnL: 0,
      totalUncollectedFees: 0,
      positionCount: 0,
      positionsInRange: 0,
      positionsOutOfRange: 0,
    });
  });

  it('should aggregate single position', () => {
    const positions = [
      createMockPosition('pos1', 1000, 50, 10, true),
    ];

    const summary = calculateAggregatedMetrics(positions);
    expect(summary).toEqual({
      totalAssetsValue: 1000,
      totalPnL: 50,
      totalUncollectedFees: 10,
      positionCount: 1,
      positionsInRange: 1,
      positionsOutOfRange: 0,
    });
  });

  it('should aggregate multiple positions', () => {
    const positions = [
      createMockPosition('pos1', 1000, 50, 10, true),
      createMockPosition('pos2', 2000, -30, 20, false),
      createMockPosition('pos3', 1500, 100, 15, true),
    ];

    const summary = calculateAggregatedMetrics(positions);
    expect(summary).toEqual({
      totalAssetsValue: 4500, // 1000 + 2000 + 1500
      totalPnL: 120, // 50 + (-30) + 100
      totalUncollectedFees: 45, // 10 + 20 + 15
      positionCount: 3,
      positionsInRange: 2,
      positionsOutOfRange: 1,
    });
  });

  it('should handle all positions in range', () => {
    const positions = [
      createMockPosition('pos1', 1000, 50, 10, true),
      createMockPosition('pos2', 2000, 30, 20, true),
    ];

    const summary = calculateAggregatedMetrics(positions);
    expect(summary.positionsInRange).toBe(2);
    expect(summary.positionsOutOfRange).toBe(0);
  });

  it('should handle all positions out of range', () => {
    const positions = [
      createMockPosition('pos1', 1000, -50, 10, false),
      createMockPosition('pos2', 2000, -30, 20, false),
    ];

    const summary = calculateAggregatedMetrics(positions);
    expect(summary.positionsInRange).toBe(0);
    expect(summary.positionsOutOfRange).toBe(2);
  });

  it('should handle mixed positive and negative PnL', () => {
    const positions = [
      createMockPosition('pos1', 1000, 500, 10, true),
      createMockPosition('pos2', 2000, -200, 20, false),
      createMockPosition('pos3', 1500, 0, 15, true),
    ];

    const summary = calculateAggregatedMetrics(positions);
    expect(summary.totalPnL).toBe(300); // 500 + (-200) + 0
  });

  it('should handle very large position counts', () => {
    const positions = Array.from({ length: 100 }, (_, i) =>
      createMockPosition(`pos${i}`, 1000, 10, 5, i % 2 === 0),
    );

    const summary = calculateAggregatedMetrics(positions);
    expect(summary.positionCount).toBe(100);
    expect(summary.totalAssetsValue).toBe(100000);
    expect(summary.totalPnL).toBe(1000);
    expect(summary.totalUncollectedFees).toBe(500);
    expect(summary.positionsInRange).toBe(50);
    expect(summary.positionsOutOfRange).toBe(50);
  });

  it('should handle decimal precision', () => {
    const positions = [
      createMockPosition('pos1', 1234.56, 123.45, 12.34, true),
      createMockPosition('pos2', 2345.67, -234.56, 23.45, false),
    ];

    const summary = calculateAggregatedMetrics(positions);
    expect(summary.totalAssetsValue).toBeCloseTo(3580.23, 2);
    expect(summary.totalPnL).toBeCloseTo(-111.11, 2);
    expect(summary.totalUncollectedFees).toBeCloseTo(35.79, 2);
  });
});
