/**
 * MetricsTable Component
 * Displays comprehensive metrics for a position
 */

import type { Position } from '../../types/dashboard';
import { formatUSD, formatPercentage } from '../../utils/formatters';

export interface MetricsTableProps {
  position: Position;
}

export function MetricsTable({ position }: MetricsTableProps) {
  const { metrics, fees } = position;

  const rows = [
    {
      label: 'Return on Investment (ROI)',
      value: formatPercentage(metrics.roi),
      valueColor:
        metrics.roi > 0 ? 'text-solana-green' : metrics.roi < 0 ? 'text-red-500' : 'text-white',
    },
    {
      label: 'Impermanent Loss',
      value: formatUSD(metrics.impermanentLoss, { showPositiveSign: true }),
      valueColor: metrics.impermanentLoss < 0 ? 'text-red-500' : 'text-solana-green',
    },
    {
      label: 'Total APR',
      value: formatPercentage(metrics.totalAPR),
      valueColor: 'text-white',
    },
    {
      label: 'Fee APR',
      value: formatPercentage(metrics.feeAPR),
      valueColor: 'text-white',
    },
    {
      label: 'Total Fees Earned',
      value: formatUSD(fees.totalEarned),
      valueColor: 'text-solana-green',
    },
    {
      label: 'Daily Fees (Avg)',
      value: formatUSD(fees.daily),
      valueColor: 'text-white',
    },
    {
      label: 'Weekly Fees (Avg)',
      value: formatUSD(fees.weekly),
      valueColor: 'text-white',
    },
    {
      label: 'Monthly Fees (Avg)',
      value: formatUSD(fees.monthly),
      valueColor: 'text-white',
    },
    {
      label: 'Gas Costs',
      value: formatUSD(metrics.gasCosts),
      valueColor: 'text-gray-400',
    },
    {
      label: 'Net Profit',
      value: formatUSD(metrics.netProfit, { showPositiveSign: true }),
      valueColor:
        metrics.netProfit > 0
          ? 'text-solana-green'
          : metrics.netProfit < 0
            ? 'text-red-500'
            : 'text-white',
    },
    {
      label: 'Position Age',
      value: `${metrics.ageInDays} days`,
      valueColor: 'text-white',
    },
  ];

  return (
    <div className="overflow-hidden rounded-lg bg-forge-metaldark shadow-inner-glow">
      <div className="border-b border-solana-gray/40 px-6 py-4">
        <h3 className="text-lg font-semibold text-white">Detailed Metrics</h3>
      </div>
      <div className="divide-y divide-solana-gray/40">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4 px-6 py-3 transition-colors hover:bg-forge-deepblack"
          >
            <div className="text-sm text-gray-400">{row.label}</div>
            <div className={`text-right text-sm font-semibold ${row.valueColor}`}>{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
