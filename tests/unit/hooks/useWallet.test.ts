/**
 * Unit Tests: useWallet Hook
 * Tests custom wallet hook functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock will be implemented later
const useWallet = () => ({
  wallet: null,
  connected: false,
  connecting: false,
  publicKey: null,
  connect: vi.fn(),
  disconnect: vi.fn(),
  select: vi.fn(),
});

describe('useWallet Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('T031: Returns wallet state and functions', () => {
    it('should return initial disconnected state', () => {
      const { result } = renderHook(() => useWallet());

      expect(result.current.connected).toBe(false);
      expect(result.current.connecting).toBe(false);
      expect(result.current.publicKey).toBeNull();
      expect(result.current.wallet).toBeNull();
    });

    it('should provide connect function', () => {
      const { result } = renderHook(() => useWallet());

      expect(result.current.connect).toBeDefined();
      expect(typeof result.current.connect).toBe('function');
    });

    it('should provide disconnect function', () => {
      const { result } = renderHook(() => useWallet());

      expect(result.current.disconnect).toBeDefined();
      expect(typeof result.current.disconnect).toBe('function');
    });

    it('should provide select function for choosing wallet', () => {
      const { result } = renderHook(() => useWallet());

      expect(result.current.select).toBeDefined();
      expect(typeof result.current.select).toBe('function');
    });

    it('should update connecting state during connection', async () => {
      const { result } = renderHook(() => useWallet());

      result.current.connect();

      await waitFor(() => {
        expect(result.current.connecting).toBe(true);
      });
    });

    it('should update connected state after successful connection', async () => {
      const { result } = renderHook(() => useWallet());

      await result.current.connect();

      await waitFor(() => {
        expect(result.current.connected).toBe(true);
        expect(result.current.connecting).toBe(false);
      });
    });

    it('should set publicKey after connection', async () => {
      const { result } = renderHook(() => useWallet());

      await result.current.connect();

      await waitFor(() => {
        expect(result.current.publicKey).not.toBeNull();
        expect(result.current.publicKey?.toString()).toMatch(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/);
      });
    });

    it('should set wallet adapter info after connection', async () => {
      const { result } = renderHook(() => useWallet());

      await result.current.connect();

      await waitFor(() => {
        expect(result.current.wallet).not.toBeNull();
        expect(result.current.wallet?.adapter.name).toBeDefined();
      });
    });

    it('should reset state after disconnect', async () => {
      const { result } = renderHook(() => useWallet());

      // Connect first
      await result.current.connect();
      await waitFor(() => expect(result.current.connected).toBe(true));

      // Then disconnect
      await result.current.disconnect();

      await waitFor(() => {
        expect(result.current.connected).toBe(false);
        expect(result.current.publicKey).toBeNull();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle connection errors gracefully', async () => {
      const { result } = renderHook(() => useWallet());

      // Simulate connection error
      const mockError = new Error('User rejected connection');
      vi.spyOn(console, 'error').mockImplementation(() => {});

      try {
        await result.current.connect();
      } catch (error) {
        expect(error).toEqual(mockError);
      }

      expect(result.current.connected).toBe(false);
      expect(result.current.connecting).toBe(false);
    });

    it('should handle wallet not installed error', async () => {
      const { result } = renderHook(() => useWallet());

      await result.current.select('Phantom');

      await waitFor(() => {
        expect(result.current.wallet).toBeNull();
      });
    });
  });

  describe('Wallet Selection', () => {
    it('should select Phantom wallet', async () => {
      const { result } = renderHook(() => useWallet());

      await result.current.select('Phantom');

      await waitFor(() => {
        expect(result.current.wallet?.adapter.name).toBe('Phantom');
      });
    });

    it('should select Solflare wallet', async () => {
      const { result } = renderHook(() => useWallet());

      await result.current.select('Solflare');

      await waitFor(() => {
        expect(result.current.wallet?.adapter.name).toBe('Solflare');
      });
    });

    it('should select Backpack wallet', async () => {
      const { result } = renderHook(() => useWallet());

      await result.current.select('Backpack');

      await waitFor(() => {
        expect(result.current.wallet?.adapter.name).toBe('Backpack');
      });
    });
  });
});
