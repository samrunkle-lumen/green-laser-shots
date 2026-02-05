'use client';

import { useState, useMemo } from 'react';
import CustomerSection from '@/app/partner/[partnerId]/CustomerSection';
import { Customer } from '@/lib/types/property';
import SearchableSelect from './SearchableSelect';
import MultiSelectDropdown from './MultiSelectDropdown';

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

  // Extract all unique values for dropdown options
  const { states, landlords, customerNames, maxSystemSize } = useMemo(() => {
    const stateSet = new Set<string>();
    const landlordSet = new Set<string>();
    const customerNameSet = new Set<string>();
    let max = 0;

    customers.forEach(customer => {
      // Add customer name
      customerNameSet.add(customer.name);

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
      customerNames: Array.from(customerNameSet).sort(),
      maxSystemSize: Math.ceil(max / 100) * 100 // Round up to nearest 100
    };
  }, [customers]);

  // Filter customers based on criteria
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      // Customer name filter - exact match from dropdown
      if (customerFilter && customer.name !== customerFilter) {
        return false;
      }

      // Check if any property matches landlord, size, and state filters
      const hasMatchingProperty = customer.properties.some(prop => {
        // Landlord filter - exact match from dropdown
        if (landlordFilter && prop.ownerName !== landlordFilter) {
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
          <SearchableSelect
            label="Customer Name"
            value={customerFilter}
            onChange={setCustomerFilter}
            options={customerNames}
            placeholder="Select customer..."
            id="customer-filter"
          />

          {/* Landlord/Owner Filter */}
          <SearchableSelect
            label="Landlord/Owner"
            value={landlordFilter}
            onChange={setLandlordFilter}
            options={landlords}
            placeholder="Select landlord..."
            id="landlord-filter"
          />

          {/* Project Size Filter */}
          <div>
            <label htmlFor="size-filter-min" className="block text-sm font-medium text-[#9FA38F] mb-2">
              System Size (kW)
            </label>
            <div className="flex gap-2">
              <input
                id="size-filter-min"
                type="number"
                value={minSize}
                onChange={(e) => setMinSize(Number(e.target.value))}
                placeholder="Min"
                aria-label="Minimum system size in kilowatts"
                className="w-1/2 px-3 py-2 border border-[#9FA38F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B1E5FF]"
              />
              <input
                id="size-filter-max"
                type="number"
                value={maxSize}
                onChange={(e) => setMaxSize(Number(e.target.value))}
                placeholder="Max"
                aria-label="Maximum system size in kilowatts"
                className="w-1/2 px-3 py-2 border border-[#9FA38F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B1E5FF]"
              />
            </div>
          </div>

          {/* State Filter */}
          <MultiSelectDropdown
            label="State"
            selectedValues={stateFilter}
            onChange={setStateFilter}
            options={states}
            placeholder="Select states..."
            id="state-filter"
          />
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
