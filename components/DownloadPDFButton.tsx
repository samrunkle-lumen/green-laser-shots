'use client';

import { useState } from 'react';
import { Property } from '@/lib/types/property';
import { generatePropertyPDF } from '@/lib/pdf/generatePropertyPDF';

interface DownloadPDFButtonProps {
  property: Property;
  partnerName: string;
  isIllinois?: boolean;
}

export default function DownloadPDFButton({
  property,
  partnerName,
  isIllinois = false,
}: DownloadPDFButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Wait a brief moment to ensure the map is fully loaded
      await new Promise(resolve => setTimeout(resolve, 500));

      await generatePropertyPDF({
        property,
        partnerName,
        isIllinois,
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className={`inline-flex items-center px-6 py-3 text-sm font-medium rounded-lg transition-all ${
          isGenerating
            ? 'bg-[#9FA38F] text-white cursor-not-allowed'
            : 'bg-[#1A1A1A] hover:bg-[#333333] text-white'
        }`}
        aria-label={isGenerating ? 'Generating PDF...' : 'Download property details as PDF'}
      >
        {isGenerating ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
