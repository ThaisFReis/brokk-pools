import { useState } from 'react';
import Logo from './Logo';
import icon from '../../public/logo.svg';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Temporariamente desativado
  // const menuItems = [
  //   { href: '#dashboard', label: 'dashboard' },
  //   { href: '#swap', label: 'swap' },
  //   { href: '#simule', label: 'simule' },
  //   { href: '#top-position', label: 'top position' },
  //   { href: '#rebalance', label: 'rebalance' },
  // ];

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[95%] max-w-[800px] -translate-x-1/2">
      <div className="relative w-full overflow-visible rounded-full bg-white/5 px-3 py-3 shadow-md backdrop-blur-lg sm:px-6 sm:py-4">
        {/* Metallic top edge */}
        <div className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-forge-steel/50 to-transparent" />

        {/* Holographic accent line */}
        <div className="absolute left-0 top-[2px] h-[1px] w-full rounded-full bg-gradient-to-r from-transparent via-solana-purple/40 to-transparent" />

        <div className="relative flex items-center justify-between">
          {/* Logo - Left side */}
          <div className="group flex items-center gap-1 transition-transform duration-500 hover:scale-110">
            <Logo
              src={icon}
              alt="Brokk Logo"
              width={20}
              height={20}
              className="brightness-0 invert transition-transform duration-300 group-hover:rotate-12"
            />
            <a href="#home" className="relative whitespace-nowrap font-title">
              <div className="relative z-10 flex flex-col text-[8px] font-bold uppercase leading-none tracking-wider text-gray-300 transition-colors duration-300 group-hover:text-gray-100">
                <span className="relative z-10">BROKK</span>
                <span className="relative z-10">POOLS</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation - Center */}
          {/* Temporariamente desativado
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-4 lg:flex xl:gap-6">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative whitespace-nowrap text-xs font-medium uppercase tracking-wider text-gray-300 transition-all duration-300 hover:text-gray-100"
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-solana-purple/20 to-solana-purple/30 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>
          */}

          {/* Social Media & Mobile Menu - Right side */}
          <div className="ml-auto flex items-center gap-3">
            {/* Social Media Icons - Desktop */}
            <div className="hidden items-center gap-2 lg:flex">
              <a
                href="https://twitter.com/brokkpools"
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
                href="https://discord.gg/brokkpools"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-white/10"
                aria-label="Discord"
              >
                <svg
                  className="h-4 w-4 text-gray-300 transition-colors duration-300 group-hover:text-gray-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
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
              {/* Social Media Icons - Mobile */}
              <div className="flex items-center justify-center gap-3">
                <a
                  href="https://twitter.com/brokkpools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-white/10"
                  aria-label="Twitter"
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
                  href="https://discord.gg/brokkpools"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all duration-300 hover:bg-white/10"
                  aria-label="Discord"
                >
                  <svg
                    className="h-5 w-5 text-gray-300 transition-colors duration-300 group-hover:text-gray-100"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
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
