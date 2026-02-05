import { Partner } from '@/lib/types/property';

export const partners: Record<string, Partner> = {
  watershed: {
    id: 'watershed',
    name: 'Watershed',
    logoHorizontalDark: '/logos/watershed/watershed-horizontal-dark.svg',
    logoHorizontalWhite: '/logos/watershed/watershed-horizontal-white.svg',
    logoVerticalDark: '/logos/watershed/watershed-vertical-dark.svg',
    logoVerticalWhite: '/logos/watershed/watershed-vertical-white.svg',
    dataFile: 'data/partners/watershed/properties.csv',
    primaryColor: '#1A1A1A', // Use Lumen Graphite Black by default
  },
  gravity: {
    id: 'gravity',
    name: 'Gravity Climate',
    logoHorizontalDark: '/logos/gravity/gravity-horizontal-dark.png',
    logoHorizontalWhite: '/logos/gravity/gravity-horizontal-dark.png',
    logoVerticalDark: '/logos/gravity/gravity-horizontal-dark.png',
    logoVerticalWhite: '/logos/gravity/gravity-horizontal-dark.png',
    dataFile: 'data/partners/gravity/GLS - Gravity - Sheet1.csv',
    primaryColor: '#1A1A1A', // Use Lumen Graphite Black by default
  },
};

export function getPartner(partnerId: string): Partner | undefined {
  return partners[partnerId];
}

export function getAllPartners(): Partner[] {
  return Object.values(partners);
}
