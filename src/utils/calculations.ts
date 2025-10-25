/**
 * Financial Calculation Utilities
 * Feature: Brokkr Finance Main Dashboard
 * All calculations follow the data model specifications
 */

import type { Position, InitialAssets, SummaryMetrics } from '../types/dashboard';

/**
 * Calculates the hypothetical HODL value if tokens were held separately
 * Formula: (initialTokenA * currentPriceA) + (initialTokenB * currentPriceB)
 *
 * @param initialAssets - Initial token amounts at position creation
 * @param tokenPair - Token pair with current prices
 * @param currentPriceA - Current price of token A in USD
 * @param currentPriceB - Current price of token B in USD
 * @returns HODL value in USD
 *
 * @example
 * const initial = { tokenAAmount: 10, tokenBAmount: 100, timestamp: '2024-01-01' };
 * const hodlValue = calculateHODLValue(initial, 150, 1); // 10 * 150 + 100 * 1 = 1600
 */
export function calculateHODLValue(
  initialAssets: InitialAssets,
  currentPriceA: number,
  currentPriceB: number
): number {
  return initialAssets.tokenAAmount * currentPriceA + initialAssets.tokenBAmount * currentPriceB;
}

/**
 * Calculates Profit/Loss (PnL) for a liquidity position
 * Formula: currentLPValue - currentHODLValue
 *
 * Positive PnL: LP position is more valuable than holding tokens separately
 * Negative PnL: Holding tokens separately would have been better (impermanent loss)
 *
 * @param position - The liquidity position
 * @param currentPriceA - Current price of token A in USD
 * @param currentPriceB - Current price of token B in USD
 * @returns PnL in USD (positive = profit, negative = loss)
 *
 * @example
 * // Position with current value $1700, HODL value would be $1600
 * // PnL = 1700 - 1600 = +$100 (profit)
 */
export function calculatePnL(
  position: Position,
  currentPriceA: number,
  currentPriceB: number
): number {
  const currentLPValue = position.pooledAssets.totalValueUSD;
  const hodlValue = calculateHODLValue(position.initialAssets, currentPriceA, currentPriceB);

  return currentLPValue - hodlValue;
}

/**
 * Calculates Impermanent Loss (IL) for a liquidity position
 * IL is the same as PnL in our model: difference between LP value and HODL value
 * Formula: currentLPValue - currentHODLValue
 *
 * Negative IL: Loss compared to holding tokens separately
 * Positive IL: Gain compared to holding tokens separately (rare, usually from fees)
 *
 * @param position - The liquidity position
 * @param currentPriceA - Current price of token A in USD
 * @param currentPriceB - Current price of token B in USD
 * @returns IL in USD (negative = impermanent loss, positive = impermanent gain)
 */
export function calculateImpermanentLoss(
  position: Position,
  currentPriceA: number,
  currentPriceB: number
): number {
  // IL is the same calculation as PnL per the clarifications
  return calculatePnL(position, currentPriceA, currentPriceB);
}

/**
 * Calculates Return on Investment (ROI) percentage
 * Formula: ((currentValue - initialValue) / initialValue) * 100
 *
 * @param currentValueUSD - Current total value in USD
 * @param initialValueUSD - Initial investment value in USD
 * @returns ROI as a percentage (e.g., 12.5 for 12.5%)
 *
 * @example
 * calculateROI(1100, 1000) // 10% (gained $100 on $1000 investment)
 * calculateROI(900, 1000) // -10% (lost $100 on $1000 investment)
 * calculateROI(2000, 1000) // 100% (doubled the investment)
 */
export function calculateROI(currentValueUSD: number, initialValueUSD: number): number {
  if (initialValueUSD === 0) {
    return 0;
  }

  return ((currentValueUSD - initialValueUSD) / initialValueUSD) * 100;
}

/**
 * Calculates aggregated metrics across all positions for summary cards
 *
 * @param positions - Array of all positions
 * @returns SummaryMetrics object with portfolio-level aggregations
 *
 * @example
 * const positions = [position1, position2, position3];
 * const summary = calculateAggregatedMetrics(positions);
 * // summary.totalAssetsValue = sum of all position values
 * // summary.totalPnL = sum of all position PnLs
 * // summary.positionsInRange = count of in-range positions
 */
export function calculateAggregatedMetrics(positions: Position[]): SummaryMetrics {
  // Handle empty positions array
  if (positions.length === 0) {
    return {
      totalAssetsValue: 0,
      totalPnL: 0,
      totalUncollectedFees: 0,
      positionCount: 0,
      positionsInRange: 0,
      positionsOutOfRange: 0,
    };
  }

  console.log(positions);
  const results = positions.map((item) => item.analytics.variables);


  const asset = results.reduce((sum, pos) => sum + pos.V_pos.value, 0);
  console.log(asset);

  // Aggregate values
  const totalAssetsValue = results.reduce((sum, pos) => sum + pos.V_pos.value, 0);

  const totalPnL = results.reduce((sum, pos) => sum + pos.PnL.value, 0);
  
  const totalUncollectedFees = results.reduce((sum, pos) => sum + pos.F_uncol.value, 0);

  const positionsInRange = 100; //positions.filter((pos) => pos.status.inRange).length;

  const positionsOutOfRange = 100; //positions.filter((pos) => !pos.status.inRange).length;

  return {
    totalAssetsValue,
    totalPnL,
    totalUncollectedFees,
    positionCount: positions.length,
    positionsInRange,
    positionsOutOfRange,
  };
}
