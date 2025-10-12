import { features } from '../content/features';
import FeatureCard from './FeatureCard';

export const Features = () => {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative w-full px-6 py-20 md:px-12 lg:py-32"
    >
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Title */}
        <h2
          id="features-title"
          className="mb-16 text-center font-title text-4xl font-bold drop-shadow-md md:text-5xl"
        >
          Forged Features
        </h2>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
