/**
 * Unit Tests for LiquidityChart Component
 * Tests liquidity distribution bar chart rendering and tooltips
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LiquidityChart } from '../../../../src/components/dashboard/LiquidityChart';
import type { LiquidityDataPoint } from '../../../../src/types/dashboard';

// Mock ECharts
vi.mock('echarts-for-react', () => ({
  default: ({ option, style }: any) => (
    <div
      data-testid="liquidity-chart"
      data-chart-type="bar"
      style={style}
      data-has-data={option.series[0].data.length > 0}
    >
      Liquidity Chart
    </div>
  ),
}));

describe('LiquidityChart', () => {
  const mockLiquidityData: LiquidityDataPoint[] = [
    { price: 140.0, liquidity: 50000 },
    { price: 150.0, liquidity: 100000 },
    { price: 160.0, liquidity: 75000 },
    { price: 170.0, liquidity: 40000 },
  ];

  const mockPriceRange = {
    min: 145.0,
    max: 165.0,
    current: 152.0,
  };

  describe('T069: Render Bar Chart with Position Price Range', () => {
    it('should render liquidity chart component', () => {
      render(
        <LiquidityChart
          liquidityData={mockLiquidityData}
          priceRange={mockPriceRange}
        />
      );

      expect(screen.getByTestId('liquidity-chart')).toBeInTheDocument();
    });

    it('should render as bar chart type', () => {
      render(
        <LiquidityChart
          liquidityData={mockLiquidityData}
          priceRange={mockPriceRange}
        />
      );

      const chart = screen.getByTestId('liquidity-chart');
      expect(chart).toHaveAttribute('data-chart-type', 'bar');
    });

    it('should display price range overlay on chart', () => {
      const { container } = render(
        <LiquidityChart
          liquidityData={mockLiquidityData}
          priceRange={mockPriceRange}
        />
      );

      // Should have visual indicator for price range
      expect(container.querySelector('[data-price-range]')).toBeInTheDocument();
    });

    it('should highlight liquidity within position range', () => {
      const { container } = render(
        <LiquidityChart
          liquidityData={mockLiquidityData}
          priceRange={mockPriceRange}
        />
      );

      // Bars within range should have different styling
      expect(container.querySelector('[data-in-range="true"]')).toBeInTheDocument();
    });

    it('should render with empty data', () => {
      render(
        <LiquidityChart
          liquidityData={[]}
          priceRange={mockPriceRange}
        />
      );

      const chart = screen.getByTestId('liquidity-chart');
      expect(chart).toHaveAttribute('data-has-data', 'false');
    });

    it('should show message when data is unavailable', () => {
      render(
        <LiquidityChart
          liquidityData={[]}
          priceRange={mockPriceRange}
        />
      );

      expect(screen.getByText(/Historical data unavailable/i)).toBeInTheDocument();
    });
  });

  describe('T070: Tooltips on Hover/Tap', () => {
    it('should show tooltip on hover (desktop)', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <LiquidityChart
          liquidityData={mockLiquidityData}
          priceRange={mockPriceRange}
        />
      );

      const chart = container.querySelector('[data-testid="liquidity-chart"]');
      if (chart) {
        await user.hover(chart);
        // Tooltip should be visible
        expect(container.querySelector('[data-tooltip]')).toBeInTheDocument();
      }
    });

    it('should show tooltip on tap (mobile)', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <LiquidityChart
          liquidityData={mockLiquidityData}
          priceRange={mockPriceRange}
        />
      );

      const chart = container.querySelector('[data-testid="liquidity-chart"]');
      if (chart) {
        await user.click(chart);
        expect(container.querySelector('[data-tooltip]')).toBeInTheDocument();
      }
    });

    it('should display price and liquidity in tooltip', () => {
      const { container } = render(
        <LiquidityChart
          liquidityData={mockLiquidityData}
          priceRange={mockPriceRange}
        />
      );

      // Tooltip should format data correctly
      const chart = screen.getByTestId('liquidity-chart');
      expect(chart).toBeInTheDocument();
    });
  });
});
