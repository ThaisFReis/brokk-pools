export type SocialPlatform = 'x' | 'telegram' | 'docs';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  ariaLabel: string;
}
