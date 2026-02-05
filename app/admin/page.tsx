import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAllPartners } from '@/config/partners';
import { loadPartnerData } from '@/lib/data/parseCSV';
import { groupPropertiesByCustomer } from '@/lib/utils/aggregations';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const accessLevel = cookieStore.get('access_level')?.value;

  // Verify admin access
  if (accessLevel !== 'admin') {
    redirect('/');
  }

  // Load all partners and their data
  const partners = getAllPartners();
  const partnerStats = partners.map(partner => {
    const properties = loadPartnerData(partner.id, partner.dataFile);
    const customers = groupPropertiesByCustomer(properties, partner.id);
    return {
      partner,
      propertyCount: properties.length,
      customerCount: customers.length,
    };
  });

  const totalProperties = partnerStats.reduce((sum, stat) => sum + stat.propertyCount, 0);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="bg-white border-b border-[#9FA38F]/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Image
              src="/logos/lumen/logo-black.svg"
              alt="Lumen Energy"
              width={140}
              height={42}
              className="h-10 w-auto"
              priority
            />
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#DFFF5E] text-[#1A1A1A]">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin Access
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-[#1A1A1A] mb-2">
            Partner Dashboards
          </h1>
          <p className="text-[#9FA38F]">
            Select a partner to view their community solar opportunities
          </p>
        </div>

        {/* Partner Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerStats.map(({ partner, propertyCount, customerCount }) => (
            <Link
              key={partner.id}
              href={`/partner/${partner.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all p-6 border border-[#9FA38F]/20 hover:border-[#B1E5FF] group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 flex items-center">
                  <Image
                    src={partner.logoHorizontalDark}
                    alt={partner.name}
                    width={140}
                    height={42}
                    className="h-10 w-auto max-w-[140px] object-contain"
                  />
                </div>
                <svg
                  className="w-5 h-5 text-[#9FA38F] group-hover:text-[#B1E5FF] group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-[#9FA38F]">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {customerCount} {customerCount === 1 ? 'customer' : 'customers'}
                </div>
                <div className="flex items-center text-sm text-[#9FA38F]">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {propertyCount} {propertyCount === 1 ? 'property' : 'properties'}
                </div>
                <div className="flex items-center text-sm text-[#9FA38F]">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Community solar opportunities
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#9FA38F]/20">
                <span className="text-xs text-[#9FA38F]">
                  Click to access dashboard →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#9FA38F]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#9FA38F]">Active Partners</span>
              <svg className="w-5 h-5 text-[#B1E5FF]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div className="text-3xl font-light text-[#1A1A1A]">{partners.length}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#9FA38F]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#9FA38F]">Total Properties</span>
              <svg className="w-5 h-5 text-[#DFFF5E]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <div className="text-3xl font-light text-[#1A1A1A]">{totalProperties}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-[#9FA38F]/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#9FA38F]">Platform Status</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="text-lg font-medium text-[#1A1A1A]">Active</div>
          </div>
        </div>
      </main>
    </div>
  );
}
