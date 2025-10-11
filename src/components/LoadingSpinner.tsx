function LoadingSpinner() {
  return (
    <div className="flex h-96 w-full items-center justify-center">
      <div className="relative h-20 w-20">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-solana-purple/20 border-t-solana-purple"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-br from-solana-purple to-solana-green opacity-20"></div>

        {/* Center glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-solana-green shadow-[0_0_20px_rgba(20,241,149,0.8)]"></div>
        </div>
      </div>

      <p className="absolute mt-32 text-sm text-gray-400">Loading 3D Scene...</p>
    </div>
  );
}

export default LoadingSpinner;
