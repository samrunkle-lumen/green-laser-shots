import { Property, Customer } from '@/lib/types/property';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Generate a deterministic 4-character hash from a string
function generateDeterministicHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert to positive number and then to base36 (0-9, a-z)
  const positive = Math.abs(hash);
  const base36 = positive.toString(36);

  // Take first 4 characters, pad if needed
  return base36.substring(0, 4).padEnd(4, '0');
}

// Create a unique slug for watershed customer URLs (e.g., "home-depot-7j3u")
function createCustomerSlug(customerName: string): string {
  const base = slugify(customerName);
  const hashSuffix = generateDeterministicHash(customerName);
  return `${base}-${hashSuffix}`;
}

export function groupPropertiesByCustomer(
  properties: Property[],
  partnerId: string
): Customer[] {
  // Group by portfolio (customer name)
  const customerMap = new Map<string, Property[]>();

  properties.forEach(property => {
    const customerName = property.portfolio;
    if (!customerMap.has(customerName)) {
      customerMap.set(customerName, []);
    }
    customerMap.get(customerName)!.push(property);
  });

  // Convert to Customer objects
  const customers: Customer[] = Array.from(customerMap.entries()).map(
    ([customerName, customerProperties]) => {
      const totalAnnualValue = customerProperties.reduce(
        (sum, prop) => sum + prop.leasePerYearNumber,
        0
      );

      const ownedCount = customerProperties.filter(p => p.isOwned).length;
      const leasedCount = customerProperties.length - ownedCount;

      return {
        id: slugify(customerName),
        slug: createCustomerSlug(customerName), // e.g., "home-depot-7j3u"
        partnerId,
        name: customerName,
        properties: customerProperties,
        totalAnnualValue,
        totalProperties: customerProperties.length,
        ownedCount,
        leasedCount,
      };
    }
  );

  // Sort by total annual value (highest first)
  return customers.sort((a, b) => b.totalAnnualValue - a.totalAnnualValue);
}

export function getCustomerById(
  customers: Customer[],
  customerId: string
): Customer | undefined {
  return customers.find(c => c.id === customerId);
}

export function getCustomerBySlug(
  customers: Customer[],
  slug: string
): Customer | undefined {
  return customers.find(c => c.slug === slug);
}

export function getPropertyById(
  properties: Property[],
  propertyId: string
): Property | undefined {
  return properties.find(p => p.id === propertyId);
}

export function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  } else {
    return `$${value.toLocaleString()}`;
  }
}

export function formatCurrencyFull(value: number): string {
  return `$${value.toLocaleString()}`;
}
