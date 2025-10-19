// src/utils/jupiterConfig.ts
// Jupiter Terminal configuration and theming

import type { SolanaExplorer } from '../types/swap';

/**
 * Jupiter Terminal configuration
 *
 * These settings control the behavior of the Jupiter Terminal integration:
 * - endpoint: Solana RPC endpoint (use devnet for development, mainnet for production)
 * - defaultSlippageBps: Default slippage tolerance in basis points (50 = 0.5%)
 * - defaultExplorer: Which blockchain explorer to use for transaction links
 * - strictTokenList: Whether to use Jupiter's strict token list (verified tokens only)
 */
export const JUPITER_CONFIG = {
  endpoint:
    import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  defaultSlippageBps: 50, // 0.5%
  defaultExplorer: 'Solscan' as SolanaExplorer,
  strictTokenList: true, // Only show verified tokens by default
};

/**
 * Brokkr theme classes for Jupiter Terminal
 *
 * These Tailwind CSS classes are applied to Jupiter Terminal's containerClassName
 * to match the Brokkr Finance dark cyberpunk aesthetic with Solana colors.
 *
 * Color palette:
 * - Background: Dark gradient (#0A0A0A to #1a1a1a)
 * - Border: Subtle gray (#3a3a3a)
 * - Accent: Solana purple (#9945FF)
 * - Shadow: Purple glow for depth
 */
export const BROKKR_THEME_CLASSES = [
  // Container background and border
  'bg-gradient-to-b from-[#0A0A0A] to-[#1a1a1a]',
  'border border-[#3a3a3a]',
  'rounded-2xl',
  'shadow-2xl shadow-purple-500/20',

  // Spacing and sizing
  'w-full max-w-lg',
  'p-4 md:p-6',

  // Typography
  'font-mono text-gray-100',

  // Additional styling
  'transition-all duration-300',

  // Token selector specific (applies to entire terminal including modals)
  'jupiter-terminal',
].join(' ');

/**
 * Token selector modal specific classes
 *
 * These classes target the token selection modal specifically.
 * Applied via CSS overrides in jupiter-overrides.css
 */
export const TOKEN_SELECTOR_CLASSES = {
  // Modal container
  modal: [
    'bg-[#0A0A0A]',
    'border border-[#3a3a3a]',
    'rounded-2xl',
    'shadow-2xl shadow-purple-500/20',
    'backdrop-blur-sm',
  ].join(' '),

  // Search input
  searchInput: [
    'bg-[#1a1a1a]',
    'border border-[#3a3a3a]',
    'focus:border-purple-500',
    'focus:ring-2 focus:ring-purple-500/50',
    'text-gray-100',
    'placeholder-gray-500',
    'rounded-lg',
    'transition-all duration-200',
  ].join(' '),

  // Token list items
  tokenItem: [
    'hover:bg-[#2a2a2a]',
    'cursor-pointer',
    'transition-colors duration-200',
    'rounded-lg',
    'p-3',
  ].join(' '),

  // Token balance text
  balance: [
    'text-gray-400',
    'text-sm',
    'font-mono',
  ].join(' '),

  // Disabled token (duplicate prevention)
  disabled: [
    'opacity-50',
    'cursor-not-allowed',
    'hover:bg-transparent',
  ].join(' '),
};

/**
 * Custom CSS variables for Jupiter Terminal
 *
 * These CSS custom properties provide deeper theming control for Jupiter Terminal.
 * Apply these as inline styles via containerStyles prop.
 */
export const JUPITER_THEME_STYLES = {
  maxHeight: '90vh',
  overflow: 'auto',

  // Jupiter Terminal CSS variables (if supported)
  '--jupiter-bg-primary': '#0A0A0A',
  '--jupiter-bg-secondary': '#1a1a1a',
  '--jupiter-text-primary': '#f3f4f6',
  '--jupiter-text-secondary': '#9ca3af',
  '--jupiter-accent': '#9945FF', // Solana purple
  '--jupiter-success': '#14F195', // Solana cyan
  '--jupiter-error': '#FF006E', // Solana pink
} as React.CSSProperties;

/**
 * Solana color palette
 *
 * Official Solana brand colors for consistency across the dApp
 */
export const SOLANA_COLORS = {
  purple: '#9945FF',
  cyan: '#14F195',
  teal: '#00D4AA',
  pink: '#FF006E',
  gray: '#0A0A0A',
  lightGray: '#1a1a1a',
  borderGray: '#3a3a3a',
};

/**
 * Environment helpers
 */
export const getNetwork = (): 'mainnet-beta' | 'devnet' | 'testnet' => {
  const network = import.meta.env.VITE_SOLANA_NETWORK;
  if (network === 'devnet' || network === 'testnet') return network;
  return 'mainnet-beta';
};

export const isDevnet = (): boolean => getNetwork() === 'devnet';
export const isMainnet = (): boolean => getNetwork() === 'mainnet-beta';

/**
 * Get explorer URL for a transaction
 */
export const getExplorerUrl = (
  txid: string,
  explorer: SolanaExplorer = JUPITER_CONFIG.defaultExplorer
): string => {
  const network = getNetwork();
  const networkParam = network === 'mainnet-beta' ? '' : `?cluster=${network}`;

  switch (explorer) {
    case 'Solscan':
      return `https://solscan.io/tx/${txid}${networkParam}`;
    case 'Solana Explorer':
      return `https://explorer.solana.com/tx/${txid}${networkParam}`;
    case 'Solana FM':
      return `https://solana.fm/tx/${txid}${networkParam}`;
    default:
      return `https://solscan.io/tx/${txid}${networkParam}`;
  }
};
