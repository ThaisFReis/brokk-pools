export interface LogoConfig {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CTAButton {
  text: string;
  href: string;
  ariaLabel: string;
}

export interface HeroContent {
  logo: LogoConfig;
  title: string;
  badge: string;
  subtitle: string;
  description?: string;
  cta: CTAButton[];
}
