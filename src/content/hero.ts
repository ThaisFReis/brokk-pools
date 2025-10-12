import { HeroContent } from '../types/HeroContent';

export const heroContent: HeroContent = {
  logo: {
    src: '/assets/logo.png',
    alt: 'Brokk Pools - Nordic rune styled B logo',
    width: 220,
    height: 220,
  },
  title: 'BROKK POOLS',
  //subtitle:
    //'Effortlessly manage your Solana assets, provide liquidity, and earn rewards with unparalleled speed and security.',
  subtitle:
  "Forge Your Liquidity. Command Your Yield.",
  description: "Wield the tools of a god-smith to create, optimize, and rebalance your liquidity.",
  badge: 'Forge Your Future on Solana',
  cta: [
    {text: 'LAUNCH APP',
    href: '#',
    ariaLabel: 'Launch Brokk Pools application',},
    {text: 'LEARN MORE',
      href: '#',
      ariaLabel: 'Learn more about Brokk Pools application',}
  ],

};
