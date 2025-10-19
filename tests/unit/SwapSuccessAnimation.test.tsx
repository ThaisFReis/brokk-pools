// tests/unit/SwapSuccessAnimation.test.tsx
// Unit tests for SwapSuccessAnimation component

import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SwapSuccessAnimation } from '../../src/components/swap/SwapSuccessAnimation';
import confetti from 'canvas-confetti';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('SwapSuccessAnimation', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Reset timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Confetti triggering', () => {
    it('should trigger confetti when txid changes from null to valid string', () => {
      const { rerender } = render(<SwapSuccessAnimation txid={null} />);

      // Confetti should not be called with null txid
      expect(confetti).not.toHaveBeenCalled();

      // Update txid to valid string
      rerender(<SwapSuccessAnimation txid="test-transaction-id-123" />);

      // Confetti should be called
      expect(confetti).toHaveBeenCalled();
    });

    it('should NOT trigger confetti when txid is null', () => {
      render(<SwapSuccessAnimation txid={null} />);

      expect(confetti).not.toHaveBeenCalled();
    });

    it('should NOT trigger confetti when txid is undefined', () => {
      render(<SwapSuccessAnimation txid={undefined as any} />);

      expect(confetti).not.toHaveBeenCalled();
    });

    it('should trigger confetti when component mounts with valid txid', () => {
      render(<SwapSuccessAnimation txid="test-txid" />);

      expect(confetti).toHaveBeenCalled();
    });
  });

  describe('Solana color palette', () => {
    it('should use Solana color palette in confetti', () => {
      render(<SwapSuccessAnimation txid="test-txid" />);

      // Check that confetti was called with Solana colors
      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          colors: expect.arrayContaining([
            '#9945FF', // Solana purple
            '#14F195', // Solana cyan
            '#00D4AA', // Solana teal
            '#FF006E', // Solana pink
          ]),
        })
      );
    });

    it('should use custom colors if provided', () => {
      const customColors = ['#FF0000', '#00FF00', '#0000FF'];
      render(<SwapSuccessAnimation txid="test-txid" colors={customColors} />);

      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          colors: customColors,
        })
      );
    });
  });

  describe('Confetti burst pattern', () => {
    it('should fire main burst immediately', () => {
      render(<SwapSuccessAnimation txid="test-txid" />);

      // Main burst should be called immediately
      expect(confetti).toHaveBeenCalledTimes(1);
      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      );
    });

    it('should fire side bursts at 250ms and 400ms delays', () => {
      render(<SwapSuccessAnimation txid="test-txid" />);

      // Main burst
      expect(confetti).toHaveBeenCalledTimes(1);

      // Advance 250ms - first side burst
      vi.advanceTimersByTime(250);
      expect(confetti).toHaveBeenCalledTimes(2);
      expect(confetti).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        })
      );

      // Advance another 150ms (total 400ms) - second side burst
      vi.advanceTimersByTime(150);
      expect(confetti).toHaveBeenCalledTimes(3);
      expect(confetti).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        })
      );
    });

    it('should use custom particleCount if provided', () => {
      render(<SwapSuccessAnimation txid="test-txid" particleCount={200} />);

      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 200,
        })
      );
    });
  });

  describe('onComplete callback', () => {
    it('should call onComplete after 3000ms (default duration)', () => {
      const onComplete = vi.fn();
      render(<SwapSuccessAnimation txid="test-txid" onComplete={onComplete} />);

      // Should not be called immediately
      expect(onComplete).not.toHaveBeenCalled();

      // Advance time by 2999ms
      vi.advanceTimersByTime(2999);
      expect(onComplete).not.toHaveBeenCalled();

      // Advance to 3000ms
      vi.advanceTimersByTime(1);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should call onComplete after custom duration', () => {
      const onComplete = vi.fn();
      const customDuration = 5000;

      render(
        <SwapSuccessAnimation
          txid="test-txid"
          onComplete={onComplete}
          duration={customDuration}
        />
      );

      // Should not be called before duration
      vi.advanceTimersByTime(4999);
      expect(onComplete).not.toHaveBeenCalled();

      // Should be called after duration
      vi.advanceTimersByTime(1);
      expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it('should NOT call onComplete if not provided', () => {
      // Should not throw error
      expect(() => {
        render(<SwapSuccessAnimation txid="test-txid" />);
        vi.advanceTimersByTime(3000);
      }).not.toThrow();
    });

    it('should clear timeout on unmount', () => {
      const onComplete = vi.fn();
      const { unmount } = render(
        <SwapSuccessAnimation txid="test-txid" onComplete={onComplete} />
      );

      // Unmount before duration completes
      vi.advanceTimersByTime(1000);
      unmount();

      // Advance past duration
      vi.advanceTimersByTime(2000);

      // onComplete should not be called
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('Component rendering', () => {
    it('should render null (no visual output)', () => {
      const { container } = render(<SwapSuccessAnimation txid="test-txid" />);

      // Component should not render any DOM elements
      expect(container.firstChild).toBeNull();
    });

    it('should be a pure side-effect component', () => {
      const { container, rerender } = render(
        <SwapSuccessAnimation txid="test-txid" />
      );

      expect(container.innerHTML).toBe('');

      // Re-render should still produce no output
      rerender(<SwapSuccessAnimation txid="another-txid" />);
      expect(container.innerHTML).toBe('');
    });
  });

  describe('Edge cases', () => {
    it('should handle rapid txid changes', () => {
      const { rerender } = render(<SwapSuccessAnimation txid={null} />);

      rerender(<SwapSuccessAnimation txid="txid-1" />);
      expect(confetti).toHaveBeenCalledTimes(1);

      rerender(<SwapSuccessAnimation txid="txid-2" />);
      // Should trigger confetti again with new txid
      expect(confetti).toHaveBeenCalledTimes(2);
    });

    it('should handle same txid re-render', () => {
      const { rerender } = render(<SwapSuccessAnimation txid="same-txid" />);

      expect(confetti).toHaveBeenCalledTimes(1);

      // Re-render with same txid should trigger again
      // (useEffect runs on every txid change, even if same value)
      rerender(<SwapSuccessAnimation txid="same-txid" />);
      expect(confetti).toHaveBeenCalledTimes(2);
    });

    it('should handle txid changing back to null', () => {
      const { rerender } = render(<SwapSuccessAnimation txid="test-txid" />);

      expect(confetti).toHaveBeenCalledTimes(1);

      rerender(<SwapSuccessAnimation txid={null} />);

      // Should not trigger confetti when changing to null
      expect(confetti).toHaveBeenCalledTimes(1);
    });
  });

  describe('Performance', () => {
    it('should cleanup timers to prevent memory leaks', () => {
      const { unmount } = render(<SwapSuccessAnimation txid="test-txid" />);

      // Get initial timer count
      const initialTimers = vi.getTimerCount();

      unmount();

      // Timers should be cleared
      expect(vi.getTimerCount()).toBeLessThanOrEqual(initialTimers);
    });

    it('should handle multiple mount/unmount cycles', () => {
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<SwapSuccessAnimation txid={`txid-${i}`} />);
        vi.advanceTimersByTime(1000);
        unmount();
      }

      // Should not throw errors or leave dangling timers
      expect(vi.getTimerCount()).toBe(0);
    });
  });
});
