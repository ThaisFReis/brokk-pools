/**
 * useWallet Hook
 * Wraps Solana wallet adapter with mock data loading
 */

import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';

/**
 * Custom wallet hook that wraps @solana/wallet-adapter-react
 * Provides wallet connection state and functions
 *
 * @returns Wallet state and connection functions
 *
 * @example
 * const { connected, publicKey, connect, disconnect } = useWallet();
 *
 * if (!connected) {
 *   return <button onClick={connect}>Connect Wallet</button>;
 * }
 *
 * return <div>Connected: {publicKey?.toString()}</div>;
 */
export function useWallet() {
  const {
    wallet,
    publicKey,
    connected,
    connecting,
    connect: solanaConnect,
    disconnect: solanaDisconnect,
    select,
  } = useSolanaWallet();

  /**
   * Connect to selected wallet
   * Loads mock position data on successful connection
   */
  const connect = useCallback(async () => {
    try {
      await solanaConnect();
      // Mock data will be loaded by usePositions hook
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }, [solanaConnect]);

  /**
   * Disconnect from wallet
   * Clears position data
   */
  const disconnect = useCallback(async () => {
    try {
      await solanaDisconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  }, [solanaDisconnect]);

  /**
   * Get shortened wallet address for display
   * Format: "GkH3...MBpW" (first 4 + last 4 characters)
   */
  const getDisplayAddress = useCallback((): string | null => {
    if (!publicKey) return null;

    const address = publicKey.toString();
    if (address.length <= 8) return address;

    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }, [publicKey]);

  return {
    wallet,
    publicKey,
    connected,
    connecting,
    connect,
    disconnect,
    select,
    displayAddress: getDisplayAddress(),
    adapterName: wallet?.adapter.name || null,
  };
}
