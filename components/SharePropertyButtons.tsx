'use client';

import { useState } from 'react';
import { Property } from '@/lib/types/property';
import { generatePropertyPDF } from '@/lib/pdf/generatePropertyPDF';
import { generatePropertyEmail, encodeEmailForGmail, encodeEmailForMailto } from '@/lib/email/templates';

interface SharePropertyButtonsProps {
  property: Property;
  partnerName: string;
  propertyUrl: string;
  isIllinois?: boolean;
}

export default function SharePropertyButtons({ property, partnerName, propertyUrl, isIllinois = false }: SharePropertyButtonsProps) {
  const [copied, setCopied] = useState<'message' | 'link' | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const emailTemplate = generatePropertyEmail(property, partnerName, propertyUrl);
  const gmailUrl = encodeEmailForGmail(emailTemplate);
  const mailtoUrl = encodeEmailForMailto(emailTemplate);

  const handleCopyMessage = async () => {
    try {
      const fullMessage = `${emailTemplate.body}\n\nView details: ${propertyUrl}`;
      await navigator.clipboard.writeText(fullMessage);
      setCopied('message');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied('link');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setPdfError(null);

      // Wait a brief moment to ensure the map is fully loaded
      await new Promise(resolve => setTimeout(resolve, 500));

      await generatePropertyPDF({
        property,
        partnerName,
        isIllinois,
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      setPdfError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

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
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded-lg transition-colors whitespace-nowrap"
            aria-label={`Open email about ${property.address} in Gmail`}
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Open in Gmail
          </a>

          <a
            href={mailtoUrl}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors whitespace-nowrap"
            aria-label={`Open email about ${property.address} in default email client`}
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            Email Client
          </a>

          <button
            onClick={handleCopyMessage}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors whitespace-nowrap"
            aria-label={copied === 'message' ? 'Email message copied' : `Copy email message about ${property.address}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied === 'message' ? '✓ Copied!' : 'Copy Message'}
          </button>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors whitespace-nowrap"
            aria-label={copied === 'link' ? 'Property link copied' : `Copy link to ${property.address} page`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {copied === 'link' ? '✓ Copied!' : 'Copy Link'}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              isGeneratingPDF
                ? 'bg-[#9FA38F] text-white cursor-not-allowed'
                : 'bg-[#1A1A1A] hover:bg-[#333333] text-white'
            }`}
            aria-label={isGeneratingPDF ? 'Generating PDF...' : `Download PDF for ${property.address}`}
          >
            {isGeneratingPDF ? (
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
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
