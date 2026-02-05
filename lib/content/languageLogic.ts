import { Property } from '@/lib/types/property';

export function getOwnershipLanguage(property: Property): {
  title: string;
  description: string;
  benefits: string[];
} {
  if (property.isOwned) {
    return {
      title: 'YOUR FACILITY',
      description: `As the owner of this facility, you have direct control over pursuing this opportunity. The annual value of ${property.leasePerYear} would flow directly to your organization, with no capital required from your team.`,
      benefits: [
        'Direct control over decision-making',
        'Full annual revenue from solar lease',
        'No landlord negotiations required',
        'Project can move quickly with your approval'
      ]
    };
  } else {
    return {
      title: `LEASED FROM ${property.ownerName.toUpperCase()}`,
      description: `This facility is leased from ${property.ownerName}. We facilitate the discussion with your landlord to ensure both parties benefit - you receive energy savings and a portion of the lease revenue during your occupancy, while your landlord receives long-term lease income.`,
      benefits: [
        'Energy savings through community solar subscription',
        'Negotiated portion of lease revenue during occupancy',
        'Strengthens landlord relationship',
        'No capital required from your team'
      ]
    };
  }
}

export function getProcessExplanation(isOwned: boolean): {
  title: string;
  steps: Array<{ title: string; description: string }>;
} {
  if (isOwned) {
    return {
      title: 'How It Works',
      steps: [
        {
          title: '1. Initial Analysis',
          description: 'We\'ve already analyzed your property for solar viability, including roof capacity, utility rates, and economic projections.'
        },
        {
          title: '2. Developer Selection',
          description: 'Multiple solar developers compete to lease your roof space, ensuring the best terms and highest annual value.'
        },
        {
          title: '3. Lease Agreement',
          description: 'You sign a long-term solar lease (typically 20-25 years) with the winning developer, generating steady annual income.'
        },
        {
          title: '4. Construction & Operation',
          description: 'The developer builds and operates the solar system at no cost to you. You receive lease payments with no operational burden.'
        }
      ]
    };
  } else {
    return {
      title: 'How It Works',
      steps: [
        {
          title: '1. Three-Party Structure',
          description: 'As the tenant, you facilitate the introduction between your landlord and solar developers, benefiting all parties.'
        },
        {
          title: '2. Landlord Agreement',
          description: 'Your landlord signs the solar lease with the developer. We help negotiate a revenue split that benefits you during your occupancy.'
        },
        {
          title: '3. Community Solar Subscription',
          description: 'You subscribe to the community solar project, receiving discounted electricity (typically 10-20% below utility rates).'
        },
        {
          title: '4. Dual Benefits',
          description: 'You receive both energy savings and a negotiated portion of the lease revenue, while maintaining a strong landlord relationship.'
        }
      ]
    };
  }
}
