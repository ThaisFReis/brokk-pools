/**
 * EmptyState Component
 * Displays message when no positions are found
 */

interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  const defaultMessage = 'No liquidity positions found';
  const displayMessage = message || defaultMessage;

  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-16"
      role="status"
      aria-label="Empty state"
    >
      {/* Icon */}
      <div
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-forge-metalgray"
        role="img"
        aria-hidden="true"
      >
        <svg
          className="h-12 w-12 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>

      {/* Message */}
      <h3 className="mb-2 text-xl font-semibold text-gray-400">{displayMessage}</h3>

      {/* Guidance */}
      <p className="mb-6 max-w-md text-center text-sm text-gray-500">
        Create your first concentrated liquidity position on Orca or Raydium to start tracking your
        portfolio.
      </p>

      {/* Call to Action */}
      <div className="flex gap-4">
        <a
          href="https://www.orca.so/pools"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-solana-purple px-6 py-3 font-medium text-white transition-colors hover:bg-solana-purple/80"
        >
          Create Position on Orca
        </a>
        <a
          href="https://raydium.io/clmm/pools"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-forge-steel bg-forge-metalgray px-6 py-3 font-medium text-white transition-colors hover:bg-forge-steel"
        >
          Create Position on Raydium
        </a>
      </div>
    </div>
  );
}
