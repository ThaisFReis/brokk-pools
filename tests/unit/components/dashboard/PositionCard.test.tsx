/**
 * Unit Tests for PositionCard Component
 * Tests display of token pair, protocol, status tags, and metrics
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PositionCard } from '../../../../src/components/dashboard/PositionCard';
import type { Position } from '../../../../src/types/dashboard';

// Helper to create mock position
function createMockPosition(overrides: Partial<Position> = {}): Position {
  return {
    id: '7xKXtg2CW2PnLzPvqmHZWRuDVBBwGMZvDJTLMBpWJHmj',
    protocol: 'Orca',
    tokenPair: {
      tokenA: { symbol: 'SOL', name: 'Solana', decimals: 9, logoURI: '' },
      tokenB: { symbol: 'USDC', name: 'USD Coin', decimals: 6, logoURI: '' },
      currentPrice: 152.34,
    },
    priceRange: {
      lower: 140.0,
      upper: 165.0,
      currentPrice: 152.34,
      isInRange: true,
    },
    status: 'Active',
    pooledAssets: {
      tokenAAmount: 5.2341,
      tokenBAmount: 125.67,
      totalValueUSD: 923.45,
    },
    initialAssets: {
      tokenAAmount: 5.0,
      tokenBAmount: 150.0,
      totalValueUSD: 900.0,
    },
    metrics: {
      currentValueUSD: 923.45,
      initialValueUSD: 900.0,
      totalPnL: 23.45,
      roi: 2.61,
      impermanentLoss: -1.2,
      apr: 45.6,
      autoCompound: false,
    },
    fees: {
      totalCollectedUSD: 15.32,
      uncollectedUSD: 3.21,
      feeAPR: 12.5,
      breakdown: [],
    },
    historicalData: {
      valueHistory: [],
      priceHistory: [],
      volumeHistory: [],
      feeHistory: [],
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    ...overrides,
  };
}

describe('PositionCard', () => {
  describe('T049: Token Pair Display', () => {
    it('should display token pair in format "SOL/USDC"', () => {
      const position = createMockPosition();
      render(<PositionCard position={position} />);

      expect(screen.getByText(/SOL\/USDC/i)).toBeInTheDocument();
    });

    it('should display token pair for different tokens', () => {
      const position = createMockPosition({
        tokenPair: {
          tokenA: { symbol: 'ETH', name: 'Ethereum', decimals: 18, logoURI: '' },
          tokenB: { symbol: 'USDT', name: 'Tether', decimals: 6, logoURI: '' },
          currentPrice: 2345.67,
        },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/ETH\/USDT/i)).toBeInTheDocument();
    });
  });

  describe('T050: Protocol Display', () => {
    it('should display Orca protocol identifier', () => {
      const position = createMockPosition({ protocol: 'Orca' });
      render(<PositionCard position={position} />);

      expect(screen.getByText('Orca')).toBeInTheDocument();
    });

    it('should display Raydium protocol identifier', () => {
      const position = createMockPosition({ protocol: 'Raydium' });
      render(<PositionCard position={position} />);

      expect(screen.getByText('Raydium')).toBeInTheDocument();
    });
  });

  describe('T051: OUT OF RANGE Tag', () => {
    it('should show OUT OF RANGE tag when position is out of range', () => {
      const position = createMockPosition({
        priceRange: {
          lower: 140.0,
          upper: 165.0,
          currentPrice: 170.0, // Above upper bound
          isInRange: false,
        },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/OUT OF RANGE/i)).toBeInTheDocument();
    });

    it('should show OUT OF RANGE tag when price is below lower bound', () => {
      const position = createMockPosition({
        priceRange: {
          lower: 140.0,
          upper: 165.0,
          currentPrice: 130.0, // Below lower bound
          isInRange: false,
        },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/OUT OF RANGE/i)).toBeInTheDocument();
    });

    it('should style OUT OF RANGE tag with warning colors', () => {
      const position = createMockPosition({
        priceRange: {
          lower: 140.0,
          upper: 165.0,
          currentPrice: 170.0,
          isInRange: false,
        },
      });
      render(<PositionCard position={position} />);

      const tag = screen.getByText(/OUT OF RANGE/i);
      expect(tag).toHaveClass(/red|warning|orange/i);
    });
  });

  describe('T052: IN RANGE Tag', () => {
    it('should show IN RANGE tag when position is in range', () => {
      const position = createMockPosition({
        priceRange: {
          lower: 140.0,
          upper: 165.0,
          currentPrice: 152.34, // Within bounds
          isInRange: true,
        },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/IN RANGE/i)).toBeInTheDocument();
    });

    it('should style IN RANGE tag with success colors', () => {
      const position = createMockPosition({
        priceRange: {
          lower: 140.0,
          upper: 165.0,
          currentPrice: 152.34,
          isInRange: true,
        },
      });
      render(<PositionCard position={position} />);

      const tag = screen.getByText(/IN RANGE/i);
      expect(tag).toHaveClass(/green|success/i);
    });

    it('should show IN RANGE when price equals lower bound', () => {
      const position = createMockPosition({
        priceRange: {
          lower: 140.0,
          upper: 165.0,
          currentPrice: 140.0, // At lower bound
          isInRange: true,
        },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/IN RANGE/i)).toBeInTheDocument();
    });

    it('should show IN RANGE when price equals upper bound', () => {
      const position = createMockPosition({
        priceRange: {
          lower: 140.0,
          upper: 165.0,
          currentPrice: 165.0, // At upper bound
          isInRange: true,
        },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/IN RANGE/i)).toBeInTheDocument();
    });
  });

  describe('T053: AUTO-COMPOUND Tag', () => {
    it('should show AUTO-COMPOUND tag when enabled', () => {
      const position = createMockPosition({
        metrics: {
          ...createMockPosition().metrics,
          autoCompound: true,
        },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/AUTO-COMPOUND/i)).toBeInTheDocument();
    });

    it('should not show AUTO-COMPOUND tag when disabled', () => {
      const position = createMockPosition({
        metrics: {
          ...createMockPosition().metrics,
          autoCompound: false,
        },
      });
      render(<PositionCard position={position} />);

      expect(screen.queryByText(/AUTO-COMPOUND/i)).not.toBeInTheDocument();
    });

    it('should style AUTO-COMPOUND tag with info colors', () => {
      const position = createMockPosition({
        metrics: {
          ...createMockPosition().metrics,
          autoCompound: true,
        },
      });
      render(<PositionCard position={position} />);

      const tag = screen.getByText(/AUTO-COMPOUND/i);
      expect(tag).toHaveClass(/blue|cyan|info/i);
    });
  });

  describe('T054: Metrics Display', () => {
    it('should display pooled assets value in USD', () => {
      const position = createMockPosition({
        pooledAssets: { tokenAAmount: 5.2341, tokenBAmount: 125.67, totalValueUSD: 923.45 },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/\$923\.45/)).toBeInTheDocument();
    });

    it('should display PnL with correct formatting', () => {
      const position = createMockPosition({
        metrics: { ...createMockPosition().metrics, totalPnL: 23.45 },
      });
      render(<PositionCard position={position} />);

      // Should show positive sign
      expect(screen.getByText(/\+\$23\.45/)).toBeInTheDocument();
    });

    it('should display negative PnL in red', () => {
      const position = createMockPosition({
        metrics: { ...createMockPosition().metrics, totalPnL: -45.67 },
      });
      render(<PositionCard position={position} />);

      const pnlElement = screen.getByText(/-\$45\.67/);
      expect(pnlElement).toHaveClass(/red/i);
    });

    it('should display positive PnL in green', () => {
      const position = createMockPosition({
        metrics: { ...createMockPosition().metrics, totalPnL: 23.45 },
      });
      render(<PositionCard position={position} />);

      const pnlElement = screen.getByText(/\+\$23\.45/);
      expect(pnlElement).toHaveClass(/green/i);
    });

    it('should display APR as percentage', () => {
      const position = createMockPosition({
        metrics: { ...createMockPosition().metrics, apr: 45.6 },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/45\.60%/)).toBeInTheDocument();
    });

    it('should display uncollected fees', () => {
      const position = createMockPosition({
        fees: { ...createMockPosition().fees, uncollectedUSD: 3.21 },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/\$3\.21/)).toBeInTheDocument();
    });

    it('should display all metrics with correct labels', () => {
      const position = createMockPosition();
      render(<PositionCard position={position} />);

      // Check for metric labels
      expect(screen.getByText(/Pooled Assets|Total Value/i)).toBeInTheDocument();
      expect(screen.getByText(/PnL/i)).toBeInTheDocument();
      expect(screen.getByText(/APR/i)).toBeInTheDocument();
      expect(screen.getByText(/Uncollected Fees|Fees/i)).toBeInTheDocument();
    });

    it('should format large pooled assets values correctly', () => {
      const position = createMockPosition({
        pooledAssets: { tokenAAmount: 1000, tokenBAmount: 50000, totalValueUSD: 750000 },
      });
      render(<PositionCard position={position} />);

      // Should format as 750K or $750,000.00
      expect(screen.getByText(/\$750,000\.00|\$750K/)).toBeInTheDocument();
    });

    it('should format small values with appropriate decimal places', () => {
      const position = createMockPosition({
        fees: { ...createMockPosition().fees, uncollectedUSD: 0.05 },
      });
      render(<PositionCard position={position} />);

      expect(screen.getByText(/\$0\.05/)).toBeInTheDocument();
    });
  });
});
