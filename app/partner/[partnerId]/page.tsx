import { notFound } from 'next/navigation';
import Header from '@/components/Header';
// import CustomerSection from './CustomerSection';
import FilterableCustomerList from '@/components/FilterableCustomerList';
import { getPartner } from '@/config/partners';
import { loadPartnerData } from '@/lib/data/parseCSV';
import { groupPropertiesByCustomer } from '@/lib/utils/aggregations';

interface PageProps {
  params: Promise<{
    partnerId: string;
  }>;
}

export default async function PartnerDashboard({ params }: PageProps) {
  const { partnerId } = await params;
  const partner = getPartner(partnerId);

  if (!partner) {
    notFound();
  }

  // Load and process data
  const properties = loadPartnerData(partner.id, partner.dataFile);
  const customers = groupPropertiesByCustomer(properties, partner.id);

  // Calculate summary statistics
  const totalProperties = properties.length;
  const totalAnnualValue = customers.reduce(
    (sum, customer) => sum + customer.totalAnnualValue,
    0
  );
  const totalCustomers = customers.length;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header partner={partner} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light mb-4">
            {partner.name} Partnership Dashboard
          </h1>
          <p className="text-lg text-[#9FA38F]">
            Community solar opportunities across your customer portfolio
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm uppercase tracking-wide text-[#9FA38F] mb-2 font-medium">
              Total Customers
            </div>
            <div className="text-3xl font-light">{totalCustomers}</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm uppercase tracking-wide text-[#9FA38F] mb-2 font-medium">
              Total Properties
            </div>
            <div className="text-3xl font-light">{totalProperties}</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-sm uppercase tracking-wide text-[#9FA38F] mb-2 font-medium">
              Total Annual Value
            </div>
            <div className="text-3xl font-light">
              {totalAnnualValue >= 1000000
                ? `$${(totalAnnualValue / 1000000).toFixed(2)}M`
                : `$${Math.round(totalAnnualValue / 1000).toLocaleString()}K`}
            </div>
          </div>
        </div>

        <FilterableCustomerList customers={customers} partnerId={partnerId} />
      </main>
    </div>
  );
}
