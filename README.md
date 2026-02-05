# Green Laser Shots - Community Solar Landing Pages

A three-tier landing page system for Watershed and other partners to conduct outreach to their customers regarding community solar opportunities.

## Overview

This application enables partners like Watershed to:
- View all community solar opportunities across their customer portfolio
- Share customer-specific pages with targeted outreach messaging
- Provide detailed property-level information with satellite views and economics

**IMPORTANT:** "Green Laser Shot" is an internal code name and never appears in customer-facing pages.

## Features

### Tier 1: Partner Dashboard
- View all properties grouped by customer
- Collapsible customer sections with summary statistics
- Share customer pages via:
  - Gmail (direct compose with pre-filled content)
  - Default email client (mailto: links)
  - Copy to clipboard (message + link)
- Filter and search capabilities

**Example:** `/partner/watershed`

### Tier 2: Customer Pages
- Overview of all properties for a specific customer
- High-level economics summary
- Property cards with key details
- Ownership-aware language (owned vs leased)
- Process explanation customized to ownership type
- Share and download functionality

**Example:** `/customer/walmart?partner=watershed`

### Tier 3: Property Pages
- Full-screen satellite view via Google Maps API
- Detailed property and economic information
- Ownership-specific language and benefits
- Value proposition bullets
- Print/PDF functionality

**Example:** `/property/walmart-elwood-60421?partner=watershed`

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Google Maps JavaScript API
- **Branding:** Lumen Energy + Watershed joint branding

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/green-laser-shots.git
cd green-laser-shots
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
green-laser-shots/
├── app/
│   ├── partner/[partnerId]/
│   │   ├── page.tsx              # Partner dashboard (Tier 1)
│   │   └── CustomerSection.tsx   # Collapsible customer component
│   ├── customer/[customerId]/
│   │   └── page.tsx              # Customer pages (Tier 2)
│   ├── property/[propertyId]/
│   │   └── page.tsx              # Property pages (Tier 3)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx                # Joint branding header
│   ├── ShareButtons.tsx          # Three-method sharing
│   └── SatelliteMap.tsx          # Google Maps wrapper
├── config/
│   └── partners.ts               # Partner configuration
├── lib/
│   ├── data/
│   │   └── parseCSV.ts           # CSV parser
│   ├── types/
│   │   └── property.ts           # TypeScript interfaces
│   ├── utils/
│   │   └── aggregations.ts       # Data grouping and calculations
│   ├── content/
│   │   └── languageLogic.ts      # Ownership-aware copy
│   └── email/
│       └── templates.ts          # Green Laser Shot email templates
├── data/
│   └── partners/
│       └── watershed/
│           └── properties.csv    # Watershed property data
└── public/
    ├── logos/
    │   ├── lumen/
    │   └── watershed/
    └── fonts/
        └── lumen/
```

## Data Structure

Properties are stored in CSV format with the following fields:

- **Portfolio:** Customer name (e.g., "Walmart")
- **Property address:** Full street address
- **Roof max PV (kW):** Maximum solar capacity
- **System Size (kW):** Actual system size
- **Lease per year:** Annual lease value
- **$/kW:** Rate per kilowatt
- **Utility:** Utility company name
- **Owner name:** Property owner/landlord
- **Type:** "Leased" or "Owned"

### Ownership Logic
- When `Portfolio` == `Owner name` → Customer OWNS the building
- When `Portfolio` != `Owner name` → Building is LEASED from landlord

## Adding New Partners

To add a new partner:

1. Add partner configuration to `config/partners.ts`:
```typescript
newpartner: {
  id: 'newpartner',
  name: 'New Partner',
  logoHorizontalDark: '/logos/newpartner/logo-dark.svg',
  logoHorizontalWhite: '/logos/newpartner/logo-white.svg',
  logoVerticalDark: '/logos/newpartner/logo-vertical-dark.svg',
  logoVerticalWhite: '/logos/newpartner/logo-vertical-white.svg',
  dataFile: 'data/partners/newpartner/properties.csv',
  primaryColor: '#1A1A1A',
}
```

2. Add partner CSV data to `data/partners/newpartner/properties.csv`

3. Add partner logos to `public/logos/newpartner/`

No code changes required!

## Email Templates

Pre-filled email templates follow the "Green Laser Shot" format:

- Opening: "very specific, time-sensitive opportunity"
- Value statement with total annual value
- Site list (bullet points)
- Three viability bullets
- 30-minute working session proposal
- "Would you be open to a quick conversation next week?"

Templates are dynamically generated based on:
- Customer name
- Total annual value
- Number of properties
- Ownership structure (owned vs leased)

## Branding

### Lumen Energy
- **Colors:** Sky Blue (#B1E5FF), Electric Yellow (#DFFF5E), Graphite Black (#1A1A1A), Concrete (#9FA38F), Arctic White (#FFFFFF)
- **Fonts:** ABC Arizona Serif (display), ABC Pelikan (body)
- **Tagline:** "Turning rooftops into revenue"

### Joint Branding Pattern
- Lumen logo on the left, partner logo on the right
- Use horizontal variants for headers
- White background with dark logos

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Self-hosted

## Environment Variables

Required:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Development

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

Lint code:
```bash
npm run lint
```

## License

Proprietary - Lumen Energy

## Support

For questions or issues, contact the Lumen Energy development team.
