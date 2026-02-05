import { Customer } from '@/lib/types/property';

export interface EmailTemplate {
  subject: string;
  body: string;
}

export function generateCustomerEmail(customer: Customer): EmailTemplate {
  const { name, properties, totalAnnualValue, ownedCount, leasedCount } = customer;

  // Create site list
  const siteList = properties
    .map(p => `- ${p.address}`)
    .join('\n');

  // Determine ownership language for viability bullets
  let ownershipBullet = '';
  if (ownedCount === properties.length) {
    ownershipBullet = 'These sites are customer-owned, allowing the project to move quickly.';
  } else if (leasedCount === properties.length) {
    ownershipBullet = 'These sites are controlled via leases with landlords who we believe will move fast, allowing the project to move quickly.';
  } else {
    ownershipBullet = 'These sites are customer-owned or controlled via leases with landlords who we believe will move fast, allowing the project to move quickly.';
  }

  // Determine ITC language based on total value
  const itcLanguage = totalAnnualValue >= 1000000
    ? 'set to sunset by July 4th 2026'
    : 'set to step down';

  // Format total value
  const formattedValue = totalAnnualValue >= 1000000
    ? `$${(totalAnnualValue / 1000000).toFixed(1)}M`
    : `$${Math.round(totalAnnualValue / 1000)}K`;

  const subject = `Community Solar Opportunity for ${name}`;

  const body = `Hi,

We're reaching out with a very specific, time-sensitive opportunity we've already analyzed for some of your sites.

Across the following sites, we've identified front-of-the-meter clean energy projects that can generate approximately ${formattedValue} per year in incremental value for ${name} - with no operational disruption and no capital required from your team.

${siteList}

The economics are unusually strong due to current incentive structures, including the Investment Tax Credit, which as you likely know is ${itcLanguage}.

What makes ${properties.length === 1 ? 'this opportunity' : 'these opportunities'} viable:

- ${ownershipBullet}
- We already have developer interest and indicative pricing in hand.
- In many regions, lease rates are currently at their peaks, meaning now is the time to act.

What we're proposing:

A short working session (30 minutes) to:

1. Walk through the site-specific economics
2. Confirm ownership / control assumptions
3. Align on whether this fits ${name}'s near-term priorities

Would you be open to a quick conversation next week?

Best,
[Your Name]`;

  return { subject, body };
}

export function encodeEmailForGmail(template: EmailTemplate): string {
  const { subject, body } = template;
  return `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function encodeEmailForMailto(template: EmailTemplate): string {
  const { subject, body } = template;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
