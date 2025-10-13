/**
 * Integration Test: Dashboard Position List Browsing Flow
 * Tests the complete flow of browsing positions in the dashboard
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { DashboardLayout } from '../../src/components/dashboard/DashboardLayout';

// Mock @solana/wallet-adapter-react
vi.mock('@solana/wallet-adapter-react', () => ({
  useWallet: () => ({
    wallet: { adapter: { name: 'Phantom' } },
    publicKey: { toString: () => 'GkH3...MBpW' },
    connected: true,
    connecting: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
    select: vi.fn(),
  }),
  WalletProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ConnectionProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock @solana/wallet-adapter-react-ui
vi.mock('@solana/wallet-adapter-react-ui', () => ({
  WalletMultiButton: () => <button>Select Wallet</button>,
  WalletModalProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock useWallet hook
vi.mock('../../src/hooks/useWallet', () => ({
  useWallet: () => ({
    wallet: { adapter: { name: 'Phantom' } },
    publicKey: 'GkH3...MBpW',
    connected: true,
    connecting: false,
    connect: vi.fn(),
    disconnect: vi.fn(),
    select: vi.fn(),
    displayAddress: 'GkH3...MBpW',
    adapterName: 'Phantom',
  }),
}));

// Mock usePositions hook to return mock data
vi.mock('../../src/hooks/usePositions', () => ({
  usePositions: (connected: boolean) => {
    if (!connected) {
      return {
        positions: [],
        summary: null,
        loading: false,
        error: null,
        refetch: vi.fn(),
      };
    }

    // Return 12 mock positions (same as mockPositions.json)
    const mockPositions = Array.from({ length: 12 }, (_, i) => ({
      id: `position-${i}`,
      protocol: i % 2 === 0 ? 'Orca' : 'Raydium',
      tokenPair: {
        tokenA: { symbol: 'SOL', name: 'Solana', decimals: 9, logoURI: '' },
        tokenB: { symbol: 'USDC', name: 'USD Coin', decimals: 6, logoURI: '' },
        currentPrice: 152.34 + i,
      },
      priceRange: {
        lower: 140.0,
        upper: 165.0,
        currentPrice: 152.34 + i,
        isInRange: i < 8, // First 8 in range, last 4 out of range
      },
      status: 'Active',
      pooledAssets: {
        tokenAAmount: 5.0 + i * 0.5,
        tokenBAmount: 125.0 + i * 10,
        totalValueUSD: 1000 + i * 500, // Sorted by this value
      },
      initialAssets: {
        tokenAAmount: 5.0,
        tokenBAmount: 150.0,
        totalValueUSD: 900.0,
      },
      metrics: {
        currentValueUSD: 1000 + i * 500,
        initialValueUSD: 900.0,
        totalPnL: (i % 3 === 0 ? -1 : 1) * (20 + i * 5), // Mix of positive/negative
        roi: 2.61 + i,
        impermanentLoss: -1.2,
        apr: 45.6 + i * 2,
        autoCompound: i % 4 === 0, // Every 4th has auto-compound
      },
      fees: {
        totalCollectedUSD: 15.32 + i,
        uncollectedUSD: 3.21 + i * 0.5,
        feeAPR: 12.5,
        breakdown: [],
      },
      historicalData: {
        valueHistory: [],
        priceHistory: [],
        volumeHistory: [],
        feeHistory: [],
      },
      createdAt: `2024-01-${15 + i}T10:30:00Z`,
      updatedAt: `2024-01-${20 + i}T14:45:00Z`,
    }));

    const summary = {
      totalAssetsValue: mockPositions.reduce((sum, p) => sum + p.pooledAssets.totalValueUSD, 0),
      totalPnL: mockPositions.reduce((sum, p) => sum + p.metrics.totalPnL, 0),
      totalUncollectedFees: mockPositions.reduce((sum, p) => sum + p.fees.uncollectedUSD, 0),
      positionCount: mockPositions.length,
      positionsInRange: mockPositions.filter((p) => p.priceRange.isInRange).length,
      positionsOutOfRange: mockPositions.filter((p) => !p.priceRange.isInRange).length,
    };

    return {
      positions: mockPositions,
      summary,
      loading: false,
      error: null,
      refetch: vi.fn(),
    };
  },
}));

describe('Integration: Dashboard Position List Browsing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('T059: Full Position List Browsing Flow', () => {
    it('should display wallet connection status and summary cards', async () => {
      render(<DashboardLayout />);

      // Wallet should be connected
      expect(screen.getByText('GkH3...MBpW')).toBeInTheDocument();
      expect(screen.getByText('Phantom')).toBeInTheDocument();

      // Summary cards should be visible
      expect(screen.getByText(/Total Assets/i)).toBeInTheDocument();
      expect(screen.getByText(/Total PnL/i)).toBeInTheDocument();
      expect(screen.getByText(/Uncollected Fees/i)).toBeInTheDocument();
    });

    it('should display all 12 positions in the list', async () => {
      const { container } = render(<DashboardLayout />);

      // Should show position count in header
      expect(screen.getByText(/Your Positions \(12\)/i)).toBeInTheDocument();

      // Should render 12 position cards
      const cards = container.querySelectorAll('[data-testid="position-card"]');
      expect(cards.length).toBe(12);
    });

    it('should display positions sorted by total value (descending)', async () => {
      const { container } = render(<DashboardLayout />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');

      // First card should have highest value ($6,500 = 1000 + 11*500)
      const firstCard = within(cards[0] as HTMLElement);
      expect(firstCard.getByText(/\$6,500/)).toBeInTheDocument();

      // Last card should have lowest value ($1,000)
      const lastCard = within(cards[11] as HTMLElement);
      expect(lastCard.getByText(/\$1,000/)).toBeInTheDocument();
    });

    it('should display IN RANGE status for first 8 positions', async () => {
      const { container } = render(<DashboardLayout />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');

      // Check first 8 cards for IN RANGE tag
      for (let i = 0; i < 8; i++) {
        const card = within(cards[i] as HTMLElement);
        expect(card.getByText(/IN RANGE/i)).toBeInTheDocument();
      }
    });

    it('should display OUT OF RANGE status for last 4 positions', async () => {
      const { container } = render(<DashboardLayout />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');

      // Check last 4 cards for OUT OF RANGE tag
      for (let i = 8; i < 12; i++) {
        const card = within(cards[i] as HTMLElement);
        expect(card.getByText(/OUT OF RANGE/i)).toBeInTheDocument();
      }
    });

    it('should display AUTO-COMPOUND tag for positions 0, 4, 8', async () => {
      const { container } = render(<DashboardLayout />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');

      // Positions with indices 0, 4, 8 should have AUTO-COMPOUND
      const indicesWithAutoCompound = [0, 4, 8];
      indicesWithAutoCompound.forEach((i) => {
        const card = within(cards[i] as HTMLElement);
        expect(card.getByText(/AUTO-COMPOUND/i)).toBeInTheDocument();
      });
    });

    it('should display protocol badges correctly', async () => {
      const { container } = render(<DashboardLayout />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');

      // Even indices should be Orca, odd should be Raydium
      cards.forEach((card, i) => {
        const cardElement = within(card as HTMLElement);
        if (i % 2 === 0) {
          expect(cardElement.getByText('Orca')).toBeInTheDocument();
        } else {
          expect(cardElement.getByText('Raydium')).toBeInTheDocument();
        }
      });
    });

    it('should display positive and negative PnL with correct styling', async () => {
      const { container } = render(<DashboardLayout />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');

      cards.forEach((card, i) => {
        const cardElement = within(card as HTMLElement);
        const isNegative = i % 3 === 0;

        if (isNegative) {
          // Should find negative PnL text
          const pnlElement = cardElement.getByText(/-\$/);
          expect(pnlElement).toHaveClass(/red/i);
        } else {
          // Should find positive PnL text
          const pnlElement = cardElement.getByText(/\+\$/);
          expect(pnlElement).toHaveClass(/green/i);
        }
      });
    });

    it('should display all required metrics for each position', async () => {
      const { container } = render(<DashboardLayout />);

      const cards = container.querySelectorAll('[data-testid="position-card"]');
      const firstCard = within(cards[0] as HTMLElement);

      // Each card should have these metrics
      expect(firstCard.getByText(/SOL\/USDC/i)).toBeInTheDocument();
      expect(firstCard.getByText(/\$/)).toBeInTheDocument(); // Value in USD
      expect(firstCard.getByText(/%/)).toBeInTheDocument(); // APR percentage
      expect(firstCard.getByText(/IN RANGE|OUT OF RANGE/i)).toBeInTheDocument();
    });

    it('should handle scrolling through all positions', async () => {
      const { container } = render(<DashboardLayout />);

      const positionList = container.querySelector('[data-testid="position-list"]');
      expect(positionList).toBeInTheDocument();

      // Should be scrollable
      expect(positionList).toHaveStyle({ overflowY: 'auto' });
    });

    it('should display loading state before positions load', async () => {
      // Mock loading state
      vi.mock('../../src/hooks/usePositions', () => ({
        usePositions: () => ({
          positions: [],
          summary: null,
          loading: true,
          error: null,
          refetch: vi.fn(),
        }),
      }));

      render(<DashboardLayout />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText(/Loading positions/i)).toBeInTheDocument();
    });

    it('should maintain summary card data while browsing positions', async () => {
      render(<DashboardLayout />);

      // Summary should be visible and accurate
      const totalValue = 12 * 1000 + (11 * 12 * 500) / 2; // Sum of arithmetic series
      expect(screen.getByText(new RegExp(`\\$${totalValue.toLocaleString()}`))).toBeInTheDocument();

      // Positions should also be visible simultaneously
      expect(screen.getByText(/Your Positions/i)).toBeInTheDocument();
    });
  });
});
