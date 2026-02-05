'use client';

import { Property } from '@/lib/types/property';
import { generatePropertyPDF } from '@/lib/pdf/generatePropertyPDF';

interface PrintButtonProps {
  property: Property;
  partnerName: string;
}

export default function PrintButton({ property, partnerName }: PrintButtonProps) {
  const handleDownload = () => {
    generatePropertyPDF({
      property,
      partnerName,
      isIllinois: false,
    });
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-block bg-white hover:bg-gray-100 text-[#1A1A1A] font-medium px-8 py-3 rounded-lg transition-colors"
    >
      Download PDF
    </button>
  );
}
