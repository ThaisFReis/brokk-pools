import { useEffect } from 'react';

// WebGL detection utility
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Holographic Analytics Mockup
function HolographicMockup() {
  return (
    <div className="flex h-[300px] sm:h-[400px] md:h-[500px] w-full items-center justify-center">
      <svg
        viewBox="0 0 800 500"
        className="h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="purpleGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9945FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9945FF" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="greenGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#14F195" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#14F195" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="emberGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF4500" stopOpacity="0.2" />
          </linearGradient>
          <filter id="hologramGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background grid - holographic projection */}
        <g opacity="0.15">
          {[...Array(20)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 25}
              x2="800"
              y2={i * 25}
              stroke="#9945FF"
              strokeWidth="0.5"
            />
          ))}
          {[...Array(32)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 25}
              y1="0"
              x2={i * 25}
              y2="500"
              stroke="#9945FF"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Animated bar chart - TVL Analytics */}
        <g transform="translate(50, 300)" filter="url(#hologramGlow)">
          <text x="0" y="-180" fill="#14F195" fontSize="12" opacity="0.8">TVL ANALYTICS</text>
          {[
            { x: 0, height: 120, color: 'url(#purpleGlow)' },
            { x: 40, height: 150, color: 'url(#greenGlow)' },
            { x: 80, height: 90, color: 'url(#purpleGlow)' },
            { x: 120, height: 170, color: 'url(#emberGlow)' },
            { x: 160, height: 130, color: 'url(#greenGlow)' },
          ].map((bar, i) => (
            <rect
              key={i}
              x={bar.x}
              y={-bar.height}
              width="30"
              height={bar.height}
              fill={bar.color}
              opacity="0.7"
            >
              <animate
                attributeName="height"
                values={`${bar.height};${bar.height + 20};${bar.height}`}
                dur="3s"
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              />
              <animate
                attributeName="y"
                values={`${-bar.height};${-bar.height - 20};${-bar.height}`}
                dur="3s"
                repeatCount="indefinite"
                begin={`${i * 0.3}s`}
              />
            </rect>
          ))}
        </g>

        {/* Circular pool performance gauge */}
        <g transform="translate(400, 250)" filter="url(#hologramGlow)">
          <text x="-50" y="-150" fill="#9945FF" fontSize="12" opacity="0.8">POOL PERFORMANCE</text>
          <circle cx="0" cy="0" r="100" fill="none" stroke="#2a2a2a" strokeWidth="20" opacity="0.3"/>
          <circle
            cx="0"
            cy="0"
            r="100"
            fill="none"
            stroke="url(#greenGlow)"
            strokeWidth="20"
            strokeDasharray="440"
            strokeDashoffset="110"
            transform="rotate(-90)"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="440;110;440"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
          <text x="-30" y="10" fill="#14F195" fontSize="32" fontWeight="bold">75%</text>
          <text x="-20" y="30" fill="#9945FF" fontSize="10" opacity="0.6">APY</text>
        </g>

        {/* Line chart - Price action */}
        <g transform="translate(500, 100)" filter="url(#hologramGlow)">
          <text x="0" y="-20" fill="#FF6B35" fontSize="12" opacity="0.8">PRICE MOVEMENT</text>
          <path
            d="M 0 80 L 30 60 L 60 70 L 90 40 L 120 50 L 150 30 L 180 35"
            fill="none"
            stroke="url(#emberGlow)"
            strokeWidth="3"
            opacity="0.8"
          >
            <animate
              attributeName="d"
              values="M 0 80 L 30 60 L 60 70 L 90 40 L 120 50 L 150 30 L 180 35;M 0 80 L 30 65 L 60 60 L 90 45 L 120 40 L 150 25 L 180 30;M 0 80 L 30 60 L 60 70 L 90 40 L 120 50 L 150 30 L 180 35"
              dur="5s"
              repeatCount="indefinite"
            />
          </path>
          {[0, 30, 60, 90, 120, 150, 180].map((x, i) => (
            <circle key={i} cx={x} cy="50" r="3" fill="#FF6B35">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2s"
                repeatCount="indefinite"
                begin={`${i * 0.2}s`}
              />
            </circle>
          ))}
        </g>

        {/* Data stream particles */}
        {[...Array(15)].map((_, i) => {
          const x = Math.random() * 800;
          const delay = Math.random() * 5;
          return (
            <circle
              key={`particle-${i}`}
              cx={x}
              cy="0"
              r="2"
              fill={i % 3 === 0 ? '#9945FF' : i % 3 === 1 ? '#14F195' : '#FF6B35'}
              opacity="0.6"
            >
              <animate
                attributeName="cy"
                from="0"
                to="500"
                dur="8s"
                repeatCount="indefinite"
                begin={`${delay}s`}
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0"
                dur="8s"
                repeatCount="indefinite"
                begin={`${delay}s`}
              />
            </circle>
          );
        })}

        {/* Solana logo outline (simplified) */}
        <g transform="translate(680, 420)" opacity="0.3" filter="url(#hologramGlow)">
          <path
            d="M 0 0 L 30 -15 L 60 0 M 0 10 L 30 -5 L 60 10 M 0 20 L 30 5 L 60 20"
            stroke="url(#purpleGlow)"
            strokeWidth="2"
            fill="none"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      </svg>
    </div>
  );
}

function VisualShowcase() {
  useEffect(() => {
    isWebGLAvailable();
  }, []);

  return (
    <section
      id="visual-showcase"
      aria-labelledby="visual-title"
      className="relative w-full px-6 py-20 md:px-12 lg:py-32"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-solana-gray via-purple-900/10 to-solana-gray" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Section Title */}
        <h2
          id="visual-title"
          className="font-title mb-8 sm:mb-12 text-center text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-[0_0_25px_rgba(20,241,149,0.6)]"
        >
          Holographic Analytics
        </h2>

        {/* Description */}
        <p className="mb-8 sm:mb-12 text-center text-base sm:text-lg md:text-xl text-gray-400 px-4">
          Witness your portfolio forged into interactive holographic data streams — crafted by legendary dwarven algorithms.
        </p>

        {/* 3D Scene or Fallback */}
        <div className="relative overflow-hidden rounded-lg border border-forge-steel/40 bg-gradient-to-br from-forge-metaldark/90 to-forge-deepblack/80 p-4 sm:p-6 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_50px_rgba(153,69,255,0.4),inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl">
          {/* Metallic top edge */}
          <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-forge-steel/40 to-transparent" />

          {/* Holographic accent line */}
          <div className="absolute left-0 top-[2px] h-[1px] w-full bg-gradient-to-r from-transparent via-solana-purple/70 to-transparent" />

          {/* Forge corner glow effects */}
          <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-solana-purple/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-40 w-40 animate-ember-flicker rounded-full bg-forge-ember/20 blur-3xl" />

          <div className="relative flex items-center justify-center">
            <HolographicMockup />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-solana-green/5 blur-3xl" />
      <div className="absolute right-10 top-10 h-64 w-64 rounded-full bg-solana-purple/5 blur-3xl" />
    </section>
  );
}

export default VisualShowcase;
