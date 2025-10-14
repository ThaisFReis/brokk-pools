import { features } from '../content/features';
import FeatureCard from './FeatureCard';
import printIMG from '../assets/2.png';

export const Features = () => {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative w-full bg-violet-abyss px-6 py-16 md:px-12 lg:py-24 xl:py-32"
    >
      {/* Enhanced gradient transition */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-solana-gray via-solana-gray/60 to-transparent md:h-60" />

      {/* Forge atmosphere effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-solana-purple/5 opacity-70 blur-3xl" />
        <div className="absolute bottom-20 right-1/3 h-64 w-64 rounded-full bg-forge-steel/10 opacity-60 blur-2xl" />
      </div>

      {/* Main content container */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="mb-16 text-center lg:mb-20">
          <h2
            id="features-title"
            className="mb-6 font-title text-4xl font-bold drop-shadow-md transition-all duration-700 md:text-5xl lg:text-6xl"
          >
            <span className="bg-gradient-to-r from-gray-100 via-white to-gray-100 bg-clip-text text-transparent">
              Forged Features
            </span>
          </h2>
          <div className="mx-auto h-[1px] w-24 rounded-full bg-gradient-to-r from-transparent via-solana-purple to-transparent" />
        </div>

        {/* Responsive grid layout */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
          {/* Features Column */}
          <div className="order-2 lg:order-1">
            <div className="space-y-6 md:space-y-8 w-full max-w-lg mx-auto">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  className="transform transition-all duration-700 ease-out"
                  style={{
                    animationDelay: `${index * 200}ms`,
                    animationFillMode: 'both',
                  }}
                >
                  <FeatureCard feature={feature} />
                </div>
              ))}
            </div>
          </div>

          {/* Image Column */}
          <div className="order-1 lg:order-2">
            <img
              src={printIMG}
              alt="Brokk Pools Analytics Dashboard Preview"
              className="h-auto w-fit object-cover "
            />
          </div>
        </div>

        {/* Bottom forge accent */}
        <div className="mt-16 flex justify-center lg:mt-20">
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-forge-steel/40 to-transparent" />
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="from-violet-abyss via-violet-abyss/80 absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" />
    </section>
  );
};
