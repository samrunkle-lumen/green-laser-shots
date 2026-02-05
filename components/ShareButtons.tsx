'use client';

import { useState } from 'react';
import { Customer } from '@/lib/types/property';
import { generateCustomerEmail, encodeEmailForGmail, encodeEmailForMailto } from '@/lib/email/templates';

interface ShareButtonsProps {
  customer: Customer;
  customerUrl: string;
}

export default function ShareButtons({ customer, customerUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState<'message' | 'link' | null>(null);

  const emailTemplate = generateCustomerEmail(customer);
  const gmailUrl = encodeEmailForGmail(emailTemplate);
  const mailtoUrl = encodeEmailForMailto(emailTemplate);

  const handleCopyMessage = async () => {
    try {
      const fullMessage = `${emailTemplate.body}\n\nView details: ${customerUrl}`;
      await navigator.clipboard.writeText(fullMessage);
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
    <div className="bg-[#B1E5FF]/10 rounded-lg p-4 border-l-4 border-[#B1E5FF]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold text-[#1A1A1A] mb-1">
            📤 Share Customer Page
          </div>
          <div className="text-xs text-[#9FA38F]">
            Send pre-filled outreach email or copy link
          </div>
        </div>
      </div>

      {/* Primary Action: Gmail */}
      <div className="mb-3">
        <a
          href={gmailUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center px-4 py-3 text-base font-semibold text-[#1A1A1A] bg-[#B1E5FF] hover:bg-[#94CAEB] rounded-lg transition-all shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Open in Gmail
          <span className="ml-2 text-xs bg-[#1A1A1A] text-white px-2 py-0.5 rounded">
            Recommended
          </span>
        </a>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <a
          href={mailtoUrl}
          className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          Email Client
        </a>

        <button
          onClick={handleCopyMessage}
          className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied === 'message' ? '✓ Copied!' : 'Copy Text'}
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-gray-50 border border-[#9FA38F]/30 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {copied === 'link' ? '✓ Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}
