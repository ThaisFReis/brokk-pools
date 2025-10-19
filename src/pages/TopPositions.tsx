/**
 * Top Positions Page
 * Global leaderboard showing all miners ranked by hashrate
 * Similar to "Open Positions" concept - shows the full ranking table
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Star, TrendingUp, Trophy, Medal, Award } from 'lucide-react';
import { loadMockRankingData } from '../utils/mockRankingData';
import { calculateRankings, formatHashrate, formatNetworkShare } from '../utils/ranking';
import type { MiningRankingData } from '../types/dashboard';
import { SummaryCard } from '../components/dashboard/SummaryCards';
import CTAButton from '../components/CTAButton';

interface RankedMiner {
  rank: number;
  address: string;
  hashrate: number;
  networkShare: number;
  isTopTen: boolean;
  isCurrentUser?: boolean;
}

export const TopPositions: React.FC = () => {
  const { publicKey } = useWallet();
  const [rankingData, setRankingData] = useState<MiningRankingData | null>(null);
  const [rankedMiners, setRankedMiners] = useState<RankedMiner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTopTen, setFilterTopTen] = useState(false);

  // Load ranking data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadMockRankingData();
        setRankingData(data);

        // Calculate rankings for all miners
        const rankingsMap = calculateRankings(data.miners);

        // Sort miners by hashrate (descending) and create ranked list
        const sortedMiners = [...data.miners].sort((a, b) => b.hashrate - a.hashrate);

        const ranked: RankedMiner[] = sortedMiners.map((miner) => {
          const rank = rankingsMap.get(miner.address.toLowerCase()) || 0;
          return {
            rank,
            address: miner.address,
            hashrate: miner.hashrate,
            networkShare: (miner.hashrate / data.totalNetworkHashrate) * 100,
            isTopTen: rank <= 10,
            isCurrentUser: publicKey?.toString().toLowerCase() === miner.address.toLowerCase(),
          };
        });

        setRankedMiners(ranked);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load ranking data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setLoading(false);
      }
    };

    loadData();
  }, [publicKey]);

  // Filter miners based on search and top 10 filter
  const filteredMiners = rankedMiners.filter((miner) => {
    const matchesSearch = miner.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterTopTen || miner.isTopTen;
    return matchesSearch && matchesFilter;
  });

  // Get medal icon for top 3
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return null;
    }
  };

  // Format address for display
  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-purple-500"></div>
          <p className="text-gray-400">Loading rankings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <p className="mb-4 text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-purple-600 px-4 py-2 transition-colors hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Network Hashrate',
      value: 'Total Network Hashrate',
      subtext: `${rankingData && formatHashrate(rankingData.totalNetworkHashrate).value.toFixed(2)} ${rankingData && formatHashrate(rankingData.totalNetworkHashrate).unit}`,
    },
    {
      label: 'Active Miners',
      value: rankedMiners.length.toLocaleString(),
    },
    {
      label: 'Elite Miners (Top 10)',
      value: '10',
    },
  ];

  return (
    <div className="min-h-screen px-4 pb-12 pt-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <h1 className="bg-clip-text font-title text-2xl font-bold text-transparent text-white">
              Top Positions
            </h1>
          </div>
          <p className="text-lg text-gray-400">
            Global mining leaderboard - {rankedMiners.length} active miners
          </p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <SummaryCard label="Total Network Hashrate" value="" loading />
            <SummaryCard label="Active Miners" value="" loading />
            <SummaryCard label="Elite Miners (Top 10)" value="" loading />
          </div>
        ) : (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <SummaryCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                subtext={stat.subtext}
              />
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 rounded-lg bg-deep-gradient-transparent p-6 shadow-md shadow-solana-gray backdrop-blur-xl transition-colors hover:border-solana-purple/30">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by wallet address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg  bg-transparent px-4 py-2 text-white placeholder-gray-500 !shadow-[inset_0px_2px_3px_2px_rgba(6,6,6,0.4)] focus:outline-none focus:ring-1 focus:ring-purple-500 "
              />
            </div>
            <CTAButton
              onClick={() => setFilterTopTen(!filterTopTen)}
              text={filterTopTen ? 'Show All' : 'Top 10 Only'}
            />
          </div>
        </div>

        {/* Ranking Table */}
        <div className="overflow-hidden rounded-lg bg-deep-gradient-transparent shadow-inner-glow">
          {/* Table Header */}
          <div className="border-b border-solana-gray/40 px-6 py-4">
            <div className="grid grid-cols-12 gap-4 text-base font-semibold text-white">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5 md:col-span-4">Address</div>
              <div className="col-span-3 text-right md:col-span-3">Hashrate</div>
              <div className="col-span-3 text-right md:col-span-3">Network Share</div>
              <div className="hidden text-center md:col-span-1 md:block">Status</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="max-h-[600px] divide-y divide-solana-gray/40 overflow-y-auto">
            {filteredMiners.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No miners found matching your filters
              </div>
            ) : (
              filteredMiners.map((miner) => {
                const hashrateFormatted = formatHashrate(miner.hashrate);
                const networkShareFormatted = formatNetworkShare(miner.networkShare);

                return (
                  <div
                    key={miner.address}
                    className={`px-6 py-4 transition-colors hover:bg-forge-deepblack ${
                      miner.isCurrentUser ? 'border-l-4 border-purple-500 ' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 items-center gap-4">
                      {/* Rank */}
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getMedalIcon(miner.rank)}
                          <span
                            className={`font-bold ${
                              miner.rank <= 3
                                ? 'text-lg text-yellow-400'
                                : miner.isTopTen
                                  ? 'text-yellow-300'
                                  : 'text-gray-400'
                            }`}
                          >
                            #{miner.rank}
                          </span>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="col-span-5 md:col-span-4">
                        <div className="flex items-center gap-2">
                          {miner.isTopTen && (
                            <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                          )}
                          <span
                            className={`font-mono ${
                              miner.isCurrentUser
                                ? 'font-semibold text-purple-300'
                                : 'text-gray-300'
                            }`}
                          >
                            {formatAddress(miner.address)}
                          </span>
                          {miner.isCurrentUser && (
                            <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs">
                              You
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hashrate */}
                      <div className="col-span-3 text-right md:col-span-3">
                        <span className="font-semibold text-white">
                          {hashrateFormatted.value.toFixed(2)} {hashrateFormatted.unit}
                        </span>
                      </div>

                      {/* Network Share */}
                      <div className="col-span-3 text-right md:col-span-3">
                        <span className="text-gray-300">{networkShareFormatted}</span>
                      </div>

                      {/* Status Badge (Desktop only) */}
                      <div className="hidden justify-center md:col-span-1 md:flex">
                        {miner.isTopTen && (
                          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300">
                            Elite
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Rankings update every 30 seconds automatically</p>
          <p className="mt-1">
            Elite Miners (Top 10) are highlighted with{' '}
            <Star className="inline h-4 w-4 text-yellow-400" fill="currentColor" /> badges
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopPositions;
