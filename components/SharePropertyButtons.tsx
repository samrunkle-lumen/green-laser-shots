'use client';

import { useState } from 'react';
import { Property } from '@/lib/types/property';
import { generatePropertyPDF } from '@/lib/pdf/generatePropertyPDF';

interface SharePropertyButtonsProps {
  property: Property;
  partnerName: string;
  propertyUrl: string;
}

export default function SharePropertyButtons({ property, partnerName, propertyUrl }: SharePropertyButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadPDF = () => {
    generatePropertyPDF(property, partnerName);
  };

  const shareMessage = `Community Solar Opportunity - ${property.address}\n\nAnnual value: ${property.leasePerYear}\nSystem size: ${property.systemSize.toLocaleString()} kW\n\nView full details: ${propertyUrl}`;

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(`Community Solar - ${property.address}`)}&body=${encodeURIComponent(shareMessage)}`;

  return (
    <div className="bg-[#DFFF5E]/20 border-l-4 border-[#DFFF5E] rounded-lg p-5">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-1">
            Share with Your Team
          </h3>
          <p className="text-sm text-[#9FA38F]">
            Forward this opportunity to colleagues and decision makers
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center" role="group" aria-label="Share property information">
          <a
            href={mailtoUrl}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors whitespace-nowrap"
            aria-label={`Send email about ${property.address}`}
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Email
          </a>
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors whitespace-nowrap"
            aria-label={copied ? 'Property link copied' : `Copy link to ${property.address} page`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded-lg transition-colors whitespace-nowrap"
            aria-label={`Download PDF for ${property.address}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
