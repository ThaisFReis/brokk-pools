import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import Logo from './Logo';
import icon from '../../public/logo.svg';
import { TopPosition } from './TopPosition';
import { useRanking } from '../hooks/useRanking';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();

  // Load ranking data
  const { userRanking, loading, error, refetch } = useRanking(publicKey?.toString());

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Redirect to dashboard when wallet connects (only from landing page)
  useEffect(() => {
    if (connected && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [connected, navigate, location.pathname]);

  //const menuItems = [
    //{ href: '/dashboard', label: 'dashboard' },
    //{ href: '/top-positions', label: 'top positions' },
    //{ href: '/swap', label: 'swap' },
    //   { href: '#simule', label: 'simule' },
    //   { href: '#rebalance', label: 'rebalance' },
  //];

  return (
    <header className="fixed left-1/2 top-4 z-50 w-full px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 -translate-x-1/2">
      <div className="relative w-full overflow-visible rounded-full bg-white/5 px-3 py-3 shadow-md shadow-solana-gray/30 backdrop-blur-lg sm:px-6 sm:py-4">
        {/* Metallic top edge */}
        <div className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-forge-steel/50 to-transparent" />

        {/* Holographic accent line */}
        <div className="absolute left-0 top-[2px] h-[1px] w-full rounded-full bg-gradient-to-r from-transparent via-solana-purple/40 to-transparent" />

        <div className="relative flex items-center justify-between">
          {/* Logo - Left side */}
          <a
            href="/"
            className="group flex items-center gap-1 transition-transform duration-500 hover:scale-110"
          >
            <Logo
              src={icon}
              alt="Brokk Logo"
              width={20}
              height={20}
              className="brightness-0 invert transition-transform duration-300 group-hover:rotate-12"
            />
            <div className="relative z-10 flex flex-col whitespace-nowrap font-title2 text-[8px] font-bold uppercase leading-none tracking-wider text-gray-300 transition-colors duration-300 group-hover:text-gray-100">
              <span className="relative z-10">BROKK</span>
              <span className="relative z-10">POOLS</span>
            </div>
          </a>

          {/* Desktop Navigation - Center */}

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-4 lg:flex xl:gap-6">
            {/*menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`group relative whitespace-nowrap text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                    isActive ? 'text-gray-100' : 'text-gray-300 hover:text-gray-100'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <div
                    className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-solana-purple/20 to-solana-purple/30 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </a>
              );
            })*/}
          </nav>

          {/* Wallet Button, Dashboard Button & Social Media & Mobile Menu - Right side */}
          <div className="ml-auto flex items-center gap-3">
            {/* Top Position Badge - Desktop (only when connected) */}
            {/*connected && (
              <div className="hidden lg:block">
                <TopPosition ranking={userRanking} loading={loading} error={error} onRetry={refetch} />
              </div>
            )*/}

            {/* Wallet Connect Button - Desktop */}
            {/*<div className="hidden lg:block">
              <WalletMultiButton />
            </div>*/}
            {/* Social Media Icons - Desktop */}
            <div className="hidden items-center gap-2 lg:flex">
              <a
                href="https://x.com/brokkpools"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-white/10"
                aria-label="Twitter"
              >
                <svg
                  className="h-4 w-4 text-gray-300 transition-colors duration-300 group-hover:text-gray-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://t.me/brokkpools"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-white/10"
                aria-label="Telegram"
              >
                <svg
                  className="h-4 w-4 text-gray-300 transition-colors duration-300 group-hover:text-gray-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 lg:hidden"
              aria-label="Toggle menu"
            >
              <span
                className={`block h-0.5 w-5 bg-gray-300 transition-all duration-300 ${
                  isMenuOpen ? 'translate-y-2 rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-gray-300 transition-all duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-gray-300 transition-all duration-300 ${
                  isMenuOpen ? '-translate-y-2 -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav
            className="absolute left-0 right-0 top-full mt-2 rounded-3xl bg-gradient-to-br from-forge-metaldark/50         to-forge-deepblack/30
        shadow-lg
        backdrop-blur-xl lg:hidden"
          >
            {/* Enhanced backdrop blur for mobile compatibility */}
            <div className="absolute inset-0 rounded-3xl backdrop-blur-xl" />
            <div className="relative z-10 flex flex-col gap-1 rounded-2xl p-4 backdrop-blur-xl ">
              {/*{menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="group relative rounded-xl px-4 py-3 text-sm font-medium uppercase tracking-wider text-gray-300 blur-none transition-all duration-300 hover:bg-white/10 hover:text-gray-100"
                >
                  <span className="relative z-10">{item.label}</span>
                </a>
              ))}
*/}
              {/* Top Position Badge - Mobile (only when connected) */}
              {connected && (
                <div className="flex justify-center">
                  <TopPosition ranking={userRanking} loading={loading} error={error} onRetry={refetch} />
                </div>
              )}

              {/* Dashboard Button - Mobile */}
              {/*<a
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="group relative rounded-xl bg-solana-purple px-4 py-3 text-center text-sm font-medium uppercase tracking-wider text-white transition-all duration-300 hover:bg-solana-purple/80"
              >
                <span className="relative z-10">Dashboard</span>
              </a>*/}

              {/* Wallet Connect Button - Mobile */}
             {/* <div className="flex justify-center">
                <WalletMultiButton className="!to-solana-pink !w-full !rounded-xl !bg-gradient-to-r !from-solana-purple !px-4 !py-3 !text-sm !font-medium !uppercase !tracking-wider !transition-all !duration-300 hover:!opacity-90" />
              </div>*/}

              {/* Social Media Icons - Mobile */}
              <div className="mt-2 flex items-center justify-center gap-3">
                <a
                  href="https://x.com/brokkpools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-white/10"
                  aria-label="X (Twitter)"
                >
                  <svg
                    className="h-5 w-5 text-gray-300 transition-colors duration-300 group-hover:text-gray-100"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://t.me/brokkpools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-white/10"
                  aria-label="Telegram"
                >
                  <svg
                    className="h-5 w-5 text-gray-300 transition-colors duration-300 group-hover:text-gray-100"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
