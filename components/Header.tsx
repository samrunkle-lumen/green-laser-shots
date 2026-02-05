import Image from 'next/image';
import Link from 'next/link';
import { Partner } from '@/lib/types/property';

interface HeaderProps {
  partner?: Partner;
}

export default function Header({ partner }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#9FA38F]/20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <Image
                src="/logos/lumen/logo-black.svg"
                alt="Lumen Energy"
                width={140}
                height={42}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {partner && (
              <>
                <span className="text-2xl text-[#9FA38F]">×</span>
                <Image
                  src={partner.logoHorizontalDark}
                  alt={partner.name}
                  width={140}
                  height={42}
                  className="h-10 w-auto"
                  priority
                />
              </>
            )}
          </div>

          <p className="text-sm text-[#9FA38F] hidden md:block">
            Turning rooftops into revenue
          </p>
        </div>
      </div>
    </header>
  );
}
