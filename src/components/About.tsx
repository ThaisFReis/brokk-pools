import FeatureCard from './FeatureCard';

const aboutStory = [
  {
    id: 'ancient-forge',
    title: 'Ancient Forge',
    description:
      'In the ancient halls of Svartálfheim, Brokk the dwarf forged legendary artifacts of immeasurable power. His hammer crafted Thor\'s Mjölnir, weapons that shaped the fate of gods.',
    order: 1,
  },
  {
    id: 'cyberpunk-awakening',
    title: 'Cyberpunk Awakening',
    description:
      'Millennia later, in a future where blockchain and mythology converge, Brokk awakens in a cyberpunk realm. His forge now glows with neon light, his anvil strikes echo across the Solana network.',
    order: 2,
  },
  {
    id: 'new-masterwork',
    title: 'The Masterwork',
    description:
      'His new mission: forge tools that empower mortals to navigate the decentralized cosmos. Brokk Pools is his masterwork—where data is hammered into wisdom, and liquidity becomes lightning.',
    order: 3,
  },
];

export const About = () => {
  return (
    <section
      id="about"
      className="relative w-full px-6 py-20 md:px-12 lg:py-32"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <h2
          id="about-title"
          className="mb-16 text-center text-4xl font-bold font-title drop-shadow-md md:text-5xl"
        >
          The Legend of Brokk
        </h2>

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {aboutStory.map((story) => (
            <FeatureCard key={story.id} feature={story} />
          ))}
        </div>
      </div>
    </section>
  );
};
