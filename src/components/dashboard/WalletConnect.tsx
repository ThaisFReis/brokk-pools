/**
 * WalletConnect Component
 * Handles wallet connection UI and interaction
 */

import { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '../../hooks/useWallet';

export function WalletConnect() {
  const { connected, displayAddress, adapterName } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (displayAddress) {
      try {
        await navigator.clipboard.writeText(displayAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy address:', error);
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      {connected && displayAddress && (
        <div
          className="hidden cursor-pointer items-center gap-2 rounded-lg border border-solana-purple/20 bg-solana-dark px-4 py-2 transition-colors hover:border-solana-purple/40 md:flex"
          onClick={handleCopyAddress}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleCopyAddress();
            }
          }}
        >
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">{adapterName}</span>
            <span className="font-mono text-sm text-solana-cyan">{displayAddress}</span>
          </div>
          {copied && <span className="text-xs text-solana-green">Copied!</span>}
        </div>
      )}

      <WalletMultiButton
        className="!rounded-lg !bg-solana-purple !transition-all hover:!bg-solana-purple/80"
        style={{
          backgroundColor: 'var(--solana-purple)',
          height: '44px',
          fontSize: '14px',
          fontWeight: '600',
        }}
      />

      {/* Hidden status for screen readers */}
      <div role="status" className="sr-only">
        {connected ? `Connected to ${adapterName}` : 'Not connected'}
      </div>
    </div>
  );
}
