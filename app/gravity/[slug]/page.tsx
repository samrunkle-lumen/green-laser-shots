import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import InternalShareButtons from '@/components/InternalShareButtons';
import { getPartner } from '@/config/partners';
import { loadPartnerData } from '@/lib/data/parseCSV';
import { groupPropertiesByCustomer, getCustomerBySlug, formatCurrency } from '@/lib/utils/aggregations';
import { getProcessExplanation } from '@/lib/content/languageLogic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function GravityCustomerPage({ params }: PageProps) {
  const { slug } = await params;

  // Gravity customer pages are always for the gravity partner
  const partnerId = 'gravity';
  const partner = getPartner(partnerId);

  if (!partner) {
    notFound();
  }

  // Load data
  const properties = loadPartnerData(partner.id, partner.dataFile);
  const customers = groupPropertiesByCustomer(properties, partner.id);
  const customer = getCustomerBySlug(customers, slug);

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

        {/* Properties Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-light mb-6">Your Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.properties.map((property) => (
              <Link
                key={property.id}
                href={`/property/${property.id}?partner=${partnerId}`}
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
