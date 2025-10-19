/**
 * Unit Tests for TopPosition Component
 * Feature: Top Position Ranking Badge
 * Tasks: T016, T017, T018, T019, T020, T021, T022
 *
 * Tests badge display, styling, error handling, and user interactions.
 * Following TDD approach - these tests will FAIL until component is implemented.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import type { UserRanking } from '../../src/types/dashboard';
import { TopPosition } from '../../src/components/TopPosition';

// Helper to create mock UserRanking
function createMockRanking(overrides: Partial<UserRanking> = {}): UserRanking {
  return {
    position: 11,
    totalMiners: 100,
    hashrate: 3.8e12, // 3.8 TH/s
    networkShare: 2.5,
    isTopTen: false,
    ...overrides,
  };
}

// ============================================================================
// T016: Test badge renders with correct position when wallet connected
// ============================================================================

describe('TopPosition Component - Badge Rendering', () => {
  describe('T016: Badge renders with correct position when wallet connected', () => {
    it('should render badge with correct position text', () => {
      const ranking = createMockRanking({ position: 42 });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      expect(screen.getByText(/top #42/i)).toBeInTheDocument();
    });

    it('should render badge with position 1', () => {
      const ranking = createMockRanking({ position: 1, isTopTen: true });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      expect(screen.getByText(/top #1/i)).toBeInTheDocument();
    });

    it('should render badge with position 10', () => {
      const ranking = createMockRanking({ position: 10, isTopTen: true });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      expect(screen.getByText(/top #10/i)).toBeInTheDocument();
    });

    it('should include icon in badge', () => {
      const ranking = createMockRanking({ position: 5, isTopTen: true });
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Icon should be present (svg element)
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render badge as a button or interactive element', () => {
      const ranking = createMockRanking();
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Badge should be interactive (button, div with role, etc)
      const badge = container.querySelector('[role="button"], button, [tabindex]');
      expect(badge).toBeInTheDocument();
    });
  });
});

// ============================================================================
// T017: Test badge hidden when wallet not connected
// ============================================================================

describe('TopPosition Component - Wallet Not Connected', () => {
  describe('T017: Badge hidden when wallet not connected', () => {
    it('should not render badge when ranking is null', () => {
      const { container } = render(
        <TopPosition ranking={null} loading={false} error={null} onRetry={vi.fn()} />
      );

      // No badge should be visible
      expect(screen.queryByText(/top #/i)).not.toBeInTheDocument();
      expect(container.querySelector('[data-testid="top-position-badge"]')).not.toBeInTheDocument();
    });

    it('should not render any badge element in DOM when ranking is null', () => {
      const { container } = render(
        <TopPosition ranking={null} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Verify complete absence of badge
      const badge = container.querySelector('[class*="badge"]');
      expect(badge).not.toBeInTheDocument();
    });

    it('should not show loading state when ranking is null and not loading', () => {
      render(<TopPosition ranking={null} loading={false} error={null} onRetry={vi.fn()} />);

      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// T018: Test top 10 styling applied (golden gradient, star icon)
// ============================================================================

describe('TopPosition Component - Top 10 Styling', () => {
  describe('T018: Top 10 styling applied (golden gradient, star icon)', () => {
    it('should apply golden/gold styling for position 1', () => {
      const ranking = createMockRanking({ position: 1, isTopTen: true });
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Check for golden gradient classes or styles
      const badge = container.querySelector('[class*="gold"], [class*="golden"], [style*="gold"]');
      expect(badge).toBeInTheDocument();
    });

    it('should display star icon for top 10 positions', () => {
      const ranking = createMockRanking({ position: 5, isTopTen: true });
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Star icon should be present (look for SVG or data-icon attribute)
      const icon = container.querySelector('[data-icon="star"], [class*="star"]');
      expect(icon).toBeInTheDocument();
    });

    it('should apply golden styling for position 10', () => {
      const ranking = createMockRanking({ position: 10, isTopTen: true });
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      const badge = container.querySelector('[class*="gold"], [class*="golden"], [class*="top-ten"]');
      expect(badge).toBeInTheDocument();
    });

    it('should use gradient styling for top 10', () => {
      const ranking = createMockRanking({ position: 3, isTopTen: true });
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Check for gradient in inline style or className
      const badge = container.querySelector('[style*="gradient"], [class*="gradient"]');
      expect(badge).toBeInTheDocument();
    });
  });
});

// ============================================================================
// T019: Test standard styling applied (blue gradient, chart icon)
// ============================================================================

describe('TopPosition Component - Standard Styling', () => {
  describe('T019: Standard styling applied (blue gradient, chart icon)', () => {
    it('should apply blue/purple gradient for position 11', () => {
      const ranking = createMockRanking({ position: 11, isTopTen: false });
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Check for blue/purple styling (NOT golden)
      const badge = container.querySelector('[class*="blue"], [class*="purple"], [class*="standard"]');
      expect(badge).toBeInTheDocument();

      // Should NOT have golden styling
      const goldenBadge = container.querySelector('[class*="gold"], [class*="golden"]');
      expect(goldenBadge).not.toBeInTheDocument();
    });

    it('should display chart/trending icon for position >= 11', () => {
      const ranking = createMockRanking({ position: 42, isTopTen: false });
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Chart/TrendingUp icon should be present
      const icon = container.querySelector('[data-icon="trending"], [data-icon="chart"], [class*="trending"], [class*="chart"]');
      expect(icon).toBeInTheDocument();

      // Should NOT have star icon
      const starIcon = container.querySelector('[data-icon="star"], [class*="star"]');
      expect(starIcon).not.toBeInTheDocument();
    });

    it('should use standard gradient for position 100', () => {
      const ranking = createMockRanking({ position: 100, isTopTen: false });
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      const badge = container.querySelector('[style*="gradient"], [class*="gradient"]');
      expect(badge).toBeInTheDocument();
    });

    it('should differentiate styling between top 10 and standard', () => {
      // Render top 10
      render(
        <TopPosition ranking={createMockRanking({ position: 5, isTopTen: true })} loading={false} error={null} onRetry={vi.fn()} />
      );
      const topTenBadge = screen.getByRole('button', { name: /ranking position 5/i });
      const topTenClasses = topTenBadge.className;

      // Clean up and render standard
      cleanup();
      render(
        <TopPosition ranking={createMockRanking({ position: 15, isTopTen: false })} loading={false} error={null} onRetry={vi.fn()} />
      );
      const standardBadge = screen.getByRole('button', { name: /ranking position 15/i });
      const standardClasses = standardBadge.className;

      // Classes should be different
      expect(topTenClasses).not.toBe(standardClasses);

      // Verify top 10 has golden styling
      expect(topTenClasses).toContain('yellow');
      expect(topTenClasses).toContain('focus:ring-yellow-500');

      // Verify standard has blue styling
      expect(standardClasses).toContain('blue');
      expect(standardClasses).toContain('focus:ring-blue-500');
    });
  });
});

// ============================================================================
// T020: Test "Not Ranked" badge shown for invalid users
// ============================================================================

describe('TopPosition Component - Not Ranked State', () => {
  describe('T020: "Not Ranked" badge shown for invalid users', () => {
    it('should display "Not Ranked" when ranking is null (user not found)', () => {
      render(<TopPosition ranking={null} loading={false} error={null} onRetry={vi.fn()} />);

      expect(screen.getByText(/not ranked/i)).toBeInTheDocument();
    });

    it('should show MinusCircle icon for "Not Ranked" state', () => {
      const { container } = render(
        <TopPosition ranking={null} loading={false} error={null} onRetry={vi.fn()} />
      );

      // MinusCircle icon should be present
      const icon = container.querySelector('[data-icon="minus-circle"], [class*="minus"]');
      expect(icon).toBeInTheDocument();
    });

    it('should apply muted/gray styling for "Not Ranked"', () => {
      const { container } = render(
        <TopPosition ranking={null} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Check for muted/gray styling
      const badge = container.querySelector('[class*="muted"], [class*="gray"], [class*="inactive"]');
      expect(badge).toBeInTheDocument();
    });

    it('should not show position number for "Not Ranked"', () => {
      render(<TopPosition ranking={null} loading={false} error={null} onRetry={vi.fn()} />);

      // Should NOT show "Top #X"
      expect(screen.queryByText(/top #\d+/i)).not.toBeInTheDocument();
    });

    it('should still render badge element for "Not Ranked" (not completely hidden)', () => {
      const { container } = render(
        <TopPosition ranking={null} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Badge should exist (unlike when wallet not connected)
      expect(screen.getByText(/not ranked/i)).toBeInTheDocument();
    });
  });
});

// ============================================================================
// T021: Test error badge displayed on fetch failure
// ============================================================================

describe('TopPosition Component - Error State', () => {
  describe('T021: Error badge displayed on fetch failure', () => {
    it('should display error message when error prop is set', () => {
      const errorMessage = 'Failed to load ranking data';
      render(<TopPosition ranking={null} loading={false} error={errorMessage} onRetry={vi.fn()} />);

      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });

    it('should show retry button on error', () => {
      render(<TopPosition ranking={null} loading={false} error="Network error" onRetry={vi.fn()} />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
    });

    it('should display AlertCircle icon for error state', () => {
      const { container } = render(
        <TopPosition ranking={null} loading={false} error="Error occurred" onRetry={vi.fn()} />
      );

      // AlertCircle icon should be present
      const icon = container.querySelector('[data-icon="alert"], [class*="alert"]');
      expect(icon).toBeInTheDocument();
    });

    it('should apply error/red styling for error state', () => {
      const { container } = render(
        <TopPosition ranking={null} loading={false} error="Error" onRetry={vi.fn()} />
      );

      // Check for error/red styling
      const badge = container.querySelector('[class*="error"], [class*="red"], [class*="alert"]');
      expect(badge).toBeInTheDocument();
    });

    it('should not show ranking data when error occurs', () => {
      const ranking = createMockRanking();
      render(<TopPosition ranking={ranking} loading={false} error="Error" onRetry={vi.fn()} />);

      // Error should take precedence over ranking data
      expect(screen.queryByText(/top #11/i)).not.toBeInTheDocument();
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});

// ============================================================================
// T022: Test retry button triggers immediate refetch
// ============================================================================

describe('TopPosition Component - Retry Functionality', () => {
  describe('T022: Retry button triggers immediate refetch', () => {
    it('should call onRetry when retry button clicked', () => {
      const onRetryMock = vi.fn();
      render(<TopPosition ranking={null} loading={false} error="Network error" onRetry={onRetryMock} />);

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      expect(onRetryMock).toHaveBeenCalledTimes(1);
    });

    it('should show loading state after retry button clicked', () => {
      const onRetryMock = vi.fn();
      const { rerender } = render(
        <TopPosition ranking={null} loading={false} error="Error" onRetry={onRetryMock} />
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      // Simulate loading state after retry
      rerender(<TopPosition ranking={null} loading={true} error={null} onRetry={onRetryMock} />);

      // Loading indicator should be visible
      expect(screen.getByRole('progressbar') || screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should include RotateCw icon in retry button', () => {
      const { container } = render(
        <TopPosition ranking={null} loading={false} error="Error" onRetry={vi.fn()} />
      );

      // RotateCw icon should be in retry button
      const retryButton = screen.getByRole('button', { name: /retry/i });
      const icon = retryButton.querySelector('svg, [data-icon="rotate"]');
      expect(icon).toBeInTheDocument();
    });

    it('should disable retry button while loading', () => {
      render(<TopPosition ranking={null} loading={true} error={null} onRetry={vi.fn()} />);

      // If loading, retry button should either be disabled or not shown
      const retryButton = screen.queryByRole('button', { name: /retry/i });
      if (retryButton) {
        expect(retryButton).toBeDisabled();
      }
    });

    it('should clear error message after successful retry', () => {
      const onRetryMock = vi.fn();
      const { rerender } = render(
        <TopPosition ranking={null} loading={false} error="Error" onRetry={onRetryMock} />
      );

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      // Simulate successful retry with ranking data
      const ranking = createMockRanking();
      rerender(<TopPosition ranking={ranking} loading={false} error={null} onRetry={onRetryMock} />);

      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
      expect(screen.getByText(/top #11/i)).toBeInTheDocument();
    });
  });
});

// ============================================================================
// Additional Integration Tests
// ============================================================================

describe('TopPosition Component - Integration Scenarios', () => {
  it('should handle loading state correctly', () => {
    render(<TopPosition ranking={null} loading={true} error={null} onRetry={vi.fn()} />);

    // Loading indicator should be present
    expect(screen.getByRole('progressbar') || screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should transition from loading to ranked state', () => {
    const { rerender } = render(
      <TopPosition ranking={null} loading={true} error={null} onRetry={vi.fn()} />
    );

    // Initially loading
    expect(screen.getByRole('progressbar') || screen.getByText(/loading/i)).toBeInTheDocument();

    // After data loads
    const ranking = createMockRanking({ position: 7, isTopTen: true });
    rerender(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByText(/top #7/i)).toBeInTheDocument();
  });

  it('should handle all state combinations correctly', () => {
    const scenarios = [
      { ranking: null, loading: false, error: null, expected: 'Not Ranked' },
      { ranking: null, loading: true, error: null, expected: 'Loading' },
      { ranking: null, loading: false, error: 'Error', expected: 'Error' },
      { ranking: createMockRanking({ position: 1 }), loading: false, error: null, expected: 'Top #1' },
    ];

    scenarios.forEach(({ ranking, loading, error, expected }) => {
      const { unmount } = render(
        <TopPosition ranking={ranking} loading={loading} error={error} onRetry={vi.fn()} />
      );

      if (expected === 'Loading') {
        expect(screen.getByRole('progressbar') || screen.getByText(/loading/i)).toBeInTheDocument();
      } else if (expected === 'Error') {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      } else if (expected === 'Not Ranked') {
        expect(screen.getByText(/not ranked/i)).toBeInTheDocument();
      } else {
        expect(screen.getByText(new RegExp(expected, 'i'))).toBeInTheDocument();
      }

      unmount();
    });
  });
});
// ============================================================================
// USER STORY 2: See Detailed Ranking Information (Tooltip)
// ============================================================================

describe('TopPosition Component - Tooltip Feature (User Story 2)', () => {
  // ============================================================================
  // T028: Test tooltip appears on hover
  // ============================================================================
  
  describe('T028: Tooltip appears on hover', () => {
    it('should show tooltip when hovering over ranked badge', async () => {
      const ranking = createMockRanking({ position: 42, isTopTen: false });
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      const badge = screen.getByRole('button', { name: /ranking position 42/i });
      
      // Hover over badge
      fireEvent.mouseEnter(badge);
      
      // Tooltip should appear
      const tooltip = container.querySelector('[role="tooltip"]');
      expect(tooltip).toBeInTheDocument();
    });

    it('should display tooltip content when hovering', () => {
      const ranking = createMockRanking({ position: 15, totalMiners: 200 });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      const badge = screen.getByRole('button');
      fireEvent.mouseEnter(badge);

      // Tooltip should contain position information
      expect(screen.getByText(/#15 of 200/i)).toBeInTheDocument();
    });

    it('should not show tooltip when badge is not hovered', () => {
      const ranking = createMockRanking();
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // No hover - tooltip should not be visible
      const tooltip = container.querySelector('[role="tooltip"]');
      expect(tooltip).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // T029: Test tooltip hides on mouse leave
  // ============================================================================
  
  describe('T029: Tooltip hides on mouse leave', () => {
    it('should hide tooltip when mouse leaves badge', () => {
      const ranking = createMockRanking();
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      const badge = screen.getByRole('button');
      
      // Show tooltip
      fireEvent.mouseEnter(badge);
      expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument();
      
      // Hide tooltip
      fireEvent.mouseLeave(badge);
      expect(container.querySelector('[role="tooltip"]')).not.toBeInTheDocument();
    });

    it('should toggle tooltip visibility on repeated hover/leave', () => {
      const ranking = createMockRanking();
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      const badge = screen.getByRole('button');
      
      // First hover
      fireEvent.mouseEnter(badge);
      expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument();
      
      fireEvent.mouseLeave(badge);
      expect(container.querySelector('[role="tooltip"]')).not.toBeInTheDocument();
      
      // Second hover
      fireEvent.mouseEnter(badge);
      expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // T030: Test tooltip displays correct position format
  // ============================================================================
  
  describe('T030: Tooltip displays correct position format', () => {
    it('should display position in "#X of Y miners" format', () => {
      const ranking = createMockRanking({ position: 42, totalMiners: 1523 });
      const { container } = render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      const badge = screen.getByRole('button');
      fireEvent.mouseEnter(badge);

      const tooltip = container.querySelector('[role="tooltip"]');
      expect(tooltip).toBeInTheDocument();

      // Check tooltip contains the position text
      const tooltipText = tooltip?.textContent || '';
      expect(tooltipText).toMatch(/#42 of (1,523|1\.523) miners/);
    });

    it('should display position 1 correctly', () => {
      const ranking = createMockRanking({ position: 1, totalMiners: 100, isTopTen: true });
      const { container } = render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));

      const tooltip = container.querySelector('[role="tooltip"]');
      const tooltipText = tooltip?.textContent || '';
      expect(tooltipText).toContain('#1 of 100 miners');
    });

    it('should format large numbers with commas or spaces', () => {
      const ranking = createMockRanking({ position: 500, totalMiners: 10000 });
      const { container } = render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));

      const tooltip = container.querySelector('[role="tooltip"]');
      const tooltipText = tooltip?.textContent || '';
      // Match #500 of 10,000 or 10.000 or 10 000
      expect(tooltipText).toMatch(/#500 of (10,000|10\.000|10 000) miners/);
    });
  });

  // ============================================================================
  // T031: Test tooltip displays formatted hashrate
  // ============================================================================
  
  describe('T031: Tooltip displays formatted hashrate with correct units', () => {
    it('should display hashrate in TH/s for terahashes', () => {
      const ranking = createMockRanking({ hashrate: 4.5e12, position: 1, isTopTen: true });
      const { container } = render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));

      const tooltip = container.querySelector('[role="tooltip"]');
      const tooltipText = tooltip?.textContent || '';
      expect(tooltipText).toMatch(/4\.5(0)?\s*TH\/s/i);
    });

    it('should display hashrate in GH/s for gigahashes', () => {
      const ranking = createMockRanking({ hashrate: 3.2e9 });
      const { container } = render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));

      const tooltip = container.querySelector('[role="tooltip"]');
      const tooltipText = tooltip?.textContent || '';
      expect(tooltipText).toMatch(/3\.2(0)?\s*GH\/s/i);
    });

    it('should display hashrate in MH/s for megahashes', () => {
      const ranking = createMockRanking({ hashrate: 5.5e6 });
      const { container } = render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));

      const tooltip = container.querySelector('[role="tooltip"]');
      const tooltipText = tooltip?.textContent || '';
      expect(tooltipText).toMatch(/5\.5(0)?\s*MH\/s/i);
    });

    it('should use appropriate decimal precision for hashrate', () => {
      const ranking = createMockRanking({ hashrate: 1.234e12 });
      const { container } = render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));

      const tooltip = container.querySelector('[role="tooltip"]');
      const tooltipText = tooltip?.textContent || '';
      // Should show reasonable precision (not too many decimals)
      expect(tooltipText).toMatch(/1\.\d{1,3}\s*TH\/s/i);
    });
  });

  // ============================================================================
  // T032: Test tooltip displays network share with dynamic precision
  // ============================================================================
  
  describe('T032: Tooltip displays network share with dynamic precision', () => {
    it('should display network share with 2 decimals when >= 1%', () => {
      const ranking = createMockRanking({ networkShare: 2.3456 });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));
      
      expect(screen.getByText(/2\.35%/)).toBeInTheDocument();
    });

    it('should display network share with 4 decimals when < 1%', () => {
      const ranking = createMockRanking({ networkShare: 0.4237 });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));
      
      expect(screen.getByText(/0\.4237%/)).toBeInTheDocument();
    });

    it('should handle boundary at 1% correctly', () => {
      const ranking = createMockRanking({ networkShare: 1.0 });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));
      
      expect(screen.getByText(/1\.00%/)).toBeInTheDocument();
    });

    it('should display very small percentages with 4 decimals', () => {
      const ranking = createMockRanking({ networkShare: 0.0123 });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));
      
      expect(screen.getByText(/0\.0123%/)).toBeInTheDocument();
    });
  });

  // ============================================================================
  // T033: Test "Elite Miner" badge visible for top 10
  // ============================================================================
  
  describe('T033: "Elite Miner" badge visible in tooltip for top 10 positions', () => {
    it('should show "Elite Miner" badge for position 1', () => {
      const ranking = createMockRanking({ position: 1, isTopTen: true });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));
      
      expect(screen.getByText(/elite miner/i)).toBeInTheDocument();
    });

    it('should show "Elite Miner" badge for position 10', () => {
      const ranking = createMockRanking({ position: 10, isTopTen: true });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));
      
      expect(screen.getByText(/elite miner/i)).toBeInTheDocument();
    });

    it('should NOT show "Elite Miner" badge for position 11', () => {
      const ranking = createMockRanking({ position: 11, isTopTen: false });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));
      
      expect(screen.queryByText(/elite miner/i)).not.toBeInTheDocument();
    });

    it('should NOT show "Elite Miner" badge for position 50', () => {
      const ranking = createMockRanking({ position: 50, isTopTen: false });
      render(<TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />);

      fireEvent.mouseEnter(screen.getByRole('button'));
      
      expect(screen.queryByText(/elite miner/i)).not.toBeInTheDocument();
    });

    it('should show "Elite Miner" badge with special styling', () => {
      const ranking = createMockRanking({ position: 5, isTopTen: true });
      const { container } = render(
        <TopPosition ranking={ranking} loading={false} error={null} onRetry={vi.fn()} />
      );

      fireEvent.mouseEnter(screen.getByRole('button'));

      const eliteBadge = screen.getByText(/elite miner/i);
      expect(eliteBadge).toBeInTheDocument();

      // Should have special styling (check parent element has yellow/gold styling)
      const badgeContainer = eliteBadge.closest('div');
      const classNames = badgeContainer?.className || '';
      expect(classNames).toMatch(/elite|badge|yellow|gold/);
    });
  });

  // ============================================================================
  // T043: Test badge re-renders with new position after auto-refresh
  // ============================================================================

  describe('T043: Badge re-renders with new position after auto-refresh', () => {
    it('should re-render when ranking prop changes from position 1 to position 5', () => {
      const initialRanking = createMockRanking({ position: 1, isTopTen: true });
      const { rerender } = render(
        <TopPosition ranking={initialRanking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Verify initial position
      expect(screen.getByText(/top #1/i)).toBeInTheDocument();

      // Update to new position
      const updatedRanking = createMockRanking({ position: 5, isTopTen: true });
      rerender(<TopPosition ranking={updatedRanking} loading={false} error={null} onRetry={vi.fn()} />);

      // Should show new position
      expect(screen.getByText(/top #5/i)).toBeInTheDocument();
      expect(screen.queryByText(/top #1/i)).not.toBeInTheDocument();
    });

    it('should update styling when moving from top 10 to standard', () => {
      const topTenRanking = createMockRanking({ position: 10, isTopTen: true });
      const { rerender } = render(
        <TopPosition ranking={topTenRanking} loading={false} error={null} onRetry={vi.fn()} />
      );

      const badge = screen.getByRole('button');
      const initialClasses = badge.className;

      // Should have golden styling
      expect(initialClasses).toContain('yellow');

      // Update to standard ranking
      const standardRanking = createMockRanking({ position: 11, isTopTen: false });
      rerender(<TopPosition ranking={standardRanking} loading={false} error={null} onRetry={vi.fn()} />);

      const updatedBadge = screen.getByRole('button');
      const updatedClasses = updatedBadge.className;

      // Should have blue styling
      expect(updatedClasses).toContain('blue');
      expect(updatedClasses).not.toContain('yellow');
    });

    it('should update icon when moving from top 10 to standard', () => {
      const topTenRanking = createMockRanking({ position: 10, isTopTen: true });
      const { rerender, container } = render(
        <TopPosition ranking={topTenRanking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Should show star icon
      expect(container.querySelector('[data-icon="star"]')).toBeInTheDocument();

      // Update to standard ranking
      const standardRanking = createMockRanking({ position: 11, isTopTen: false });
      rerender(<TopPosition ranking={standardRanking} loading={false} error={null} onRetry={vi.fn()} />);

      // Should show trending icon
      expect(container.querySelector('[data-icon="trending"]')).toBeInTheDocument();
      expect(container.querySelector('[data-icon="star"]')).not.toBeInTheDocument();
    });

    it('should update hashrate in tooltip when ranking changes', () => {
      const initialRanking = createMockRanking({ hashrate: 4.5e12, position: 1, isTopTen: true });
      const { rerender, container } = render(
        <TopPosition ranking={initialRanking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Show tooltip
      fireEvent.mouseEnter(screen.getByRole('button'));

      // Check initial hashrate
      let tooltip = container.querySelector('[role="tooltip"]');
      let tooltipText = tooltip?.textContent || '';
      expect(tooltipText).toMatch(/4\.5(0)?\s*TH\/s/i);

      // Update ranking with new hashrate
      const updatedRanking = createMockRanking({ hashrate: 5.0e12, position: 1, isTopTen: true });
      rerender(<TopPosition ranking={updatedRanking} loading={false} error={null} onRetry={vi.fn()} />);

      // Tooltip should update
      tooltip = container.querySelector('[role="tooltip"]');
      tooltipText = tooltip?.textContent || '';
      expect(tooltipText).toMatch(/5\.0(0?)?\s*TH\/s/i);
    });

    it('should handle transition from ranked to not ranked', () => {
      const rankedUser = createMockRanking({ position: 42, isTopTen: false });
      const { rerender } = render(
        <TopPosition ranking={rankedUser} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Verify ranked state
      expect(screen.getByText(/top #42/i)).toBeInTheDocument();

      // Update to not ranked
      rerender(<TopPosition ranking={null} loading={false} error={null} onRetry={vi.fn()} />);

      // Should show "Not Ranked"
      expect(screen.getByText(/not ranked/i)).toBeInTheDocument();
      expect(screen.queryByText(/top #42/i)).not.toBeInTheDocument();
    });

    it('should handle transition from not ranked to ranked', () => {
      const { rerender } = render(
        <TopPosition ranking={null} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Verify not ranked state
      expect(screen.getByText(/not ranked/i)).toBeInTheDocument();

      // Update to ranked
      const rankedUser = createMockRanking({ position: 15, isTopTen: false });
      rerender(<TopPosition ranking={rankedUser} loading={false} error={null} onRetry={vi.fn()} />);

      // Should show position
      expect(screen.getByText(/top #15/i)).toBeInTheDocument();
      expect(screen.queryByText(/not ranked/i)).not.toBeInTheDocument();
    });

    it('should update Elite Miner badge in tooltip when moving in/out of top 10', () => {
      const topTenRanking = createMockRanking({ position: 10, isTopTen: true });
      const { rerender, container } = render(
        <TopPosition ranking={topTenRanking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Show tooltip
      fireEvent.mouseEnter(screen.getByRole('button'));

      // Should show Elite Miner badge
      expect(screen.getByText(/elite miner/i)).toBeInTheDocument();

      // Update to standard ranking (position 11)
      const standardRanking = createMockRanking({ position: 11, isTopTen: false });
      rerender(<TopPosition ranking={standardRanking} loading={false} error={null} onRetry={vi.fn()} />);

      // Elite Miner badge should be gone
      expect(screen.queryByText(/elite miner/i)).not.toBeInTheDocument();
    });

    it('should preserve tooltip open state across ranking updates', () => {
      const initialRanking = createMockRanking({ position: 1, isTopTen: true });
      const { rerender, container } = render(
        <TopPosition ranking={initialRanking} loading={false} error={null} onRetry={vi.fn()} />
      );

      // Open tooltip
      fireEvent.mouseEnter(screen.getByRole('button'));
      expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument();

      // Update ranking while tooltip is open
      const updatedRanking = createMockRanking({ position: 2, isTopTen: true });
      rerender(<TopPosition ranking={updatedRanking} loading={false} error={null} onRetry={vi.fn()} />);

      // Tooltip should still be open
      expect(container.querySelector('[role="tooltip"]')).toBeInTheDocument();

      // Content should update
      const tooltip = container.querySelector('[role="tooltip"]');
      const tooltipText = tooltip?.textContent || '';
      expect(tooltipText).toContain('#2 of');
    });
  });
});
