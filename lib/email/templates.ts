import { Customer, Property } from '@/lib/types/property';

export interface EmailTemplate {
  subject: string;
  body: string;
}

// For customer to share with their internal team
export function generateInternalTeamEmail(customer: Customer, customerUrl: string): EmailTemplate {
  const { name, properties, totalAnnualValue } = customer;

  // Format total value
  const formattedValue = totalAnnualValue >= 1000000
    ? `$${(totalAnnualValue / 1000000).toFixed(1)}M`
    : `$${Math.round(totalAnnualValue / 1000)}K`;

  const subject = `${name} Community Solar Opportunity - ${formattedValue}/year`;

  const body = `Hey team,

Wanted to flag a significant revenue opportunity I came across for our facilities.

We have ${properties.length} ${properties.length === 1 ? 'site' : 'sites'} that qualify for community solar projects - this could generate approximately ${formattedValue} per year in additional revenue with zero capital investment or operational impact from our side.

The timing matters: Federal tax credits are at their peak right now and will drop significantly soon. Developers are actively looking for sites like ours.

I've reviewed the details and the economics look solid. Worth a quick conversation to see if this fits our priorities.

View full details: ${customerUrl}

Happy to share more context if you're interested.`;

  return { subject, body };
}

// For partner to reach out to customer (external outreach)
export function generatePartnerOutreachEmail(customer: Customer, customerUrl: string): EmailTemplate {
  const { name, properties, totalAnnualValue } = customer;

  // Format total value
  const formattedValue = totalAnnualValue >= 1000000
    ? `$${(totalAnnualValue / 1000000).toFixed(1)}M`
    : `$${Math.round(totalAnnualValue / 1000)}K`;

  // Format property addresses as bullet points
  const propertyList = properties.map(p => `- ${p.address}`).join('\n');

  const subject = `${name} Community Solar Opportunity - ${formattedValue}/year`;

  const body = `Hi,

We're reaching out with a very specific, time-sensitive opportunity we've already analyzed across ${properties.length} of your facilities.

We've identified front-of-the-meter clean energy projects that can generate approximately ${formattedValue} per year in incremental value - with no operational disruption and no capital required from your team.

Site addresses:
${propertyList}

What makes these opportunities viable:

- ${customer.ownedCount} ${customer.ownedCount === 1 ? 'site is' : 'sites are'} customer-owned, allowing projects to move quickly
- ${customer.leasedCount} ${customer.leasedCount === 1 ? 'site is' : 'sites are'} leased - we can facilitate landlord discussions
- We already have developer interest and indicative pricing in hand
- Current lease rates are at their peaks due to the federal Investment Tax Credit (ITC)

What we're proposing:

A short working session (30 minutes) to:

1. Walk through the site-specific economics
2. Confirm ownership / control assumptions
3. Align on whether this fits your near-term priorities

View full details: ${customerUrl}

Would you be open to a quick conversation next week?

Best,
Lumen Energy`;

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

export function generatePropertyEmail(property: Property, partnerName: string, propertyUrl: string): EmailTemplate {
  const { address, leasePerYear, systemSize, isOwned, ownerName } = property;

  // Determine ownership language
  const ownershipBullet = isOwned
    ? 'This site is customer-owned, allowing the project to move quickly.'
    : `This site is controlled via a lease with ${ownerName}, who we believe will move fast, allowing the project to move quickly.`;

  const subject = `Community Solar Opportunity - ${address}`;

  const body = `Hi,

We're reaching out with a very specific, time-sensitive opportunity we've already analyzed for one of your sites.

At ${address}, we've identified a front-of-the-meter clean energy project that can generate approximately ${leasePerYear} per year in incremental value - with no operational disruption and no capital required from your team.

The economics are unusually strong due to current incentive structures, including the Investment Tax Credit, which as you likely know is set to step down.

What makes this opportunity viable:

- ${ownershipBullet}
- We already have developer interest and indicative pricing in hand.
- In many regions, lease rates are currently at their peaks, meaning now is the time to act.
- System size: ${systemSize.toLocaleString()} kW

What we're proposing:

A short working session (30 minutes) to:

1. Walk through the site-specific economics
2. Confirm ownership / control assumptions
3. Align on whether this fits your near-term priorities

View full details: ${propertyUrl}

Would you be open to a quick conversation next week?

Best,
${partnerName}`;

  return { subject, body };
}
