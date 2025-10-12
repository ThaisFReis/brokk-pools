/**
 * PositionList Component
 * Renders a list of PositionCards with sorting and virtualization
 */

import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Position } from '../../types/dashboard';
import { PositionCard } from './PositionCard';

export interface PositionListProps {
  positions: Position[];
  loading?: boolean;
  onPositionClick?: (position: Position) => void;
}

// Skeleton loader for position cards
function PositionCardSkeleton() {
  return (
    <div
      data-testid="position-skeleton"
      className="animate-pulse rounded-xl border border-forge-steel bg-forge-metaldark p-4 md:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-32 rounded bg-forge-steel" />
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full bg-forge-steel" />
          <div className="h-6 w-24 rounded-full bg-forge-steel" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="h-12 rounded bg-forge-steel" />
        <div className="h-12 rounded bg-forge-steel" />
        <div className="h-12 rounded bg-forge-steel" />
        <div className="h-12 rounded bg-forge-steel" />
      </div>
      <div className="mt-4 h-8 rounded bg-forge-steel" />
    </div>
  );
}

export function PositionList({ positions, loading = false, onPositionClick }: PositionListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Sort positions by total value (descending)
  const sortedPositions = useMemo(() => {
    return [...positions].sort(
      (a, b) => b.pooledAssets.totalValueUSD - a.pooledAssets.totalValueUSD
    );
  }, [positions]);

  // Determine if virtualization should be used (>20 positions)
  const shouldVirtualize = sortedPositions.length > 20;

  // Setup virtualizer
  const virtualizer = useVirtualizer({
    count: sortedPositions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated height of each card in pixels
    overscan: 5, // Number of items to render outside of visible area
    enabled: shouldVirtualize,
  });

  // Loading state
  if (loading) {
    return (
      <div role="status" aria-live="polite" className="space-y-4">
        <span className="sr-only">Loading positions...</span>
        <PositionCardSkeleton />
        <PositionCardSkeleton />
        <PositionCardSkeleton />
      </div>
    );
  }

  // Empty state
  if (sortedPositions.length === 0) {
    return null; // EmptyState is handled at DashboardLayout level
  }

  // Render with virtualization (>20 positions)
  if (shouldVirtualize) {
    return (
      <div
        ref={parentRef}
        data-testid="position-list"
        data-virtualized="true"
        className="h-[800px] overflow-y-auto"
        style={{ overflowY: 'auto' }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const position = sortedPositions[virtualItem.index];
            return (
              <div
                key={position.id}
                data-index={virtualItem.index}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="pb-4">
                  <PositionCard
                    position={position}
                    onClick={onPositionClick ? () => onPositionClick(position) : undefined}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render without virtualization (<=20 positions)
  return (
    <div data-testid="position-list" data-virtualized="false" className="space-y-4">
      {sortedPositions.map((position) => (
        <PositionCard
          key={position.id}
          position={position}
          onClick={onPositionClick ? () => onPositionClick(position) : undefined}
        />
      ))}
    </div>
  );
}
