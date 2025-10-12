/**
 * Unit Tests: SummaryCards Component
 * Tests portfolio summary card display
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { SummaryMetrics } from '../../../../src/types/dashboard';

// Mock will be implemented later
const SummaryCards = ({ summary, loading }: { summary: SummaryMetrics | null; loading?: boolean }) => (
  <div>SummaryCards Mock</div>
);

describe('SummaryCards Component', () => {
  const mockSummary: SummaryMetrics = {
    totalAssetsValue: 1234567.89,
    totalPnL: 12345.67,
    totalUncollectedFees: 1234.56,
    positionCount: 12,
    positionsInRange: 8,
    positionsOutOfRange: 4,
  };

  describe('T033: Displays total assets value with correct formatting', () => {
    it('should render total assets value card', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByText(/total assets/i)).toBeInTheDocument();
    });

    it('should format total assets as USD with 2 decimals', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByText(/\$1,234,567\.89/)).toBeInTheDocument();
    });

    it('should display total assets in large format (K/M notation)', () => {
      const largeSummary: SummaryMetrics = {
        ...mockSummary,
        totalAssetsValue: 1234567890,
      };

      render(<SummaryCards summary={largeSummary} />);

      expect(screen.getByText(/\$1\.23B|\$1,234\.57M/)).toBeInTheDocument();
    });

    it('should show zero assets when no positions', () => {
      const emptySummary: SummaryMetrics = {
        ...mockSummary,
        totalAssetsValue: 0,
      };

      render(<SummaryCards summary={emptySummary} />);

      expect(screen.getByText(/\$0\.00/)).toBeInTheDocument();
    });

    it('should have descriptive label for total assets', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByText(/total (portfolio |)value|total assets/i)).toBeInTheDocument();
    });
  });

  describe('T034: Displays PnL with color coding', () => {
    it('should render total PnL card', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByText(/total (profit\/loss|pnl)/i)).toBeInTheDocument();
    });

    it('should display positive PnL in green', () => {
      const positivePnL: SummaryMetrics = {
        ...mockSummary,
        totalPnL: 12345.67,
      };

      render(<SummaryCards summary={positivePnL} />);

      const pnlValue = screen.getByText(/\$12,345\.67/);
      expect(pnlValue).toHaveClass(/green|text-green|positive/i);
    });

    it('should display negative PnL in red', () => {
      const negativePnL: SummaryMetrics = {
        ...mockSummary,
        totalPnL: -5432.10,
      };

      render(<SummaryCards summary={negativePnL} />);

      const pnlValue = screen.getByText(/-\$5,432\.10/);
      expect(pnlValue).toHaveClass(/red|text-red|negative/i);
    });

    it('should display zero PnL without color coding', () => {
      const zeroPnL: SummaryMetrics = {
        ...mockSummary,
        totalPnL: 0,
      };

      render(<SummaryCards summary={zeroPnL} />);

      const pnlValue = screen.getByText(/\$0\.00/);
      expect(pnlValue).not.toHaveClass(/red|green/i);
    });

    it('should show positive sign for positive PnL', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByText(/\+\$12,345\.67/)).toBeInTheDocument();
    });

    it('should show negative sign for negative PnL', () => {
      const negativePnL: SummaryMetrics = {
        ...mockSummary,
        totalPnL: -5432.10,
      };

      render(<SummaryCards summary={negativePnL} />);

      expect(screen.getByText(/-\$5,432\.10/)).toBeInTheDocument();
    });
  });

  describe('T035: Displays uncollected fees', () => {
    it('should render uncollected fees card', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByText(/uncollected fees/i)).toBeInTheDocument();
    });

    it('should format uncollected fees as USD', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByText(/\$1,234\.56/)).toBeInTheDocument();
    });

    it('should show zero fees when none available', () => {
      const noFees: SummaryMetrics = {
        ...mockSummary,
        totalUncollectedFees: 0,
      };

      render(<SummaryCards summary={noFees} />);

      expect(screen.getByText(/\$0\.00/)).toBeInTheDocument();
    });

    it('should have descriptive label for fees', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByText(/uncollected|pending|claimable/i)).toBeInTheDocument();
    });
  });

  describe('T036: Shows loading state per section', () => {
    it('should show skeleton loaders when loading', () => {
      render(<SummaryCards summary={null} loading={true} />);

      const skeletons = screen.getAllByTestId(/skeleton|loading/i);
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should show 3 loading cards (one for each metric)', () => {
      render(<SummaryCards summary={null} loading={true} />);

      const loadingCards = screen.getAllByRole('status');
      expect(loadingCards).toHaveLength(3);
    });

    it('should not show loading state when data is available', () => {
      render(<SummaryCards summary={mockSummary} loading={false} />);

      expect(screen.queryByTestId(/skeleton|loading/i)).not.toBeInTheDocument();
    });

    it('should animate skeleton loaders', () => {
      render(<SummaryCards summary={null} loading={true} />);

      const skeleton = screen.getByTestId(/skeleton/i);
      expect(skeleton).toHaveClass(/animate/i);
    });
  });

  describe('Card Layout', () => {
    it('should render 3 summary cards', () => {
      render(<SummaryCards summary={mockSummary} />);

      const cards = screen.getAllByRole('article');
      expect(cards).toHaveLength(3);
    });

    it('should have consistent card styling', () => {
      render(<SummaryCards summary={mockSummary} />);

      const cards = screen.getAllByRole('article');
      cards.forEach((card) => {
        expect(card).toHaveClass(/card|rounded|shadow|border/i);
      });
    });

    it('should display cards in grid layout', () => {
      const { container } = render(<SummaryCards summary={mockSummary} />);

      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toBeInTheDocument();
    });
  });

  describe('Position Count Display', () => {
    it('should show total position count', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByText(/12 positions/i)).toBeInTheDocument();
    });

    it('should show in-range and out-of-range counts', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByText(/8.*in range/i)).toBeInTheDocument();
      expect(screen.getByText(/4.*out of range/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML structure', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getAllByRole('article')).toHaveLength(3);
    });

    it('should have accessible labels', () => {
      render(<SummaryCards summary={mockSummary} />);

      expect(screen.getByLabelText(/total assets/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/total pnl/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/uncollected fees/i)).toBeInTheDocument();
    });

    it('should announce loading state to screen readers', () => {
      render(<SummaryCards summary={null} loading={true} />);

      const loadingStatus = screen.getAllByRole('status');
      expect(loadingStatus.length).toBeGreaterThan(0);
    });
  });
});
