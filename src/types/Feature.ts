export type RuneIconType = 'analytics' | 'yields' | 'security';

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: RuneIconType;
  order: number;
}
