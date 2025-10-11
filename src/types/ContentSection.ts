import { CSSProperties } from 'react';

export type SectionType = 'hero' | 'features' | 'visual' | 'footer';

export interface ContentSection {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  backgroundStyle?: CSSProperties;
}
