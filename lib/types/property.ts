export interface Property {
  id: string;
  partnerId: string;
  portfolio: string; // customer name
  address: string;
  roofMaxPV: number;
  systemSize: number;
  leasePerYear: string; // Keep as string for formatting (e.g., "$250,000")
  leasePerYearNumber: number; // Parsed number for calculations
  ratePerKW: number;
  utility: string;
  ownerName: string;
  type: 'Leased' | 'Owned';
  isOwned: boolean; // Derived: portfolio === ownerName
}

export interface Customer {
  id: string;
  partnerId: string;
  name: string;
  properties: Property[];
  totalAnnualValue: number;
  totalProperties: number;
  ownedCount: number;
  leasedCount: number;
}

export interface Partner {
  id: string;
  name: string;
  logoHorizontalDark: string;
  logoHorizontalWhite: string;
  logoVerticalDark: string;
  logoVerticalWhite: string;
  dataFile: string;
  primaryColor: string;
}
