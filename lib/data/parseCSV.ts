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

export function parseCSV(csvPath: string, partnerId: string): Property[] {
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n');

  // Skip header row
  const dataLines = lines.slice(1).filter(line => line.trim());

  const properties: Property[] = dataLines.map((line, index) => {
    // Parse CSV line (handle quoted values)
    const regex = /("([^"]*)"|([^,]*))/g;
    const values: string[] = [];
    let match;

    while ((match = regex.exec(line)) !== null) {
      values.push(match[2] !== undefined ? match[2] : match[3]);
    }

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
      type: (type && type.trim()) || (isOwned ? 'Owned' : 'Leased'),
      isOwned,
    };
  });

  return properties;
}

export function loadPartnerData(partnerId: string, dataFile: string): Property[] {
  const csvPath = path.join(process.cwd(), dataFile);
  return parseCSV(csvPath, partnerId);
}
