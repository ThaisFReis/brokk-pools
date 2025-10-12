import FeatureCard from './FeatureCard';
import { about } from '../content/about';

export const About = () => {
  return (
    <section id="about" className="relative w-full px-6 py-20 md:px-12 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        <h2
          id="about-title"
          className="mb-16 text-center font-title text-4xl font-bold drop-shadow-md md:text-5xl"
        >
          The Legend of Brokk
        </h2>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {about.map((story) => (
            <FeatureCard key={story.id} feature={story} />
          ))}
        </div>
      </div>
    </section>
  );
};
