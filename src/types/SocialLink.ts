export type SocialPlatform = 'x' | 'discord' | 'docs';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  ariaLabel: string;
}
