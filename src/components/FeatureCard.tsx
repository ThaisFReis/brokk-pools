import { Feature } from '../types/Feature';

interface FeatureCardProps {
  feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {

  return (
    <div
      className="deep-gradient group relative flex flex-col items-center gap-4 overflow-hidden rounded-lg p-6 text-center shadow-md backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:border-solana-purple/80 hover:shadow-2xl hover:shadow-solana-purple/20 sm:p-8"
    >


      {/* Metallic top edge highlight */}
      <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-forge-steel/40 to-transparent transition-all duration-500 group-hover:via-forge-steel/80" />

      {/* Enhanced holographic data streams */}
      <div className="absolute left-2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-solana-purple/30 to-transparent opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-solana-purple/50" />

      {/* Secondary glow effect */}
      <div className="absolute -bottom-16 -right-16 h-32 w-32 rounded-full bg-forge-steel/10 opacity-0 blur-2xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-80" />

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
