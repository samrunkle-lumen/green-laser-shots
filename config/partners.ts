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
    logoHorizontalDark: '/logos/lumen/logo-black.svg', // Using Lumen logo for now
    logoHorizontalWhite: '/logos/lumen/logo-black.svg',
    logoVerticalDark: '/logos/lumen/logo-black.svg',
    logoVerticalWhite: '/logos/lumen/logo-black.svg',
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
