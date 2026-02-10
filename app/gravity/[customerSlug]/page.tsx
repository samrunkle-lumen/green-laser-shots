import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import InternalShareButtons from '@/components/InternalShareButtons';
import { getPartner } from '@/config/partners';
import { loadPartnerData } from '@/lib/data/parseCSV';
import { groupPropertiesByCustomer, getCustomerBySlug, formatCurrency } from '@/lib/utils/aggregations';
import { getProcessExplanation, getLandlordTenantResponsibilities } from '@/lib/content/languageLogic';

interface PageProps {
  params: Promise<{
    customerSlug: string;
  }>;
}

export default async function GravityCustomerPage({ params }: PageProps) {
  const { customerSlug } = await params;

  // Gravity customer pages are always for the gravity partner
  const partnerId = 'gravity';
  const partner = getPartner(partnerId);

  if (!partner) {
    notFound();
  }

  // Load data
  const properties = loadPartnerData(partner.id, partner.dataFile);
  const customers = groupPropertiesByCustomer(properties, partner.id);
  const customer = getCustomerBySlug(customers, customerSlug);

  if (!customer) {
    notFound();
  }

  // Build customer URL (production domain)
  const customerUrl = `https://rooftopsintorevenue.com/gravity/${customer.slug}`;

  // Determine process explanation based on ownership mix
  const processInfo = getProcessExplanation(customer.ownedCount, customer.leasedCount);

  // Group properties by state for regional breakdown
  const propertyStates = new Map<string, number>();
  customer.properties.forEach(prop => {
    const state = prop.address.split(',').slice(-2)[0]?.trim() || 'Unknown';
    propertyStates.set(state, (propertyStates.get(state) || 0) + 1);
  });

  return (
    <div className="min-h-screen bg-white">
      <Header partner={partner} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-light mb-4">{customer.name}</h1>
          <p className="text-xl text-[#9FA38F]">
            Community Solar Opportunities Across Your Facilities
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <div className="text-sm uppercase tracking-wide text-[#9FA38F] mb-2">
              Total Properties
            </div>
            <div className="text-4xl font-light">{customer.totalProperties}</div>
            <div className="mt-2 text-sm text-[#9FA38F]">
              {customer.ownedCount} owned, {customer.leasedCount} leased
            </div>
          </div>

          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <div className="text-sm uppercase tracking-wide text-[#9FA38F] mb-2">
              Total Annual Value
            </div>
            <div className="text-4xl font-light">
              {formatCurrency(customer.totalAnnualValue)}
            </div>
            <div className="mt-2 text-sm text-[#9FA38F]">per year</div>
          </div>

          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <div className="text-sm uppercase tracking-wide text-[#9FA38F] mb-2">
              Average per Property
            </div>
            <div className="text-4xl font-light">
              {formatCurrency(customer.totalAnnualValue / customer.totalProperties)}
            </div>
            <div className="mt-2 text-sm text-[#9FA38F]">per year</div>
          </div>
        </div>

        {/* Share with Internal Team */}
        <InternalShareButtons customer={customer} customerUrl={customerUrl} />

        {/* Value Proposition */}
        <div className="bg-[#B1E5FF]/10 border-l-4 border-[#B1E5FF] rounded p-6 mb-12">
          <h2 className="text-2xl font-light mb-3">The Opportunity</h2>
          <p className="text-lg text-[#1A1A1A] mb-4">
            We've identified front-of-the-meter clean energy projects across{' '}
            {customer.totalProperties} of your facilities that can generate approximately{' '}
            <strong>{formatCurrency(customer.totalAnnualValue)} per year</strong> in
            incremental value - with no operational disruption and no capital required
            from your team.
          </p>
          <p className="text-[#9FA38F]">
            <strong className="text-[#1A1A1A]">Current lease rates are at their peaks due to the federal Investment Tax Credit (ITC).</strong> Lease rates will decline sharply as the ITC disappears. We already have developer interest and indicative pricing in hand.
          </p>
        </div>

        {/* Landlord/Tenant Responsibilities - Only show if customer has leased properties */}
        {customer.leasedCount > 0 && (() => {
          const responsibilitiesInfo = getLandlordTenantResponsibilities();
          return (
            <div className="mb-12">
              <h2 className="text-3xl font-light mb-3">{responsibilitiesInfo.title}</h2>
              <p className="text-lg text-[#9FA38F] mb-8">{responsibilitiesInfo.subtitle}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Tenant Responsibilities */}
                <div className="bg-[#B1E5FF]/10 rounded-lg p-6 border-l-4 border-[#B1E5FF]">
                  <div className="flex items-start mb-4">
                    <svg className="w-6 h-6 text-[#B1E5FF] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <h3 className="text-xl font-medium mb-2">{responsibilitiesInfo.tenantSection.title}</h3>
                      <p className="text-sm text-[#9FA38F] mb-4">{responsibilitiesInfo.tenantSection.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {responsibilitiesInfo.tenantSection.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-[#B1E5FF] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Landlord Responsibilities */}
                <div className="bg-[#DFFF5E]/20 rounded-lg p-6 border-l-4 border-[#DFFF5E]">
                  <div className="flex items-start mb-4">
                    <svg className="w-6 h-6 text-[#1A1A1A] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <div>
                      <h3 className="text-xl font-medium mb-2">{responsibilitiesInfo.landlordSection.title}</h3>
                      <p className="text-sm text-[#9FA38F] mb-4">{responsibilitiesInfo.landlordSection.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {responsibilitiesInfo.landlordSection.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-[#1A1A1A] mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Landlord Motivation */}
              <div className="bg-[#F5F5F5] rounded-lg p-6">
                <h3 className="text-xl font-medium mb-4 text-center">{responsibilitiesInfo.landlordMotivation.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {responsibilitiesInfo.landlordMotivation.points.map((point, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-lg font-medium mb-1">{point.title}</div>
                      <div className="text-sm text-[#9FA38F]">{point.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Properties Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-light mb-6">Your Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.properties.map((property) => (
              <Link
                key={property.id}
                href={`/gravity/${customer.slug}/${property.id}`}
                className="bg-white border border-[#9FA38F]/20 rounded-lg p-6 hover:border-[#B1E5FF] hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1">{property.address}</h3>
                    <div className="text-sm text-[#9FA38F]">{property.utility}</div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded font-medium ${
                      property.isOwned
                        ? 'bg-[#DFFF5E] text-[#1A1A1A]'
                        : 'bg-[#B1E5FF] text-[#1A1A1A]'
                    }`}
                  >
                    {property.isOwned ? 'Owned' : 'Leased'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-[#9FA38F] mb-1">System Size</div>
                    <div className="text-lg font-medium">
                      {property.systemSize.toLocaleString()} kW
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#9FA38F] mb-1">Annual Value</div>
                    <div className="text-lg font-medium">{property.leasePerYear}</div>
                  </div>
                </div>

                {!property.isOwned && (
                  <div className="text-sm text-[#9FA38F] pt-4 border-t border-[#9FA38F]/20">
                    Landlord: {property.ownerName}
                  </div>
                )}

                <div className="mt-4 flex items-center text-[#B1E5FF] text-sm font-medium">
                  View Details
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Process Explanation */}
        <div className="mb-12">
          <h2 className="text-3xl font-light mb-6">{processInfo.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processInfo.steps.map((step, index) => (
              <div key={index} className="bg-[#F5F5F5] rounded-lg p-6">
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-[#9FA38F]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#1A1A1A] text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-light mb-4">Ready to Learn More?</h2>
          <p className="text-lg mb-6 text-[#9FA38F]">
            We'd like to schedule a short working session (30 minutes) to walk through
            the site-specific economics and align on next steps.
          </p>
          <a
            href="https://www.getclockwise.com/c/sam-runkle-lumen-energy/lumen"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#B1E5FF] hover:bg-[#94CAEB] text-[#1A1A1A] font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Schedule a Meeting
          </a>
        </div>
      </main>
    </div>
  );
}
