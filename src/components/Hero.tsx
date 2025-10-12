import { heroContent } from '../content/hero';
import CTAButton from './CTAButton';

export const Hero = () => {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-screen w-full flex-col items-center justify-center px-6 py-12 text-center md:px-12"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-[url('/assets/background3.png')] bg-cover bg-top bg-no-repeat" />
      <div className="absolute inset-0 bg-black/15 backdrop-blur-[0.5px]" />
      {/* Gradient transition to next section */}
      <div className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-b from-transparent via-solana-gray/70 to-solana-gray" />

      {/* Content */}
      <div className="relative z-10 flex max-w-5xl flex-col items-center gap-8">
        {/* Badge */}
        <div
          className="animate-slide-in-bottom inline-flex  items-center gap-2 rounded-full border border-[rgba(245,242,237,0.2)] px-4 py-2 backdrop-blur-sm"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="h-2 w-2 animate-pulse rounded-full bg-solana-green" />
          <span className="text-sm">{heroContent.badge}</span>
        </div>
        <div className="flex flex-col items-center">
          {/* Title */}
          <h1
            id="hero-title"
            className="animate-fade-in-delayed font-title text-4xl font-bold leading-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl"
          >
            {heroContent.title}
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl animate-fade-in-delayed font-body text-xl font-medium leading-relaxed text-gray-300 sm:text-2xl md:text-3xl lg:text-4xl">
            {heroContent.subtitle}
          </p>

          {/* Description */}
          <p className="max-w-xl animate-fade-in-delayed font-body text-base leading-relaxed text-gray-300 sm:text-lg">
            {heroContent.description}
          </p>
        </div>

        {/* CTA Button */}
        <div className="mt-4 flex animate-fade-in-delayed flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 md:gap-20">
          <CTAButton
            text={heroContent.cta[0].text}
            href={heroContent.cta[0].href}
            ariaLabel={heroContent.cta[0].ariaLabel}
          />
          <CTAButton
            text={heroContent.cta[1].text}
            href={heroContent.cta[1].href}
            ariaLabel={heroContent.cta[1].ariaLabel}
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-solana-purple/10 blur-3xl" />
      <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-solana-green/10 blur-3xl" />
    </section>
  );
};
