import { useState } from 'react';
import Logo from './Logo';
import icon from '../../public/logo.svg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { href: '#dashboard', label: 'dashboard' },
    { href: '#swap', label: 'swap' },
    { href: '#simule', label: 'simule' },
    { href: '#top-position', label: 'top position' },
    { href: '#rebalance', label: 'rebalance' },
  ];

  return (
    <header className="fixed left-1/2 top-4 z-50 w-[95%] max-w-[800px] -translate-x-1/2">
      <div className="relative w-full overflow-visible rounded-full bg-white/5 px-3 py-3 shadow-md backdrop-blur-lg sm:px-6 sm:py-4">
        {/* Metallic top edge */}
        <div className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-forge-steel/50 to-transparent" />

        {/* Holographic accent line */}
        <div className="absolute left-0 top-[2px] h-[1px] w-full rounded-full bg-gradient-to-r from-transparent via-solana-purple/40 to-transparent" />

        <div className="relative flex items-center justify-between lg:grid lg:grid-cols-3">
          {/* Logo - Left side */}
          <div className="flex items-center gap-1">
            <Logo
              src={icon}
              alt="Brokk Logo"
              width={20}
              height={20}
              className="brightness-0 invert"
            />
            <a href="#home" className="group relative whitespace-nowrap">
              <div className="relative z-10 flex flex-col text-[8px] font-bold uppercase leading-none tracking-wider text-gray-300">
                <span className="relative z-10">BROKK</span>
                <span className="relative z-10">POOLS</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation - Center */}
          <nav className="hidden items-center justify-center gap-4 lg:flex xl:gap-6">
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

          {/* Mobile Menu Button - Right side */}
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
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="group relative rounded-xl px-4 py-3 text-sm font-medium uppercase tracking-wider text-gray-300 blur-none transition-all duration-300 hover:bg-white/10 hover:text-gray-100"
                >
                  <span className="relative z-10">{item.label}</span>
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
