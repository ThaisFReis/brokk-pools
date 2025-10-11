const Header = () => {
  return (
    <header className="fixed left-1/2 top-4 z-50 w-[800px] -translate-x-1/2 overflow-hidden rounded-full bg-white/5 shadow-md backdrop-blur-xl">
      <div className="relative w-full px-6 py-4">
        {/* Metallic top edge */}
        <div className="absolute left-0 top-0 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-forge-steel/50 to-transparent" />

        {/* Holographic accent line */}
        <div className="absolute left-0 top-[2px] h-[1px] w-full rounded-full bg-gradient-to-r from-transparent via-solana-purple/40 to-transparent" />

        <nav className="relative flex items-center justify-center gap-12">
          <a
            href="#home"
            className="group relative text-sm font-medium uppercase tracking-wider text-gray-300 hover:text-gray-100 transition-all duration-300"
          >
            <span className="relative z-10">HOME</span>
            <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-solana-purple/20 to-solana-purple/30 transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#discover"
            className="group relative text-sm font-medium uppercase tracking-wider text-gray-300 hover:text-gray-100 transition-all duration-300"
          >
            <span className="relative z-10">DISCOVER</span>
            <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-solana-purple/20 to-solana-purple/30 transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#dashboard"
            className="group relative text-sm font-medium uppercase tracking-wider text-gray-300 hover:text-gray-100 transition-all duration-300"
          >
            <span className="relative z-10">DASHBOARD</span>
            <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-solana-purple/20 to-solana-purple/30 transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#positions"
            className="group relative text-sm font-medium uppercase tracking-wider text-gray-300 hover:text-gray-100 transition-all duration-300"
          >
            <span className="relative z-10">TOP POSITIONS</span>
            <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-solana-purple/20 to-solana-purple/30 transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#leding"
            className="group relative text-sm font-medium uppercase tracking-wider text-gray-300 hover:text-gray-100 transition-all duration-300"
          >
            <span className="relative z-10">LEDING</span>
            <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-solana-purple/20 to-solana-purple/30 transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#points"
            className="group relative text-sm font-medium uppercase tracking-wider text-gray-300 hover:text-gray-100 transition-all duration-300"
          >
            <span className="relative z-10">POINTS</span>
            <div className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-solana-purple/20 to-solana-purple/30 transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
