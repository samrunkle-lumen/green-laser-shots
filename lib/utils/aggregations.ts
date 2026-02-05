import { Property, Customer } from '@/lib/types/property';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
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
