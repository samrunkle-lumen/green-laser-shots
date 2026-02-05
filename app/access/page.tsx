'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AccessGate() {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnTo = searchParams.get('returnTo') || '/partner/watershed';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      // Verify access key by trying to access the protected page with the key
      const testUrl = `${returnTo}?access=${encodeURIComponent(accessKey)}`;
      const response = await fetch(testUrl, { method: 'HEAD', redirect: 'manual' });

      // If successful, navigate to the page with the access key
      // The middleware will set the cookie
      window.location.href = testUrl;
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-lg p-6 shadow-sm mb-4">
            <Image
              src="/logos/lumen/logo-black.svg"
              alt="Lumen Energy"
              width={120}
              height={40}
              className="mx-auto"
            />
          </div>
          <h1 className="text-3xl font-light text-[#1A1A1A] mb-2">
            Partner Dashboard Access
          </h1>
          <p className="text-[#9FA38F]">
            Enter your access key to continue
          </p>
        </div>

        {/* Access Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="accessKey"
                className="block text-sm font-medium text-[#1A1A1A] mb-2"
              >
                Access Key
              </label>
              <input
                type="password"
                id="accessKey"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full px-4 py-3 border border-[#9FA38F]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B1E5FF] text-lg"
                placeholder="Enter access key"
                required
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">
                  Invalid access key. Please try again.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !accessKey}
              className="w-full bg-[#B1E5FF] hover:bg-[#94CAEB] text-[#1A1A1A] font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#9FA38F]/20">
            <p className="text-sm text-[#9FA38F] text-center">
              Don't have an access key? Contact your Lumen Energy representative.
            </p>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center text-sm text-[#9FA38F]">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Secure access for partners only
          </div>
        </div>
      </div>
    </div>
  );
}
