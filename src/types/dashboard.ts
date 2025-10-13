/**
 * Dashboard Type Definitions
 * Feature: Brokkr Finance Main Dashboard
 * All types use TypeScript strict mode and enforce null safety
 */

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * Supported concentrated liquidity protocols on Solana
 */
export enum Protocol {
  Orca = 'Orca',
  Raydium = 'Raydium',
}

/**
 * Protocol metadata for display
 */
export interface ProtocolInfo {
  name: Protocol;
  displayName: string;
  logoURI: string;
}

/**
 * An SPL token with metadata
 */
export interface Token {
  /** Token symbol (e.g., "SOL", "USDC") */
  symbol: string;

  /** Token name (e.g., "Solana", "USD Coin") */
  name: string;

  /** Mint address on Solana */
  mint: string;

  /** Number of decimal places (e.g., 9 for SOL, 6 for USDC) */
  decimals: number;

  /** Optional: Token logo URL */
  logoURI?: string;
}

/**
 * A trading pair (e.g., SOL/USDC)
 */
export interface TokenPair {
  /** First token in the pair */
  tokenA: Token;

  /** Second token in the pair */
  tokenB: Token;

  /** Current exchange rate (tokenA per tokenB) */
  currentPrice: number;
}

/**
 * Price range for concentrated liquidity position
 */
export interface PriceRange {
  /** Minimum price boundary (lower tick) */
  min: number;

  /** Maximum price boundary (upper tick) */
  max: number;

  /** Current market price of the token pair */
  current: number;
}

/**
 * Status flags for a position
 */
export interface PositionStatus {
  /** True if current price is within the defined range */
  inRange: boolean;

  /** True if position has auto-compounding enabled */
  autoCompound: boolean;
}

/**
 * Current pooled assets in a position
 */
export interface PooledAssets {
  /** Amount of token A currently in the pool */
  tokenAAmount: number;

  /** Amount of token B currently in the pool */
  tokenBAmount: number;

  /** Total USD value of pooled assets (tokenA + tokenB) */
  totalValueUSD: number;
}

/**
 * Initial token amounts when position was created
 * Used to calculate HODL value and impermanent loss
 */
export interface InitialAssets {
  /** Initial amount of token A */
  tokenAAmount: number;

  /** Initial amount of token B */
  tokenBAmount: number;

  /** Timestamp when position was created (ISO 8601) */
  timestamp: string;
}

/**
 * Calculated performance metrics
 * PnL is calculated as: (current LP value) - (hypothetical HODL value)
 * where HODL value = current value if tokens were held separately
 */
export interface PositionMetrics {
  /** Total profit/loss (LP value vs HODL value) in USD */
  totalPnL: number;

  /** Return on Investment as a percentage (-100 to +Infinity) */
  roi: number;

  /** Impermanent Loss (IL = LP value - HODL value) in USD
   * Negative value means loss compared to holding
   */
  impermanentLoss: number;

  /** Total Annual Percentage Rate (fees + price appreciation) */
  totalAPR: number;

  /** Fee-only Annual Percentage Rate */
  feeAPR: number;

  /** Total gas costs incurred for this position (USD) */
  gasCosts: number;

  /** Net profit after fees and gas costs (USD) */
  netProfit: number;

  /** Position age in days */
  ageInDays: number;
}

/**
 * Fee metrics (earned and uncollected)
 */
export interface FeeMetrics {
  /** Total fees earned (lifetime, USD) */
  totalEarned: number;

  /** Uncollected fees (not yet claimed, USD) */
  uncollected: number;

  /** Daily fees (average over last 7 days, USD) */
  daily: number;

  /** Weekly fees (last 7 days total, USD) */
  weekly: number;

  /** Monthly fees (last 30 days total, USD) */
  monthly: number;
}

// ============================================================================
// HISTORICAL DATA
// ============================================================================

/**
 * Price data point (for price history chart)
 */
export interface PriceDataPoint {
  /** Unix timestamp (milliseconds) */
  timestamp: number;

  /** Price at this timestamp */
  price: number;
}

/**
 * Volume data point (for volume history chart)
 */
export interface VolumeDataPoint {
  /** Unix timestamp (milliseconds) */
  timestamp: number;

  /** Trading volume in USD */
  volume: number;
}

/**
 * Fee data point (for fee history tracking)
 */
export interface FeeDataPoint {
  /** Unix timestamp (milliseconds) */
  timestamp: number;

  /** Fees earned in USD */
  fees: number;
}

/**
 * Liquidity distribution data point (for liquidity histogram)
 */
export interface LiquidityDataPoint {
  /** Price bucket (range min) */
  price: number;

  /** Liquidity amount at this price level (USD) */
  liquidity: number;
}

/**
 * Historical data for visualization
 */
export interface HistoricalData {
  /** Price history for the token pair */
  prices: PriceDataPoint[];

  /** Trading volume history */
  volume: VolumeDataPoint[];

  /** Fee earnings history */
  fees: FeeDataPoint[];

  /** Liquidity distribution over price range */
  liquidityDistribution: LiquidityDataPoint[];
}

/**
 * A concentrated liquidity position on Solana (Orca Whirlpools or Raydium CLMM)
 */
export interface Position {
  /** Unique identifier for the position (on-chain position address) */
  id: string;

  /** Protocol where position is held */
  protocol: Protocol;

  /** Token pair for this position */
  tokenPair: TokenPair;

  /** Price range boundaries */
  priceRange: PriceRange;

  /** Current status indicators */
  status: PositionStatus;

  /** Pooled assets (current state) */
  pooledAssets: PooledAssets;

  /** Initial token amounts at position creation (for HODL value calculation) */
  initialAssets: InitialAssets;

  /** Calculated metrics */
  metrics: PositionMetrics;

  /** Fee-related metrics */
  fees: FeeMetrics;

  /** Historical data for charts */
  historicalData: HistoricalData;

  /** Position creation timestamp (ISO 8601) */
  createdAt: string;

  /** Last updated timestamp (ISO 8601) */
  updatedAt: string;
}

// ============================================================================
// AGGREGATED ENTITIES
// ============================================================================

/**
 * Connected Solana wallet
 */
export interface Wallet {
  /** Wallet public key (Solana address) */
  publicKey: string;

  /** Connection status */
  connected: boolean;

  /** Wallet adapter name (e.g., "Phantom", "Solflare") */
  adapterName: string;

  /** Optional: Shortened address for display (e.g., "Gk3f...xY2z") */
  displayAddress?: string;
}

/**
 * Aggregated portfolio metrics across all positions
 */
export interface SummaryMetrics {
  /** Total value of all pooled assets (USD) */
  totalAssetsValue: number;

  /** Aggregated profit/loss across all positions (USD) */
  totalPnL: number;

  /** Total uncollected fees across all positions (USD) */
  totalUncollectedFees: number;

  /** Number of positions */
  positionCount: number;

  /** Number of positions currently in range */
  positionsInRange: number;

  /** Number of positions currently out of range */
  positionsOutOfRange: number;
}

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Loading state for UI sections
 * Per-section loading allows summary and positions to load independently
 */
export interface LoadingState {
  /** Loading state for summary cards */
  summary: boolean;

  /** Loading state for position list */
  positions: boolean;

  /** Loading state for expanded position details */
  positionDetails: Record<string, boolean>; // keyed by position.id
}

/**
 * Error state for error handling
 */
export interface ErrorState {
  /** Whether an error occurred */
  hasError: boolean;

  /** Error message (user-friendly) */
  message: string;

  /** Optional: Error code for debugging */
  code?: string;

  /** Optional: Retry function */
  retry?: () => void;
}

/**
 * UI state for position expansion
 */
export interface PositionViewState {
  /** Map of position IDs to their expansion state */
  expanded: Record<string, boolean>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Sorting options for position list
 */
export enum SortField {
  TotalValue = 'totalValue',
  PnL = 'pnl',
  APR = 'apr',
  Fees = 'fees',
  Age = 'age',
}

export enum SortDirection {
  Ascending = 'asc',
  Descending = 'desc',
}

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

/**
 * Formatting options for displaying financial values
 */
export interface FormattingOptions {
  /** Currency symbol (default: '$') */
  currency?: string;

  /** Show positive sign for positive numbers */
  showPositiveSign?: boolean;

  /** Use compact notation (K, M) for large numbers */
  compact?: boolean;

  /** Minimum fraction digits (overrides defaults) */
  minimumFractionDigits?: number;

  /** Maximum fraction digits (overrides defaults) */
  maximumFractionDigits?: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Decimal precision constants
 */
export const DECIMALS = {
  /** USD values: 2 decimal places */
  USD: 2,

  /** Token amounts: up to 6 decimals, trailing zeros trimmed */
  TOKEN_MAX: 6,

  /** Percentages (APR, ROI): 2 decimal places */
  PERCENTAGE: 2,
} as const;

/**
 * Default values for optional fields
 */
export const DEFAULTS = {
  /** Default historical data range (days) */
  HISTORICAL_RANGE_DAYS: 30,

  /** Default chart time interval (hours) */
  CHART_INTERVAL_HOURS: 1,

  /** Virtualization threshold (number of positions) */
  VIRTUALIZATION_THRESHOLD: 20,

  /** Default sort configuration */
  DEFAULT_SORT: {
    field: SortField.TotalValue,
    direction: SortDirection.Descending,
  } as SortConfig,
} as const;

// ============================================================================
// VALIDATORS
// ============================================================================

/**
 * Validates that a position has all required fields
 */
export function isValidPosition(pos: unknown): pos is Position {
  const p = pos as Position;
  return (
    typeof p?.id === 'string' &&
    typeof p?.protocol === 'string' &&
    typeof p?.tokenPair === 'object' &&
    typeof p?.priceRange === 'object' &&
    typeof p?.status === 'object' &&
    typeof p?.pooledAssets === 'object' &&
    typeof p?.metrics === 'object' &&
    typeof p?.fees === 'object' &&
    typeof p?.historicalData === 'object' &&
    typeof p?.createdAt === 'string'
  );
}

/**
 * Validates that price is within valid range
 */
export function isPriceInRange(position: Position): boolean {
  const { min, max, current } = position.priceRange;
  return current >= min && current <= max;
}

/**
 * Validates that amounts are positive
 */
export function hasValidAmounts(pooled: PooledAssets): boolean {
  return pooled.tokenAAmount >= 0 && pooled.tokenBAmount >= 0 && pooled.totalValueUSD >= 0;
}
