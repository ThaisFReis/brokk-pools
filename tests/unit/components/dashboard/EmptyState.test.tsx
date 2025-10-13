/**
 * Unit Tests: EmptyState Component
 * Tests empty state display when no positions
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock will be implemented later
const EmptyState = ({ message }: { message?: string }) => <div>EmptyState Mock</div>;

describe('EmptyState Component', () => {
  describe('T037: Renders message when no positions found', () => {
    it('should render empty state message', () => {
      render(<EmptyState />);

      expect(screen.getByText(/no (liquidity |)positions found/i)).toBeInTheDocument();
    });

    it('should display helpful guidance text', () => {
      render(<EmptyState />);

      expect(screen.getByText(/create.*position|add.*liquidity/i)).toBeInTheDocument();
    });

    it('should show icon or illustration', () => {
      render(<EmptyState />);

      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toBeInTheDocument();
    });

    it('should support custom message', () => {
      const customMessage = 'Connect your wallet to view positions';
      render(<EmptyState message={customMessage} />);

      expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('should have centered layout', () => {
      const { container } = render(<EmptyState />);

      const emptyStateContainer = container.firstChild;
      expect(emptyStateContainer).toHaveClass(/center|flex.*center|mx-auto/i);
    });
  });

  describe('Call to Action', () => {
    it('should show link to create position (external)', () => {
      render(<EmptyState />);

      const link = screen.getByRole('link', { name: /create position|add liquidity/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href');
    });

    it('should open external links in new tab', () => {
      render(<EmptyState />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });

  describe('Visual Design', () => {
    it('should use muted colors for empty state', () => {
      const { container } = render(<EmptyState />);

      const text = container.querySelector('[class*="text"]');
      expect(text).toHaveClass(/gray|muted|secondary/i);
    });

    it('should have appropriate spacing', () => {
      const { container } = render(<EmptyState />);

      const emptyState = container.firstChild;
      expect(emptyState).toHaveClass(/p-|py-|space-/i);
    });
  });

  describe('Accessibility', () => {
    it('should have semantic HTML', () => {
      render(<EmptyState />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have descriptive aria-label', () => {
      render(<EmptyState />);

      const emptyState = screen.getByRole('status');
      expect(emptyState).toHaveAccessibleName();
    });
  });
});
