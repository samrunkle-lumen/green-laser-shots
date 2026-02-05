'use client';

import { useState, useEffect, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Only render animations after client-side mount to avoid hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Check access codes
    if (accessCode === 'R00ftop$r3V3nu3') {
      // Lumen admin access
      document.cookie = 'access_level=admin; path=/; max-age=86400';
      router.push('/admin');
    } else if (accessCode === 'Chang3Cl1m4tECh4NG3$') {
      // Watershed partner access
      document.cookie = 'access_level=watershed; path=/; max-age=86400';
      router.push('/partner/watershed');
    } else {
      setError(true);
      setLoading(false);
    }
  };

  // Generate pixelated solar panel pattern
  const generateSolarPixels = () => {
    const pixels = [];
    const cols = 160;
    const rows = 45;
    const pixelSize = 5;
    const gap = 1.5; // Gap between pixels

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Create perspective effect - more concentrated at bottom
        const depthFactor = Math.pow(row / rows, 1.5);

        // Create organic flowing patterns with wave-like clusters
        const waveX = Math.sin(col * 0.08 + row * 0.15) * 0.4;
        const waveY = Math.cos(col * 0.12 - row * 0.1) * 0.3;
        const clusterPattern = (waveX + waveY + 1) / 2;

        // Add diagonal/angled bias to the blank spaces
        const angleBias = Math.sin((col - row * 0.3) * 0.05) * 0.3;

        const randomness = Math.random();

        // Even higher threshold to remove more pixels, especially at top
        const threshold = 0.45 + (1 - depthFactor) * 0.75 + angleBias * 0.2;

        if (randomness > threshold * (1 - clusterPattern * 0.5)) {
          // Perfect grid positioning
          const xPosition = (col / cols) * 100;
          const yPosition = 65 + (row / rows) * 35;

          pixels.push(
            <div
              key={`${row}-${col}`}
              className="absolute bg-[#1A1A1A]"
              style={{
                width: `${pixelSize}px`,
                height: `${pixelSize}px`,
                left: `${xPosition}%`,
                top: `${yPosition}%`,
                opacity: 0.52,
              }}
            />
          );
        }
      }
    }
    return pixels;
  };

  return (
    <main className="min-h-screen bg-[#DFFF5E] relative overflow-hidden flex items-center justify-center">
      {/* Solar Pixel Grid Pattern */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {generateSolarPixels()}
        </div>
      )}

      {/* Main Content - No white box */}
      <div className="relative z-10 px-4 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <Image
            src="/logos/lumen/logo-black.svg"
            alt="Lumen Energy"
            width={200}
            height={60}
            priority
            className="drop-shadow-lg"
          />
        </div>

        {/* Access Code Input */}
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="password"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value);
                setError(false);
              }}
              className={`
                w-full px-4 py-2.5 pr-12 text-sm text-center
                bg-[#1A1A1A]/10 backdrop-blur-sm
                border-2 rounded-lg
                focus:outline-none focus:ring-2 transition-all
                placeholder:text-[#1A1A1A]/40 text-[#1A1A1A]
                ${error
                  ? 'border-red-500/50 focus:ring-red-300/50'
                  : 'border-[#1A1A1A]/20 focus:ring-[#1A1A1A]/30 focus:border-[#1A1A1A]/40'
                }
              `}
              placeholder="Enter access code"
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !accessCode}
              className={`
                absolute right-2 top-1/2 -translate-y-1/2
                w-8 h-8 rounded-md flex items-center justify-center
                transition-all
                ${loading || !accessCode
                  ? 'bg-[#1A1A1A]/10 text-[#1A1A1A]/30 cursor-not-allowed'
                  : 'bg-[#1A1A1A]/80 text-[#DFFF5E] hover:bg-[#1A1A1A] hover:scale-105'
                }
              `}
            >
              {loading ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
            </button>
          </div>
          {error && (
            <p className="mt-3 text-sm text-[#1A1A1A]/70 text-center font-medium">
              Invalid access code
            </p>
          )}
        </form>

        {/* Tagline */}
        <div className="mt-8 text-center">
          <p className="text-[#1A1A1A]/60 text-sm font-medium">
            Turning rooftops into revenue
          </p>
        </div>
      </div>

    </main>
  );
}
