import { Feature } from '../types/Feature';
import { ChartLine, Shield, Zap } from 'lucide-react'

interface FeatureCardProps {
  feature: Feature;
}

const iconMap = {
  analytics: ChartLine,
  yields: Zap,
  security: Shield,
};

function FeatureCard({ feature }: FeatureCardProps) {
  const animationDelay = `${feature.order * 100}ms`;
  const Icon = iconMap[feature.icon];

  return (
    <div
      className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-lg bg-gradient-to-br from-forge-metaldark/90 to-forge-deepblack/80 p-6 sm:p-8 text-center shadow-md backdrop-blur-xl transition-all duration-500 hover:border-solana-purple/60 hover:shadow-lg"
      style={{ animationDelay }}
    >
      {/* Metallic top edge highlight */}
      <div className="absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r from-transparent via-forge-steel/40 to-transparent" />


      {/* Holographic data streams */}
      <div className="absolute left-2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-solana-purple/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute right-2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-solana-purple/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ transitionDelay: '0.1s' }} />

      {/* Purple holographic glow */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-solana-purple/15 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Icon - forged weapon style */}
      <div className="relative transition-transform duration-500 group-hover:scale-110">

        <Icon className="relative h-10 w-10 text-solana-purple transition-all duration-500" strokeWidth={0.5} />
      </div>

      {/* Title - legendary weapon name */}
      <h3 className="relative text-xl sm:text-2xl font-medium font-body text-gray-200 transition-all duration-500 group-hover:text-gray-100">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="relative text-sm sm:text-base leading-relaxed text-gray-400 transition-colors duration-300 group-hover:text-gray-300">{feature.description}</p>

      {/* Bottom forge accent - heated metal effect */}
      <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-gradient-to-r from-solana-purple/10 to-solana-purple/60 transition-all duration-700 group-hover:w-full" />
    </div>
  );
}

export default FeatureCard;
