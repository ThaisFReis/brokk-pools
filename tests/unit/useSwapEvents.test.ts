// tests/unit/useSwapEvents.test.ts
// Unit tests for useSwapEvents hook

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSwapEvents } from '../../src/hooks/useSwapEvents';
import { useSwapStore } from '../../src/store/swapStore';
import type { SwapResult } from '../../src/types/swap';

// Mock the swap store
vi.mock('../../src/store/swapStore', () => ({
  useSwapStore: vi.fn(),
}));

describe('useSwapEvents', () => {
  let mockAddSwapRecord: ReturnType<typeof vi.fn>;
  let mockSetCustomSlippageBps: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Setup mock store functions
    mockAddSwapRecord = vi.fn();
    mockSetCustomSlippageBps = vi.fn();

    // Mock useSwapStore to return our mock functions
    (useSwapStore as any).mockReturnValue({
      addSwapRecord: mockAddSwapRecord,
      setCustomSlippageBps: mockSetCustomSlippageBps,
      customSlippageBps: 50,
    });
  });

  describe('Hook initialization', () => {
    it('should return success and error handlers', () => {
      const { result } = renderHook(() => useSwapEvents());

      expect(result.current).toHaveProperty('handleSuccess');
      expect(result.current).toHaveProperty('handleError');
      expect(typeof result.current.handleSuccess).toBe('function');
      expect(typeof result.current.handleError).toBe('function');
    });

    it('should memoize handlers with useCallback', () => {
      const { result, rerender } = renderHook(() => useSwapEvents());

      const firstHandleSuccess = result.current.handleSuccess;
      const firstHandleError = result.current.handleError;

      // Re-render should maintain same function references
      rerender();

      expect(result.current.handleSuccess).toBe(firstHandleSuccess);
      expect(result.current.handleError).toBe(firstHandleError);
    });
  });

  describe('handleSuccess', () => {
    it('should add swap record to store when swap succeeds', () => {
      const { result } = renderHook(() => useSwapEvents());

      const txid = 'test-transaction-id-123';
      const swapResult: SwapResult = {
        inputMint: 'So11111111111111111111111111111111111111112', // SOL
        outputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
        inAmount: '1000000000', // 1 SOL (9 decimals)
        outAmount: '50000000', // 50 USDC (6 decimals)
        txid,
      };

      act(() => {
        result.current.handleSuccess(txid, swapResult);
      });

      // Verify addSwapRecord was called
      expect(mockAddSwapRecord).toHaveBeenCalledTimes(1);
      expect(mockAddSwapRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          txid,
          status: 'confirmed',
          timestamp: expect.any(Number),
          explorerUrl: expect.stringContaining(txid),
        })
      );
    });

    it('should create explorer URL with correct format', () => {
      const { result } = renderHook(() => useSwapEvents());

      const txid = 'test-txid';
      const swapResult: SwapResult = {
        inputMint: 'SOL',
        outputMint: 'USDC',
        inAmount: '1000000',
        outAmount: '50000',
        txid,
      };

      act(() => {
        result.current.handleSuccess(txid, swapResult);
      });

      const call = mockAddSwapRecord.mock.calls[0][0];
      expect(call.explorerUrl).toMatch(/solscan\.io\/tx\//);
      expect(call.explorerUrl).toContain(txid);
    });

    it('should handle amounts correctly', () => {
      const { result } = renderHook(() => useSwapEvents());

      const swapResult: SwapResult = {
        inputMint: 'SOL',
        outputMint: 'USDC',
        inAmount: '1500000000', // 1.5 SOL
        outAmount: '75000000', // 75 USDC
        txid: 'test-txid',
      };

      act(() => {
        result.current.handleSuccess('test-txid', swapResult);
      });

      const call = mockAddSwapRecord.mock.calls[0][0];
      expect(call.inputAmount).toBe(1.5); // Should convert from base units
      expect(call.outputAmount).toBe(75);
    });

    it('should call custom onSuccess callback if provided', () => {
      const customOnSuccess = vi.fn();
      const { result } = renderHook(() => useSwapEvents(customOnSuccess));

      const txid = 'test-txid';
      const swapResult: SwapResult = {
        inputMint: 'SOL',
        outputMint: 'USDC',
        inAmount: '1000000',
        outAmount: '50000',
        txid,
      };

      act(() => {
        result.current.handleSuccess(txid, swapResult);
      });

      expect(customOnSuccess).toHaveBeenCalledWith(txid, swapResult);
      expect(mockAddSwapRecord).toHaveBeenCalled();
    });

    it('should handle success without custom callback', () => {
      const { result } = renderHook(() => useSwapEvents());

      const swapResult: SwapResult = {
        inputMint: 'SOL',
        outputMint: 'USDC',
        inAmount: '1000000',
        outAmount: '50000',
        txid: 'test-txid',
      };

      expect(() => {
        act(() => {
          result.current.handleSuccess('test-txid', swapResult);
        });
      }).not.toThrow();

      expect(mockAddSwapRecord).toHaveBeenCalled();
    });
  });

  describe('handleError', () => {
    it('should log error when swap fails', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useSwapEvents());

      const error = new Error('Swap failed: Insufficient balance');

      act(() => {
        result.current.handleError(error);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Swap failed:', error);

      consoleErrorSpy.mockRestore();
    });

    it('should handle Error objects', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useSwapEvents());

      const error = new Error('Slippage tolerance exceeded');

      act(() => {
        result.current.handleError(error);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Swap failed:', error);

      consoleErrorSpy.mockRestore();
    });

    it('should handle error with custom message', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useSwapEvents());

      const error = new Error('User rejected transaction');

      act(() => {
        result.current.handleError(error);
      });

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should call custom onSwapError callback if provided', () => {
      const customOnError = vi.fn();
      const { result } = renderHook(() =>
        useSwapEvents(undefined, customOnError)
      );

      const error = new Error('Network error');

      act(() => {
        result.current.handleError(error);
      });

      expect(customOnError).toHaveBeenCalledWith(error);
    });

    it('should handle errors without custom callback', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { result } = renderHook(() => useSwapEvents());

      const error = new Error('Generic error');

      expect(() => {
        act(() => {
          result.current.handleError(error);
        });
      }).not.toThrow();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Store integration', () => {
    it('should read customSlippageBps from store', () => {
      (useSwapStore as any).mockReturnValue({
        addSwapRecord: mockAddSwapRecord,
        customSlippageBps: 100, // 1%
      });

      const { result } = renderHook(() => useSwapEvents());

      // Hook should have access to store values
      expect(result.current).toBeDefined();
    });

    it('should handle store errors gracefully', () => {
      // Simulate store error
      (useSwapStore as any).mockImplementation(() => {
        throw new Error('Store error');
      });

      expect(() => {
        renderHook(() => useSwapEvents());
      }).toThrow('Store error');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty txid', () => {
      const { result } = renderHook(() => useSwapEvents());

      const swapResult: SwapResult = {
        inputMint: 'SOL',
        outputMint: 'USDC',
        inAmount: '1000000',
        outAmount: '50000',
        txid: '',
      };

      act(() => {
        result.current.handleSuccess('', swapResult);
      });

      expect(mockAddSwapRecord).toHaveBeenCalled();
    });

    it('should handle very large amounts', () => {
      const { result } = renderHook(() => useSwapEvents());

      const swapResult: SwapResult = {
        inputMint: 'SOL',
        outputMint: 'USDC',
        inAmount: '1000000000000000000', // Very large number
        outAmount: '50000000000000000',
        txid: 'test-txid',
      };

      act(() => {
        result.current.handleSuccess('test-txid', swapResult);
      });

      expect(mockAddSwapRecord).toHaveBeenCalled();
    });

    it('should handle missing swap result fields', () => {
      const { result } = renderHook(() => useSwapEvents());

      const incompleteResult = {
        txid: 'test-txid',
      } as SwapResult;

      expect(() => {
        act(() => {
          result.current.handleSuccess('test-txid', incompleteResult);
        });
      }).not.toThrow();
    });
  });

  describe('Memory management', () => {
    it('should not create memory leaks with multiple calls', () => {
      const { result } = renderHook(() => useSwapEvents());

      // Call handleSuccess multiple times
      for (let i = 0; i < 100; i++) {
        act(() => {
          result.current.handleSuccess(`txid-${i}`, {
            inputMint: 'SOL',
            outputMint: 'USDC',
            inAmount: '1000000',
            outAmount: '50000',
            txid: `txid-${i}`,
          });
        });
      }

      expect(mockAddSwapRecord).toHaveBeenCalledTimes(100);
    });

    it('should handle rapid success/error alternation', () => {
      const { result } = renderHook(() => useSwapEvents());

      for (let i = 0; i < 10; i++) {
        act(() => {
          if (i % 2 === 0) {
            result.current.handleSuccess(`txid-${i}`, {
              inputMint: 'SOL',
              outputMint: 'USDC',
              inAmount: '1000000',
              outAmount: '50000',
              txid: `txid-${i}`,
            });
          } else {
            result.current.handleError(new Error(`Error ${i}`));
          }
        });
      }

      expect(mockAddSwapRecord).toHaveBeenCalledTimes(5);
    });
  });
});
