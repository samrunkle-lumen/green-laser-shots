/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Primary brand fonts (require font files)
        display: ['ABC Arizona Serif', 'Times', 'serif'],
        sans: ['ABC Pelikan', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ABC Pelikan Mono', 'Roboto Mono', 'monospace'],
        // Fallback fonts (Google Fonts - always available)
        'fallback-display': ['Times', 'serif'],
        'fallback-sans': ['Inter', 'system-ui', 'sans-serif'],
        'fallback-mono': ['Roboto Mono', 'monospace'],
      },
      colors: {
        lumen: {
          // Core Brand Colors
          'sky-blue': '#B1E5FF',
          'electric-yellow': '#DFFF5E',
          'graphite-black': '#1A1A1A',
          'concrete': '#9FA38F',
          'arctic-white': '#FFFFFF',
          
          // Sky Blue Scale
          'sky-blue-100': '#CAEDFF',
          'sky-blue-200': '#94CAEB',
          'sky-blue-300': '#85BDE1',
          'sky-blue-400': '#77AFD7',
          'sky-blue-500': '#68A2CD',
          
          // Electric Yellow Scale
          'electric-yellow-tint': '#ECFFB2',
          'electric-yellow-100': '#B8D150',
          'electric-yellow-200': '#90A343',
          'electric-yellow-300': '#697635',
          
          // Graphite Black Scale
          'graphite-100': '#656565',
          'graphite-200': '#595959',
          'graphite-300': '#4D4D4D',
          'graphite-400': '#404040',
          'graphite-500': '#333333',
          'graphite-600': '#262626',
          
          // Concrete Scale
          'concrete-100': '#E7E8E3',
          'concrete-200': '#CFD1C7',
          'concrete-300': '#B7BAAB',
        },
      },
      letterSpacing: {
        'eyebrow': '0.02em',
        'display': '-0.05em',
        'headline-lg': '-0.03em',
        'headline-md': '-0.03em',
        'subhead': '-0.02em',
        'cta': '0.04em',
      },
      lineHeight: {
        'eyebrow': '1.1',
        'display': '1.0',
        'headline': '1.0',
        'subhead': '1.0',
        'body': '1.2',
        'cta': '1.3',
      },
    },
  },
  plugins: [],
}
