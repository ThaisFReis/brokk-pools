/**
 * SummaryCards Component
 * Displays portfolio summary metrics in card format
 */

import type { SummaryMetrics } from '../../types/dashboard';
import { formatUSD } from '../../utils/formatters';

interface SummaryCardsProps {
  summary: SummaryMetrics | null;
  loading?: boolean;
}

interface SummaryCardProps {
  label: string;
  value: string;
  subtext?: string;
  valueColor?: string;
  loading?: boolean;
}

function SummaryCard({ label, value, subtext, valueColor, loading }: SummaryCardProps) {
  if (loading) {
    return (
      <article
        className="space-y-3 rounded-lg border border-forge-steel bg-forge-metaldark p-6"
        role="status"
        aria-label={`Loading ${label}`}
      >
        <div className="h-4 w-32 animate-pulse rounded bg-forge-steel" data-testid="skeleton" />
        <div className="h-8 w-full animate-pulse rounded bg-forge-steel" data-testid="skeleton" />
        {subtext && (
          <div className="h-3 w-24 animate-pulse rounded bg-forge-steel" data-testid="skeleton" />
        )}
      </article>
    );
  }

  return (
    <article
      className="space-y-2 rounded-lg bg-deep-gradient-transparent shadow-md shadow-solana-gray p-6 transition-colors hover:border-solana-purple/30 backdrop-blur-xl"
      aria-labelledby={`${label.replace(/\s+/g, '-')}-label`}
    >
      <div
        id={`${label.replace(/\s+/g, '-')}-label`}
        className="text-sm uppercase tracking-wide text-gray-400"
      >
        {label}
      </div>
      <div className={`text-3xl font-bold ${valueColor || 'text-white'}`}>{value}</div>
      {subtext && <div className="text-xs text-gray-500">{subtext}</div>}
    </article>
  );
}

export function SummaryCards({ summary, loading = false }: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <SummaryCard label="Total Assets" value="" loading />
        <SummaryCard label="Total PnL" value="" loading />
        <SummaryCard label="Uncollected Fees" value="" loading />
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const totalAssetsValue = formatUSD(summary.totalAssetsValue);

  const totalPnL = formatUSD(summary.totalPnL, { showPositiveSign: true });
  const pnlColor =
    summary.totalPnL > 0
      ? 'text-solana-green'
      : summary.totalPnL < 0
        ? 'text-red-500'
        : 'text-white';

  const uncollectedFees = formatUSD(summary.totalUncollectedFees);

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      <SummaryCard
        label="Total Assets"
        value={totalAssetsValue}
        subtext={`${summary.positionCount} positions`}
      />

      <SummaryCard
        label="Total PnL"
        value={totalPnL}
        valueColor={pnlColor}
        subtext={`${summary.positionsInRange} in range • ${summary.positionsOutOfRange} out of range`}
      />

      <SummaryCard label="Uncollected Fees" value={uncollectedFees} subtext="Available to claim" />
    </div>
  );
}
