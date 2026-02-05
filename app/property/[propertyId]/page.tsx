import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import SatelliteMap from '@/components/SatelliteMap';
import SharePropertyButtons from '@/components/SharePropertyButtons';
import { getPartner } from '@/config/partners';
import { loadPartnerData } from '@/lib/data/parseCSV';
import { getPropertyById, groupPropertiesByCustomer, getCustomerById, formatCurrencyFull } from '@/lib/utils/aggregations';
import { getOwnershipLanguage } from '@/lib/content/languageLogic';

interface PageProps {
  params: Promise<{
    propertyId: string;
  }>;
  searchParams: Promise<{
    partner?: string;
  }>;
}

export default async function PropertyPage({ params, searchParams }: PageProps) {
  const { propertyId } = await params;
  const { partner: partnerId } = await searchParams;

  if (!partnerId) {
    notFound();
  }

  const partner = getPartner(partnerId);
  if (!partner) {
    notFound();
  }

  // Load data
  const properties = loadPartnerData(partner.id, partner.dataFile);
  const property = getPropertyById(properties, propertyId);

  if (!property) {
    notFound();
  }

  // Get customer data for breadcrumb URL
  const customers = groupPropertiesByCustomer(properties, partner.id);
  const customerId = property.portfolio.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const customer = getCustomerById(customers, customerId);

  // Generate customer URL (use slug for watershed, regular URL for others)
  const customerUrl = partnerId === 'watershed' && customer
    ? `/watershed/${customer.slug}`
    : `/customer/${customerId}?partner=${partnerId}`;

  const ownershipInfo = getOwnershipLanguage(property);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Generate property URL for sharing
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const propertyUrl = `${baseUrl}/property/${propertyId}?partner=${partnerId}`;

  // Detect if property is in Illinois
  const addressParts = property.address.split(',');
  const stateZip = addressParts[addressParts.length - 1]?.trim() || '';
  const state = stateZip.split(' ')[0];
  const isIllinois = state === 'IL';

  return (
    <div className="min-h-screen bg-white">
      <Header partner={partner} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-[#9FA38F]">
          <a href={`/partner/${partnerId}`} className="hover:text-[#1A1A1A]">
            Dashboard
          </a>
          {' / '}
          <a
            href={customerUrl}
            className="hover:text-[#1A1A1A]"
          >
            {property.portfolio}
          </a>
          {' / '}
          <span className="text-[#1A1A1A]">{property.address}</span>
        </div>

        {/* Property Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-light mb-2">{property.address}</h1>
              <p className="text-lg text-[#9FA38F]">{property.portfolio}</p>
            </div>
            <span
              className={`text-sm px-4 py-2 rounded font-medium ${
                property.isOwned
                  ? 'bg-[#DFFF5E] text-[#1A1A1A]'
                  : 'bg-[#B1E5FF] text-[#1A1A1A]'
              }`}
            >
              {property.isOwned ? 'Customer Owned' : 'Leased Property'}
            </span>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="mb-8">
          <SharePropertyButtons
            property={property}
            partnerName={partner.name}
            propertyUrl={propertyUrl}
            isIllinois={isIllinois}
          />
        </div>

        {/* Satellite View */}
        <div className="mb-12">
          <h2 className="text-2xl font-light mb-4">Satellite View</h2>
          <SatelliteMap address={property.address} apiKey={apiKey} />
        </div>

        {/* Property Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Economics */}
          <div>
            <h2 className="text-2xl font-light mb-6">Economics</h2>
            <div className="space-y-6">
              <div className="bg-[#F5F5F5] rounded-lg p-6">
                <div className="text-sm uppercase tracking-wide text-[#9FA38F] mb-2">
                  Annual Lease Value
                </div>
                <div className="text-4xl font-light">{property.leasePerYear} <span className="text-lg text-[#9FA38F]">per year</span></div>
                {!property.isOwned && (
                  <div className="text-sm text-[#9FA38F] mt-2">
                    To be potentially split with landlord
                  </div>
                )}
              </div>

              <div className="bg-[#F5F5F5] rounded-lg p-4">
                <div className="text-sm uppercase tracking-wide text-[#9FA38F] mb-2">
                  System Size
                </div>
                <div className="text-4xl font-light">
                  {property.systemSize.toLocaleString()} <span className="text-lg text-[#9FA38F]">kW</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div>
            <h2 className="text-2xl font-light mb-6">Property Details</h2>
            <div className="space-y-4">
              <div className="border-b border-[#9FA38F]/20 pb-4">
                <div className="text-sm text-[#9FA38F] mb-1">Address</div>
                <div className="font-medium">{property.address}</div>
              </div>

              <div className="border-b border-[#9FA38F]/20 pb-4">
                <div className="text-sm text-[#9FA38F] mb-1">Utility Provider</div>
                <div className="font-medium">{property.utility}</div>
              </div>

              <div className="border-b border-[#9FA38F]/20 pb-4">
                <div className="text-sm text-[#9FA38F] mb-1">Property Owner</div>
                <div className="font-medium">{property.ownerName}</div>
              </div>

              <div className="border-b border-[#9FA38F]/20 pb-4">
                <div className="text-sm text-[#9FA38F] mb-1">Ownership Type</div>
                <div className="font-medium">{property.type}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ownership-Specific Information */}
        <div className="mb-12">
          <div className="bg-[#B1E5FF]/10 border-l-4 border-[#B1E5FF] rounded p-8">
            <h2 className="text-2xl font-light mb-4">{ownershipInfo.title}</h2>
            <p className="text-lg mb-6">{ownershipInfo.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownershipInfo.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#B1E5FF] mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mb-12">
          <h2 className="text-2xl font-light mb-6">Why This Opportunity is Viable</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F5F5F5] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#DFFF5E] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#1A1A1A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">
                {property.isOwned ? 'Direct Control' : 'Favorable Relationship'}
              </h3>
              <p className="text-[#9FA38F]">
                {property.isOwned
                  ? 'As the property owner, you have direct control to move quickly on this opportunity.'
                  : 'Strong landlord relationship enables smooth negotiations and mutual benefits.'}
              </p>
            </div>

            <div className="bg-[#F5F5F5] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#B1E5FF] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#1A1A1A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Developer Ready</h3>
              <p className="text-[#9FA38F]">
                We already have developer interest and indicative pricing in hand, ready
                to move forward.
              </p>
            </div>

            <div className="bg-[#F5F5F5] rounded-lg p-6">
              <div className="w-12 h-12 bg-[#DFFF5E] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#1A1A1A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2"><strong>Market Timing & ITC</strong></h3>
              <p className="text-[#9FA38F]">
                <strong className="text-[#1A1A1A]">Current lease rates are at their peaks due to the federal Investment Tax Credit (ITC).</strong> Lease rates will decline sharply as the ITC disappears.
              </p>
            </div>
          </div>
        </div>

        {/* Illinois Community Solar Subscription */}
        {isIllinois && (
          <div className="mb-12">
            <div className="bg-[#DFFF5E]/20 border-l-4 border-[#DFFF5E] rounded p-8">
              <h2 className="text-2xl font-light mb-4">Illinois Community Solar Benefit</h2>
              <p className="text-lg mb-4">
                As a property in Illinois, you can subscribe your electricity loads to the community solar project on your rooftop once it's operational.
              </p>
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-[#DFFF5E] mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-lg">
                  This typically includes a <strong>5% fixed discount</strong> on your electricity rates through the community solar subscription.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Renewable Energy Credits (RECs) */}
        <div className="mb-12">
          <div className="bg-[#F5F5F5] rounded-lg p-8">
            <h2 className="text-2xl font-light mb-4">Renewable Energy Credits (RECs)</h2>
            <p className="text-lg mb-4">
              For customers who prioritize environmental attributes and renewable energy credits, we have flexible options.
            </p>
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-[#B1E5FF] mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg">
                <strong>Developers can often offer replacement RECs</strong> to ensure your organization maintains its renewable energy commitments while still benefiting from the solar lease revenue.
              </span>
            </div>
          </div>
        </div>

        {/* Roof Installation Upfront Payments */}
        <div className="mb-12">
          <div className="bg-[#B1E5FF]/10 border-l-4 border-[#B1E5FF] rounded p-8">
            <h2 className="text-2xl font-light mb-4">Roof Installation Financing</h2>
            <p className="text-lg mb-4">
              If your roof requires replacement or upgrades before solar installation, we have solutions to minimize out-of-pocket costs.
            </p>
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-[#B1E5FF] mr-2 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg">
                <strong>Developers can often offer upfront payments that cover new roof installations</strong> if needed, ensuring your facility is properly prepared for the solar system at no initial cost to your organization.
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#1A1A1A] text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-light mb-4">Next Steps</h2>
          <p className="text-lg mb-6 text-[#9FA38F] max-w-2xl mx-auto">
            We'd like to schedule a short working session (30 minutes) to walk through
            the specific economics for this property, confirm ownership assumptions, and
            align on whether this fits your near-term priorities.
          </p>
          <a
            href={`mailto:?subject=Community Solar Opportunity - ${property.address}`}
            className="inline-block bg-[#B1E5FF] hover:bg-[#94CAEB] text-[#1A1A1A] font-medium px-8 py-3 rounded-lg transition-colors"
          >
            Schedule a Call
          </a>
        </div>
      </main>
    </div>
  );
}
