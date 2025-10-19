/**
 * Top Positions Page
 * Global leaderboard showing all miners ranked by hashrate
 * Similar to "Open Positions" concept - shows the full ranking table
 */

import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Star, TrendingUp, Hash, Zap, Trophy, Medal, Award } from 'lucide-react';
import { loadMockRankingData } from '../utils/mockRankingData';
import { calculateRankings, formatHashrate, formatNetworkShare } from '../utils/ranking';
import type { MiningRankingData } from '../types/dashboard';

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
  const filteredMiners = rankedMiners.filter(miner => {
    const matchesSearch = miner.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterTopTen || miner.isTopTen;
    return matchesSearch && matchesFilter;
  });

  // Get medal icon for top 3
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading rankings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-purple-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              Top Positions
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Global mining leaderboard - {rankedMiners.length} active miners
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Network Hashrate</p>
                <p className="text-2xl font-bold text-white">
                  {rankingData && formatHashrate(rankingData.totalNetworkHashrate).value.toFixed(2)}{' '}
                  {rankingData && formatHashrate(rankingData.totalNetworkHashrate).unit}
                </p>
              </div>
              <Hash className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Miners</p>
                <p className="text-2xl font-bold text-white">
                  {rankedMiners.length.toLocaleString()}
                </p>
              </div>
              <Zap className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Elite Miners (Top 10)</p>
                <p className="text-2xl font-bold text-yellow-400">10</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by wallet address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setFilterTopTen(!filterTopTen)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                filterTopTen
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {filterTopTen ? '⭐ Top 10 Only' : 'Show All'}
            </button>
          </div>
        </div>

        {/* Ranking Table */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-400">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-5 md:col-span-4">Address</div>
              <div className="col-span-3 md:col-span-3 text-right">Hashrate</div>
              <div className="col-span-3 md:col-span-3 text-right">Network Share</div>
              <div className="hidden md:block md:col-span-1 text-center">Status</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-700 max-h-[600px] overflow-y-auto">
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
                    className={`px-6 py-4 hover:bg-gray-700/50 transition-colors ${
                      miner.isCurrentUser ? 'bg-purple-900/20 border-l-4 border-purple-500' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Rank */}
                      <div className="col-span-1 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {getMedalIcon(miner.rank)}
                          <span
                            className={`font-bold ${
                              miner.rank <= 3
                                ? 'text-yellow-400 text-lg'
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
                            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                          )}
                          <span
                            className={`font-mono ${
                              miner.isCurrentUser ? 'text-purple-300 font-semibold' : 'text-gray-300'
                            }`}
                          >
                            {formatAddress(miner.address)}
                          </span>
                          {miner.isCurrentUser && (
                            <span className="px-2 py-0.5 bg-purple-600 text-xs rounded-full">
                              You
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hashrate */}
                      <div className="col-span-3 md:col-span-3 text-right">
                        <span className="font-semibold text-white">
                          {hashrateFormatted.value.toFixed(2)} {hashrateFormatted.unit}
                        </span>
                      </div>

                      {/* Network Share */}
                      <div className="col-span-3 md:col-span-3 text-right">
                        <span className="text-gray-300">{networkShareFormatted}</span>
                      </div>

                      {/* Status Badge (Desktop only) */}
                      <div className="hidden md:flex md:col-span-1 justify-center">
                        {miner.isTopTen && (
                          <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-xs font-medium text-yellow-300">
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
            <Star className="w-4 h-4 text-yellow-400 inline" fill="currentColor" /> badges
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopPositions;
