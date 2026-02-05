'use client';

import { useState, useMemo } from 'react';
import CustomerSection from '@/app/partner/[partnerId]/CustomerSection';
import { Customer } from '@/lib/types/property';

interface FilterableCustomerListProps {
  customers: Customer[];
  partnerId: string;
}

export default function FilterableCustomerList({ customers, partnerId }: FilterableCustomerListProps) {
  const [customerFilter, setCustomerFilter] = useState('');
  const [landlordFilter, setLandlordFilter] = useState('');
  const [minSize, setMinSize] = useState(0);
  const [maxSize, setMaxSize] = useState(10000);
  const [stateFilter, setStateFilter] = useState<string[]>([]);

  // Extract all unique states and landlords from properties
  const { states, landlords, maxSystemSize } = useMemo(() => {
    const stateSet = new Set<string>();
    const landlordSet = new Set<string>();
    let max = 0;

    customers.forEach(customer => {
      customer.properties.forEach(prop => {
        // Extract state from address (last part after comma)
        const addressParts = prop.address.split(',');
        const stateZip = addressParts[addressParts.length - 1]?.trim() || '';
        const state = stateZip.split(' ')[0]; // Get state code
        if (state) stateSet.add(state);

        // Add landlord
        if (prop.ownerName) landlordSet.add(prop.ownerName);

        // Track max system size
        if (prop.systemSize > max) max = prop.systemSize;
      });
    });

    return {
      states: Array.from(stateSet).sort(),
      landlords: Array.from(landlordSet).sort(),
      maxSystemSize: Math.ceil(max / 100) * 100 // Round up to nearest 100
    };
  }, [customers]);

  // Filter customers based on criteria
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Customer name filter
      if (customerFilter && !customer.name.toLowerCase().includes(customerFilter.toLowerCase())) {
        return false;
      }

      // Check if any property matches landlord, size, and state filters
      const hasMatchingProperty = customer.properties.some(prop => {
        // Landlord filter
        if (landlordFilter && !prop.ownerName.toLowerCase().includes(landlordFilter.toLowerCase())) {
          return false;
        }

        // Size filter
        if (prop.systemSize < minSize || prop.systemSize > maxSize) {
          return false;
        }

        // State filter
        if (stateFilter.length > 0) {
          const addressParts = prop.address.split(',');
          const stateZip = addressParts[addressParts.length - 1]?.trim() || '';
          const state = stateZip.split(' ')[0];
          if (!stateFilter.includes(state)) {
            return false;
          }
        }

        return true;
      });

      return hasMatchingProperty;
    });
  }, [customers, customerFilter, landlordFilter, minSize, maxSize, stateFilter]);

  const clearFilters = () => {
    setCustomerFilter('');
    setLandlordFilter('');
    setMinSize(0);
    setMaxSize(maxSystemSize);
    setStateFilter([]);
  };

  const activeFilterCount = [
    customerFilter !== '',
    landlordFilter !== '',
    minSize > 0 || maxSize < maxSystemSize,
    stateFilter.length > 0
  ].filter(Boolean).length;

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium">Filters</h2>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-[#B1E5FF] hover:text-[#94CAEB] font-medium"
            >
              Clear All ({activeFilterCount})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Customer Name Filter */}
          <div>
            <label className="block text-sm font-medium text-[#9FA38F] mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              placeholder="Search customers..."
              className="w-full px-3 py-2 border border-[#9FA38F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B1E5FF]"
            />
          </div>

          {/* Landlord/Owner Filter */}
          <div>
            <label className="block text-sm font-medium text-[#9FA38F] mb-2">
              Landlord/Owner
            </label>
            <input
              type="text"
              value={landlordFilter}
              onChange={(e) => setLandlordFilter(e.target.value)}
              placeholder="Search landlords..."
              className="w-full px-3 py-2 border border-[#9FA38F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B1E5FF]"
            />
          </div>

          {/* Project Size Filter */}
          <div>
            <label className="block text-sm font-medium text-[#9FA38F] mb-2">
              System Size (kW)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={minSize}
                onChange={(e) => setMinSize(Number(e.target.value))}
                placeholder="Min"
                className="w-1/2 px-3 py-2 border border-[#9FA38F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B1E5FF]"
              />
              <input
                type="number"
                value={maxSize}
                onChange={(e) => setMaxSize(Number(e.target.value))}
                placeholder="Max"
                className="w-1/2 px-3 py-2 border border-[#9FA38F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B1E5FF]"
              />
            </div>
          </div>

          {/* State Filter */}
          <div>
            <label className="block text-sm font-medium text-[#9FA38F] mb-2">
              State
            </label>
            <select
              multiple
              value={stateFilter}
              onChange={(e) => setStateFilter(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-3 py-2 border border-[#9FA38F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B1E5FF] h-[42px]"
            >
              {states.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
            <p className="text-xs text-[#9FA38F] mt-1">Hold Cmd/Ctrl to select multiple</p>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 pt-4 border-t border-[#9FA38F]/20">
          <p className="text-sm text-[#9FA38F]">
            Showing {filteredCustomers.length} of {customers.length} customers
            {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
          </p>
        </div>
      </div>

      {/* Customer List */}
      <div className="space-y-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <CustomerSection
              key={customer.id}
              customer={customer}
              partnerId={partnerId}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-lg text-[#9FA38F]">No customers match your filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-[#B1E5FF] hover:text-[#94CAEB] font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
