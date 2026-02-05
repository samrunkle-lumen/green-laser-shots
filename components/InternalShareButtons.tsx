'use client';

import { useState } from 'react';
import { Customer } from '@/lib/types/property';
import { generateInternalTeamEmail, encodeEmailForGmail, encodeEmailForMailto } from '@/lib/email/templates';

interface InternalShareButtonsProps {
  customer: Customer;
  customerUrl: string;
}

export default function InternalShareButtons({ customer, customerUrl }: InternalShareButtonsProps) {
  const [copied, setCopied] = useState<'message' | 'link' | null>(null);

  const emailTemplate = generateInternalTeamEmail(customer, customerUrl);
  const gmailUrl = encodeEmailForGmail(emailTemplate);
  const mailtoUrl = encodeEmailForMailto(emailTemplate);

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(emailTemplate.body);
      setCopied('message');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(customerUrl);
      setCopied('link');
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-[#F5F5F5] rounded-lg p-6 mb-12">
      <h3 className="text-lg font-medium mb-3">Share with Your Team</h3>
      <p className="text-sm text-[#9FA38F] mb-4">
        Share this opportunity analysis with colleagues and stakeholders
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Share with internal team">
        <a
          href={gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded-lg transition-colors"
          aria-label={`Open email about ${customer.name} in Gmail`}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Open in Gmail
        </a>

        <a
          href={mailtoUrl}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors"
          aria-label={`Open email about ${customer.name} in default email client`}
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Email Client
        </a>

        <button
          onClick={handleCopyMessage}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors"
          aria-label={copied === 'message' ? 'Email message copied' : `Copy email message about ${customer.name}`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied === 'message' ? '✓ Copied!' : 'Copy Message'}
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors"
          aria-label={copied === 'link' ? 'Link to page copied' : `Copy link to this page`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {copied === 'link' ? '✓ Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
