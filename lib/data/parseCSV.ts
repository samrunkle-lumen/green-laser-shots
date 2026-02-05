import { Property } from '@/lib/types/property';
import * as fs from 'fs';
import * as path from 'path';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function parseLeaseValue(leaseStr: string): number {
  // Remove $, commas, and parse to number
  // e.g., "$250,000" => 250000
  return parseFloat(leaseStr.replace(/[$,]/g, ''));
}

// Robust CSV parser that handles quoted values
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Push the last value
  values.push(current.trim());

  return values;
}

export function parseCSV(csvPath: string, partnerId: string): Property[] {
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n');

  // Skip header row
  const dataLines = lines.slice(1).filter(line => line.trim());

  const properties: Property[] = dataLines.map((line, index) => {
    const values = parseCSVLine(line);

    const [
      portfolio,
      address,
      roofMaxPV,
      systemSize,
      leasePerYear,
      ratePerKW,
      utility,
      ownerName,
      type
    ] = values;

    const isOwned = portfolio.trim() === ownerName.trim();
    const propertyId = slugify(`${portfolio}-${address}-${index}`);

    return {
      id: propertyId,
      partnerId,
      portfolio: portfolio.trim(),
      address: address.trim(),
      roofMaxPV: parseFloat(roofMaxPV.replace(/,/g, '')),
      systemSize: parseFloat(systemSize.replace(/,/g, '')),
      leasePerYear: leasePerYear.trim(),
      leasePerYearNumber: parseLeaseValue(leasePerYear),
      ratePerKW: parseFloat(ratePerKW.replace(/[$,]/g, '')),
      utility: utility.trim(),
      ownerName: ownerName.trim(),
      type: ((type && type.trim() === 'Owned') ? 'Owned' : 'Leased') as 'Leased' | 'Owned',
      isOwned,
    };
  });

  return properties;
}

export function loadPartnerData(partnerId: string, dataFile: string): Property[] {
  const csvPath = path.join(process.cwd(), dataFile);
  return parseCSV(csvPath, partnerId);
}
