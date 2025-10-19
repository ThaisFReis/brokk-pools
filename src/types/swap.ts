// src/types/swap.ts
// TypeScript interfaces and types for Token Swap Interface with Jupiter Terminal

import { PublicKey } from '@solana/web3.js';

/**
 * Solana SPL Token representation
 * Used for display and validation
 */
export interface Token {
  /** Token mint address */
  address: string;

  /** Token symbol (e.g., "SOL", "USDC") */
  symbol: string;

  /** Token full name */
  name: string;

  /** Token logo URL */
  logoURI: string;

  /** Decimal precision (usually 6 or 9) */
  decimals: number;

  /** User's current balance in base units */
  balance?: string;

  /** User's balance in UI units (balance / 10^decimals) */
  balanceUI?: number;

  /** Verified token (from Jupiter strict list) */
  verified: boolean;

  /** Tags (e.g., ["stablecoin", "wrapped"]) */
  tags?: string[];
}

/**
 * Swap quote from Jupiter
 * Returned by Jupiter's quote API
 */
export interface SwapQuote {
  /** Input token mint */
  inputMint: string;

  /** Output token mint */
  outputMint: string;

  /** Input amount in base units */
  inAmount: string;

  /** Estimated output amount in base units */
  outAmount: string;

  /** Minimum output amount (after slippage) */
  outAmountMin: string;

  /** Price impact percentage (0-100) */
  priceImpactPct: number;

  /** Exchange rate (outAmount / inAmount) */
  rate: number;

  /** Swap route (DEXs used) */
  route: SwapRoute[];

  /** Fee breakdown */
  fees: SwapFees;

  /** Quote expiration timestamp */
  expiresAt: number;

  /** Quote ID (for tracking) */
  quoteId: string;
}

/**
 * Single hop in swap route
 */
export interface SwapRoute {
  /** DEX name (e.g., "Orca", "Raydium") */
  dex: string;

  /** Input token for this hop */
  inputMint: string;

  /** Output token for this hop */
  outputMint: string;

  /** Amount routed through this hop */
  percent: number;
}

/**
 * Fee breakdown for swap
 */
export interface SwapFees {
  /** Network fee (SOL) in lamports */
  networkFee: string;

  /** Protocol fee (if any) in output token */
  protocolFee?: string;

  /** Platform fee (if configured) in output token */
  platformFee?: string;

  /** Total fees in USD (estimated) */
  totalUSD?: number;
}

/**
 * Swap transaction record
 * Created when user initiates swap
 */
export interface SwapTransaction {
  /** Transaction signature */
  txid: string;

  /** Transaction status */
  status: TransactionStatus;

  /** Input token */
  inputToken: Token;

  /** Output token */
  outputToken: Token;

  /** Input amount (UI units) */
  inputAmount: number;

  /** Output amount (UI units) */
  outputAmount: number;

  /** Timestamp (milliseconds) */
  timestamp: number;

  /** Block height (when confirmed) */
  blockHeight?: number;

  /** Error message (if failed) */
  error?: string;

  /** Explorer URL */
  explorerUrl: string;
}

/**
 * Transaction status enum
 */
export enum TransactionStatus {
  /** Awaiting wallet approval */
  PENDING_APPROVAL = 'pending_approval',

  /** Submitted to network */
  PENDING = 'pending',

  /** Confirming (waiting for finality) */
  CONFIRMING = 'confirming',

  /** Successfully confirmed */
  CONFIRMED = 'confirmed',

  /** Failed (network error, slippage exceeded, etc.) */
  FAILED = 'failed',

  /** User rejected */
  REJECTED = 'rejected',
}

/**
 * Slippage tolerance configuration
 * Used in P2 custom slippage modal
 */
export interface SlippageSettings {
  /** Slippage in basis points (50 = 0.5%) */
  slippageBps: number;

  /** Slippage percentage (for UI display) */
  slippagePercent: number;

  /** Preset or custom */
  type: 'preset' | 'custom';

  /** Warning threshold (triggers alert if exceeded) */
  warningThresholdBps: number;
}

/**
 * Swap result from Jupiter onSuccess callback
 */
export interface SwapResult {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  txid: string;
}

/**
 * Jupiter form state
 */
export interface JupiterFormState {
  inputMint: string | null;
  outputMint: string | null;
  amount: string;
}

/**
 * Props for JupiterTerminalWrapper component
 * Wraps Jupiter Terminal with Brokkr theming
 */
export interface JupiterTerminalWrapperProps {
  /** Custom className for container */
  className?: string;

  /** Initial input token (optional) */
  initialInputMint?: string;

  /** Initial output token (optional) */
  initialOutputMint?: string;

  /** Initial amount (optional) */
  initialAmount?: string;

  /** Custom slippage (P2 feature) */
  customSlippageBps?: number;

  /** Callback: swap success */
  onSwapSuccess?: (txid: string, result: SwapResult) => void;

  /** Callback: swap error */
  onSwapError?: (error: Error) => void;

  /** Callback: form update */
  onFormUpdate?: (form: JupiterFormState) => void;
}

/**
 * Props for SwapSuccessAnimation component
 * Triggers confetti on swap success
 */
export interface SwapSuccessAnimationProps {
  /** Transaction ID (triggers animation when set) */
  txid: string | null;

  /** Callback: animation complete */
  onComplete?: () => void;

  /** Custom confetti colors (defaults to Solana palette) */
  colors?: string[];

  /** Particle count (default: 100) */
  particleCount?: number;

  /** Animation duration (default: 3000ms) */
  duration?: number;
}

/**
 * Props for SwapTooltips component
 * Educational tooltips overlaid on Jupiter UI
 */
export interface SwapTooltipsProps {
  /** Enable/disable tooltips */
  enabled: boolean;

  /** Dismissed tooltip IDs */
  dismissedTooltips: string[];

  /** Callback: tooltip dismissed */
  onDismiss: (tooltipId: string) => void;
}

/**
 * Individual tooltip configuration
 */
export interface TooltipConfig {
  /** Unique ID */
  id: string;

  /** Target element selector */
  targetSelector: string;

  /** Tooltip title */
  title: string;

  /** Tooltip description */
  description: string;

  /** Position relative to target */
  position: 'top' | 'bottom' | 'left' | 'right';

  /** Show arrow */
  arrow: boolean;

  /** Auto-hide after X seconds (0 = manual dismiss only) */
  autoHideAfter?: number;
}

/**
 * Global swap state (Zustand)
 * Persisted to localStorage
 */
export interface SwapStoreState {
  // Tutorial state
  tooltipsEnabled: boolean;
  dismissedTooltips: string[];

  // P2: Custom slippage preferences
  customSlippageBps: number;
  lastUsedSlippageBps: number;

  // Optional: Recent swaps (for UI enhancement)
  recentSwaps: SwapTransaction[];
  maxRecentSwaps: number;

  // Actions
  setTooltipsEnabled: (enabled: boolean) => void;
  dismissTooltip: (id: string) => void;
  setCustomSlippageBps: (bps: number) => void;
  addSwapRecord: (transaction: SwapTransaction) => void;
  clearRecentSwaps: () => void;
}

/**
 * Type definitions for Jupiter Terminal callbacks
 */
export type JupiterOnSuccess = (
  txid: string,
  swapResult: SwapResult
) => void;

export type JupiterOnSwapError = (error: JupiterSwapError) => void;

export type JupiterOnFormUpdate = (form: JupiterFormState) => void;

export type JupiterOnScreenUpdate = (screen: JupiterScreen) => void;

/**
 * Jupiter error types
 */
export interface JupiterSwapError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Jupiter screen states
 */
export type JupiterScreen =
  | 'Initial'
  | 'Confirming'
  | 'Confirmed'
  | 'Error';

/**
 * Price impact severity levels
 * Used for color-coding
 */
export enum PriceImpactLevel {
  LOW = 'low',       // <1% (green)
  MEDIUM = 'medium', // 1-3% (yellow)
  HIGH = 'high',     // >3% (red)
}

/**
 * Swap direction (for flip button)
 */
export type SwapDirection = 'normal' | 'reversed';

/**
 * Explorer types
 */
export type SolanaExplorer = 'Solscan' | 'Solana Explorer' | 'Solana FM';

/**
 * RPC endpoint configuration
 */
export interface RPCConfig {
  endpoint: string;
  wsEndpoint?: string;
  commitment?: 'processed' | 'confirmed' | 'finalized';
}

/**
 * Type guard: check if string is valid Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return address.length === 44;
  } catch {
    return false;
  }
}

/**
 * Type guard: check if price impact is high
 */
export function isHighPriceImpact(impactPct: number): boolean {
  return impactPct > 3;
}

/**
 * Type guard: check if slippage is risky
 */
export function isRiskySlippage(slippageBps: number): boolean {
  return slippageBps > 500; // >5%
}

/**
 * Get price impact level
 */
export function getPriceImpactLevel(impactPct: number): PriceImpactLevel {
  if (impactPct < 1) return PriceImpactLevel.LOW;
  if (impactPct < 3) return PriceImpactLevel.MEDIUM;
  return PriceImpactLevel.HIGH;
}

/**
 * Default configuration constants
 */
export const SWAP_DEFAULTS = {
  // Slippage
  DEFAULT_SLIPPAGE_BPS: 50, // 0.5%
  MIN_SLIPPAGE_BPS: 1,      // 0.01%
  MAX_SLIPPAGE_BPS: 10000,  // 100%
  WARNING_SLIPPAGE_BPS: 500, // 5%

  // Preset slippage options
  SLIPPAGE_PRESETS: [10, 50, 100], // 0.1%, 0.5%, 1%

  // UI
  MAX_RECENT_SWAPS: 10,
  QUOTE_REFRESH_INTERVAL: 15000, // 15s
  CONFETTI_DURATION: 3000, // 3s

  // RPC
  DEFAULT_RPC_ENDPOINT: 'https://api.mainnet-beta.solana.com',
  RPC_COMMITMENT: 'confirmed' as const,

  // Explorers
  DEFAULT_EXPLORER: 'Solscan' as SolanaExplorer,
} as const;
