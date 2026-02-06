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

  // Parse header row to get column indices
  const headers = parseCSVLine(lines[0]);
  const columnMap: Record<string, number> = {};
  headers.forEach((header, index) => {
    columnMap[header.toLowerCase().trim()] = index;
  });

  // Skip header row
  const dataLines = lines.slice(1).filter(line => line.trim());

  const properties: Property[] = dataLines.map((line, index) => {
    const values = parseCSVLine(line);

    // Map columns based on header names - support both Watershed and Gravity formats
    const portfolio = values[columnMap['portfolio'] ?? columnMap['customer']] || '';
    const address = values[columnMap['property address']] || '';
    const roofMaxPV = values[columnMap['roof max pv (kw)']] || '0';
    const systemSize = values[columnMap['system size (kw)'] ?? columnMap['system size']] || '0';
    const leasePerYear = values[columnMap['lease per year'] ?? columnMap['lease $/yr']] || '$0';
    const ratePerKW = values[columnMap['$/kw']] || '0';
    const utility = values[columnMap['utility']] || '';
    const ownerName = values[columnMap['owner name']] || '';
    const type = values[columnMap['type']] || '';

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

// Cache to avoid re-parsing CSV files on every request
const dataCache: Map<string, Property[]> = new Map();

export function loadPartnerData(partnerId: string, dataFile: string): Property[] {
  // Check cache first
  if (dataCache.has(dataFile)) {
    return dataCache.get(dataFile)!;
  }

  // Parse and cache
  const csvPath = path.join(process.cwd(), dataFile);
  const properties = parseCSV(csvPath, partnerId);
  dataCache.set(dataFile, properties);

  return properties;
}
