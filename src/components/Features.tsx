import { features } from '../content/features';
import FeatureCard from './FeatureCard';
import printIMG from '../assets/print.png';

export const Features = () => {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative w-full bg-violet-abyss px-6 py-16 md:px-12 lg:py-24"
    >
      {/* Gradient transition to next section */}
      <div className="absolute inset-x-0 top-0 h-60 bg-gradient-to-b from-solana-gray via-solana-gray/80 to-transparent" />
      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl flex flex-row">
        <div className="flex-col items-center justify-center w-2/5 mx-auto">
          {/* Section Title */}
          <h2
            id="features-title"
            className="mb-16 text-center font-title text-4xl font-bold drop-shadow-md md:text-5xl"
          >
            Forged Features
          </h2>

          {/* Feature Cards */}
          <div className="flex flex-col items-center justify-center">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
        <img src={printIMG} alt="Print" className='rounded-md w-2/5 h-screen ml-auto mr-0' />
      </div>
    </section>
  );
};
