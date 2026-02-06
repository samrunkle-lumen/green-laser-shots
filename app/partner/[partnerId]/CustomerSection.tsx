'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';
import { Customer } from '@/lib/types/property';
import { formatCurrency } from '@/lib/utils/aggregations';

interface CustomerSectionProps {
  customer: Customer;
  partnerId: string;
}

export default function CustomerSection({ customer, partnerId }: CustomerSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use production domain for customer URLs with nested partner structure
  const customerUrl = `https://rooftopsintorevenue.com/${partnerId}/${customer.slug}`;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left"
          aria-expanded={isExpanded}
          aria-controls={`customer-${customer.id}-properties`}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${customer.name} properties`}
        >
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-light">{customer.name}</h2>
              <span className="text-sm text-[#9FA38F]">
                {customer.totalProperties} {customer.totalProperties === 1 ? 'property' : 'properties'}
                {' • '}
                {formatCurrency(customer.totalAnnualValue)}/year
              </span>
            </div>
            <div className="flex gap-4 mt-2 text-sm text-[#9FA38F]">
              <span>{customer.ownedCount} owned</span>
              <span>{customer.leasedCount} leased</span>
            </div>
          </div>
          <svg
            className={`w-6 h-6 text-[#9FA38F] transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-[#9FA38F]/20">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-[#9FA38F]">Share with customer:</div>
            <Link
              href={`/${partnerId}/${customer.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-2 text-sm font-semibold text-[#1A1A1A] bg-[#B1E5FF] hover:bg-[#94CAEB] rounded-lg transition-colors"
              aria-label={`Preview customer page for ${customer.name} (opens in new tab)`}
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Preview Customer Page
            </Link>
          </div>
          <ShareButtons customer={customer} customerUrl={customerUrl} />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div
          id={`customer-${customer.id}-properties`}
          className="border-t border-[#9FA38F]/20 p-6 bg-[#F5F5F5]/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.properties.map((property) => (
              <Link
                key={property.id}
                href={`/${partnerId}/${customer.slug}/${property.id}`}
                className="bg-white p-4 rounded border border-[#9FA38F]/20 hover:border-[#B1E5FF] hover:shadow-md transition-all"
                aria-label={`View details for ${property.address}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-[#1A1A1A]">
                    {property.address}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      property.isOwned
                        ? 'bg-[#DFFF5E] text-[#1A1A1A]'
                        : 'bg-[#B1E5FF] text-[#1A1A1A]'
                    }`}
                  >
                    {property.isOwned ? 'Owned' : 'Leased'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-[#9FA38F]">
                  <div>
                    <div className="text-xs">System Size</div>
                    <div className="text-[#1A1A1A] font-medium">
                      {property.systemSize.toLocaleString()} kW
                    </div>
                  </div>
                  <div>
                    <div className="text-xs">Annual Value</div>
                    <div className="text-[#1A1A1A] font-medium">
                      {property.leasePerYear}
                    </div>
                  </div>
                </div>

                {!property.isOwned && (
                  <div className="mt-2 text-xs text-[#9FA38F]">
                    Landlord: {property.ownerName}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
