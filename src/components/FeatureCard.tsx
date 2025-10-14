import { Feature } from '../types/Feature';

interface FeatureCardProps {
  feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
  const animationDelay = `${feature.order * 100}ms`;

  return (
    <div
      className="deep-gradient group relative flex flex-col items-center gap-4 overflow-hidden rounded-lg p-6 text-center shadow-md backdrop-blur-xl transition-all duration-500 hover:border-solana-purple/60 hover:shadow-lg sm:p-8"
      style={{ animationDelay }}
    >
      {/* Metallic top edge highlight */}
      <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-forge-steel/40 to-transparent" />

      {/* Holographic data streams */}
      <div className="absolute left-2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-solana-purple/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className="absolute right-2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-solana-purple/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ transitionDelay: '0.1s' }}
      />

      {/* Purple holographic glow */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-solana-purple/15 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Title with enhanced effects */}
      <h3 className="relative font-body text-xl font-medium text-gray-200 transition-all duration-500 group-hover:scale-105 group-hover:text-white group-hover:drop-shadow-lg sm:text-2xl">
        <span className="relative z-10">{feature.title}</span>
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </h3>

      {/* Description with smooth reveal */}
      <p className="relative mb-4 text-sm leading-relaxed text-gray-400 transition-all duration-500 group-hover:scale-[1.02] group-hover:text-gray-200 sm:text-base">
        {feature.description}
      </p>

      {/* Enhanced bottom forge accent */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-solana-purple/20 via-solana-purple/80 to-forge-steel/60 transition-all duration-1000 group-hover:w-full group-hover:shadow-lg group-hover:shadow-solana-purple/30" />

      {/* Secondary accent line */}
      <div
        className="absolute bottom-[2px] left-0 h-[1px] w-0 bg-gradient-to-r from-white/20 to-transparent transition-all duration-700 group-hover:w-1/2"
        style={{ transitionDelay: '0.3s' }}
      />
    </div>
  );
}

export default FeatureCard;
