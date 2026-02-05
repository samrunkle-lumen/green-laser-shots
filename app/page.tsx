import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center mb-12">
          <Image
            src="/logos/lumen/logo-black.svg"
            alt="Lumen Energy"
            width={200}
            height={60}
            priority
          />
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-light mb-6 text-[#1A1A1A]">
            Community Solar Opportunities
          </h1>
          <p className="text-xl mb-8 text-[#9FA38F]">
            Turning rooftops into revenue
          </p>

          <div className="mt-12">
            <h2 className="text-2xl font-light mb-6">Partner Access</h2>
            <div className="space-y-4">
              <Link
                href="/partner/watershed"
                className="block bg-[#B1E5FF] hover:bg-[#94CAEB] text-[#1A1A1A] font-medium py-4 px-8 rounded-lg transition-colors"
              >
                Watershed Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
