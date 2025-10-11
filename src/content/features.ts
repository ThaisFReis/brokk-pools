import { Feature } from '../types/Feature';

export const features: Feature[] = [
  {
    id: 'discover-pools',
    title: 'Discover Pools',
    description:
      'Explore all Orca liquidity pools with real-time analytics, performance metrics, and historical data visualization.',
    icon: 'analytics',
    order: 1,
  },
  {
    id: 'your-dashboard',
    title: 'Your Dashboard',
    description:
      'Track your positions, monitor yields, and calculate impermanent loss with precision-forged analytics.',
    icon: 'security',
    order: 2,
  },
  {
    id: 'top-positions',
    title: 'Top Positions',
    description:
      'Discover the highest-performing positions and learn from the masters of DeFi liquidity provision.',
    icon: 'yields',
    order: 3,
  },
];
