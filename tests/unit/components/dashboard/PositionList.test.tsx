/**
 * Unit Tests for PositionList Component
 * Tests rendering multiple positions, sorting, virtualization, and loading states
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { PositionList } from '../../../../src/components/dashboard/PositionList';
import type { Position } from '../../../../src/types/dashboard';

// Helper to create mock position
function createMockPosition(
  id: string,
  totalValueUSD: number,
  pairSymbol: string = 'SOL/USDC',
  overrides: Partial<Position> = {}
): Position {
  const [tokenASymbol, tokenBSymbol] = pairSymbol.split('/');
  return {
    id,
    protocol: 'Orca',
    tokenPair: {
      tokenA: { symbol: tokenASymbol, name: tokenASymbol, decimals: 9, logoURI: '' },
      tokenB: { symbol: tokenBSymbol, name: tokenBSymbol, decimals: 6, logoURI: '' },
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
      tokenAAmount: 5.0,
      tokenBAmount: 125.0,
      totalValueUSD,
    },
    initialAssets: {
      tokenAAmount: 5.0,
      tokenBAmount: 150.0,
      totalValueUSD: 900.0,
    },
    metrics: {
      currentValueUSD: totalValueUSD,
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

describe('PositionList', () => {
  describe('T055: Render Multiple PositionCards', () => {
    it('should render multiple PositionCards', () => {
      const positions = [
        createMockPosition('pos1', 1000, 'SOL/USDC'),
        createMockPosition('pos2', 2000, 'ETH/USDC'),
        createMockPosition('pos3', 1500, 'BONK/SOL'),
      ];
      render(<PositionList positions={positions} />);

      expect(screen.getByText(/SOL\/USDC/i)).toBeInTheDocument();
      expect(screen.getByText(/ETH\/USDC/i)).toBeInTheDocument();
      expect(screen.getByText(/BONK\/SOL/i)).toBeInTheDocument();
    });

    it('should render correct number of position cards', () => {
      const positions = Array.from({ length: 5 }, (_, i) =>
        createMockPosition(`pos${i}`, 1000 + i * 100, 'SOL/USDC')
      );
      const { container } = render(<PositionList positions={positions} />);

      // Should render 5 PositionCard components
      const cards = container.querySelectorAll('[data-testid="position-card"]');
      expect(cards.length).toBe(5);
    });

    it('should handle empty positions array', () => {
      render(<PositionList positions={[]} />);

      // Should show empty state or no cards
      expect(screen.queryByText(/SOL\/USDC/i)).not.toBeInTheDocument();
    });

    it('should render single position correctly', () => {
      const positions = [createMockPosition('pos1', 1000, 'SOL/USDC')];
      render(<PositionList positions={positions} />);

      expect(screen.getByText(/SOL\/USDC/i)).toBeInTheDocument();
    });
  });

  describe('T056: Sort by Total Assets Value', () => {
    it('should sort positions by totalValueUSD in descending order by default', () => {
      const positions = [
        createMockPosition('pos1', 1000, 'SOL/USDC'), // Lowest
        createMockPosition('pos2', 5000, 'ETH/USDC'), // Highest
        createMockPosition('pos3', 2000, 'BONK/SOL'), // Middle
      ];
      const { container } = render(<PositionList positions={positions} />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');
      const firstCard = within(cards[0] as HTMLElement);
      const lastCard = within(cards[2] as HTMLElement);

      // First card should be ETH/USDC ($5000)
      expect(firstCard.getByText(/ETH\/USDC/i)).toBeInTheDocument();

      // Last card should be SOL/USDC ($1000)
      expect(lastCard.getByText(/SOL\/USDC/i)).toBeInTheDocument();
    });

    it('should maintain sort order with equal values', () => {
      const positions = [
        createMockPosition('pos1', 1000, 'SOL/USDC'),
        createMockPosition('pos2', 1000, 'ETH/USDC'),
        createMockPosition('pos3', 2000, 'BONK/SOL'),
      ];
      const { container } = render(<PositionList positions={positions} />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');
      const firstCard = within(cards[0] as HTMLElement);

      // First card should be BONK/SOL ($2000)
      expect(firstCard.getByText(/BONK\/SOL/i)).toBeInTheDocument();
    });

    it('should sort large dataset correctly', () => {
      const positions = Array.from({ length: 50 }, (_, i) =>
        createMockPosition(`pos${i}`, Math.random() * 10000, 'SOL/USDC')
      );
      const { container } = render(<PositionList positions={positions} />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');

      // Extract values and verify descending order
      const values: number[] = [];
      positions.forEach((p) => values.push(p.pooledAssets.totalValueUSD));
      values.sort((a, b) => b - a);

      // First card should have highest value
      const firstCardValue = positions.find((p) => p.id === cards[0].getAttribute('data-position-id'))
        ?.pooledAssets.totalValueUSD;
      expect(firstCardValue).toBe(values[0]);
    });
  });

  describe('T057: Virtualization for >20 Positions', () => {
    it('should use virtualization when positions count > 20', () => {
      const positions = Array.from({ length: 25 }, (_, i) =>
        createMockPosition(`pos${i}`, 1000 + i * 100, 'SOL/USDC')
      );
      const { container } = render(<PositionList positions={positions} />);

      // Should have virtualization wrapper with specific class/attribute
      const virtualWrapper = container.querySelector('[data-virtualized="true"]');
      expect(virtualWrapper).toBeInTheDocument();
    });

    it('should NOT use virtualization when positions count <= 20', () => {
      const positions = Array.from({ length: 15 }, (_, i) =>
        createMockPosition(`pos${i}`, 1000 + i * 100, 'SOL/USDC')
      );
      const { container } = render(<PositionList positions={positions} />);

      // Should not have virtualization wrapper
      const virtualWrapper = container.querySelector('[data-virtualized="true"]');
      expect(virtualWrapper).not.toBeInTheDocument();
    });

    it('should activate virtualization at exactly 21 positions', () => {
      const positions = Array.from({ length: 21 }, (_, i) =>
        createMockPosition(`pos${i}`, 1000 + i * 100, 'SOL/USDC')
      );
      const { container } = render(<PositionList positions={positions} />);

      const virtualWrapper = container.querySelector('[data-virtualized="true"]');
      expect(virtualWrapper).toBeInTheDocument();
    });

    it('should render visible items only when virtualized', () => {
      const positions = Array.from({ length: 100 }, (_, i) =>
        createMockPosition(`pos${i}`, 1000 + i * 100, 'SOL/USDC')
      );
      const { container } = render(<PositionList positions={positions} />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');

      // With virtualization, should render fewer cards than total (only visible + overscan)
      expect(cards.length).toBeLessThan(100);
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should handle scrolling in virtualized list', () => {
      const positions = Array.from({ length: 50 }, (_, i) =>
        createMockPosition(`pos${i}`, 1000 + i * 100, 'SOL/USDC')
      );
      const { container } = render(<PositionList positions={positions} />);

      const virtualWrapper = container.querySelector('[data-virtualized="true"]');
      expect(virtualWrapper).toBeInTheDocument();

      // Should have scroll container with proper attributes
      expect(virtualWrapper).toHaveStyle({ overflowY: 'auto' });
    });
  });

  describe('T058: Independent Loading State', () => {
    it('should show loading state when loading prop is true', () => {
      render(<PositionList positions={[]} loading={true} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/Loading positions/i)).toBeInTheDocument();
    });

    it('should show skeleton loaders during loading', () => {
      render(<PositionList positions={[]} loading={true} />);

      const skeletons = screen.getAllByTestId('position-skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render positions when loading is false', () => {
      const positions = [createMockPosition('pos1', 1000, 'SOL/USDC')];
      render(<PositionList positions={positions} loading={false} />);

      expect(screen.getByText(/SOL\/USDC/i)).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('should render positions even if loading was previously true', () => {
      const positions = [createMockPosition('pos1', 1000, 'SOL/USDC')];
      const { rerender } = render(<PositionList positions={[]} loading={true} />);

      expect(screen.getByText(/Loading positions/i)).toBeInTheDocument();

      rerender(<PositionList positions={positions} loading={false} />);

      expect(screen.getByText(/SOL\/USDC/i)).toBeInTheDocument();
      expect(screen.queryByText(/Loading positions/i)).not.toBeInTheDocument();
    });

    it('should render 3 skeleton loaders by default', () => {
      render(<PositionList positions={[]} loading={true} />);

      const skeletons = screen.getAllByTestId('position-skeleton');
      expect(skeletons.length).toBe(3);
    });

    it('should not show loading state when positions are loaded', () => {
      const positions = [
        createMockPosition('pos1', 1000, 'SOL/USDC'),
        createMockPosition('pos2', 2000, 'ETH/USDC'),
      ];
      render(<PositionList positions={positions} loading={false} />);

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.queryByTestId('position-skeleton')).not.toBeInTheDocument();
    });
  });
});
